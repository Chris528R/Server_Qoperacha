import { createAuthenticatedClient, isFinalizedGrant, type OutgoingPayment, type Quote, type WalletAddress } from "@interledger/open-payments";
import { ENVS } from "../../plugins/env.plugin.js";

type PaymentOptions = {
  senderWalletUrl: string,
  receiverWalletUrl: string,
  amount: number,
  id: String
}

interface PaymentInitResult {
  redirectUri: string;
  continueUri: string;
  continueAccessToken: string;
  senderWallet: WalletAddress;
  quote: Quote;
};

type PaymentInitResultWithoutRedirectUri = Omit<PaymentInitResult, "redirectUri">

export interface IPaymentService {
  doPayment({ senderWalletUrl, receiverWalletUrl, amount }: PaymentOptions): Promise<PaymentInitResult>

  finalizePayment({ continueUri, continueAccessToken, senderWallet, quote }: PaymentInitResultWithoutRedirectUri): Promise<OutgoingPayment>
  // doRecurrentPayment();

}

export class PaymentService implements IPaymentService {
  private clientPromise;

  constructor() {    
    this.clientPromise = createAuthenticatedClient({
      walletAddressUrl: process.env.WALLET_URL!,
      privateKey: "private.key",
      keyId: process.env.KEY_ID!,
    });
  }


  async doPayment({ senderWalletUrl, receiverWalletUrl, amount, id }: PaymentOptions): Promise<PaymentInitResult> {
    const client = await this.clientPromise;

    const senderWallet = await client.walletAddress.get({ url: senderWalletUrl });
    const receiverWallet = await client.walletAddress.get({ url: receiverWalletUrl });


    const incomingPaymentGrant = await client.grant.request(
      { url: receiverWallet.authServer },
      {
        access_token: {
          access: [{ type: "incoming-payment", actions: ["create"] }],
        },
      }
    );
    if (!isFinalizedGrant(incomingPaymentGrant)) {
      throw new Error("Grant de incoming payment no finalizado");
    }


    const incomingPayment = await client.incomingPayment.create(
      { url: receiverWallet.resourceServer, accessToken: incomingPaymentGrant.access_token.value },
      {
        walletAddress: receiverWallet.id,
        incomingAmount: {
          assetCode: receiverWallet.assetCode,
          assetScale: receiverWallet.assetScale,
          value: amount.toString(),
        },
      }
    );


    const quoteGrant = await client.grant.request(
      { url: senderWallet.authServer },
      {
        access_token: { access: [{ type: "quote", actions: ["create", "read"] }] },
      }
    );
    if (!isFinalizedGrant(quoteGrant)) {
      throw new Error("Grant de quote no finalizado");
    }


    const quote = await client.quote.create(
      { url: senderWallet.resourceServer, accessToken: quoteGrant.access_token.value },
      {
        walletAddress: senderWallet.id,
        receiver: incomingPayment.id,
        method: "ilp",
      }
    );


    const outgoingPaymentGrant = await client.grant.request(
      { url: senderWallet.authServer },
      {
        access_token: {
          access: [
            {
              type: "outgoing-payment",
              actions: ["read", "create"],
              limits: {
                debitAmount: {
                  assetCode: quote.debitAmount.assetCode,
                  assetScale: quote.debitAmount.assetScale,
                  value: quote.debitAmount.value,
                },
              },
              identifier: senderWallet.id,
            },
          ],
        },
        interact: {
          start: ["redirect"],
          finish: {
            method: "redirect",
            uri: `${ENVS.HOST}/fondo/paymentComplete/${id}`, // callback backend
            nonce: crypto.randomUUID(),
          },
        },
      }
    );

    if (isFinalizedGrant(outgoingPaymentGrant))
      throw new Error('Grant was finalized automatically without interaction.');

    return {
      redirectUri: outgoingPaymentGrant.interact.redirect,
      continueUri: outgoingPaymentGrant.continue.uri,
      continueAccessToken: outgoingPaymentGrant.continue.access_token.value,
      senderWallet,
      quote,
    };
  }

  async finalizePayment({ continueUri, continueAccessToken, senderWallet, quote }: PaymentInitResultWithoutRedirectUri): Promise<OutgoingPayment> {
    const client = await this.clientPromise;


    const finalizedOutgoingPaymentGrant = await client.grant.continue({
      url: continueUri,
      accessToken: continueAccessToken,
    });

    if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)) {
      throw new Error("Grant de outgoing payment no finalizado");
    }


    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: senderWallet.resourceServer,
        accessToken: finalizedOutgoingPaymentGrant.access_token.value,
      },
      {
        walletAddress: senderWallet.id,
        quoteId: quote.id,
      }
    );

    return outgoingPayment;
  }
}
