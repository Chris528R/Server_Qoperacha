# Qoperacha
Qoperacha is a mobile application designed to simplify and digitize collective fundraising for groups and small businesses.

### ¿Cuál es el problema? / What is the problem?

Los métodos tradicionales para gestionar pagos y recolectar dinero para actividades en grupo, como regalos, viajes o eventos, son a menudo procesos manuales, ineficientes e incómodos o riesgosos. Este proceso puede generar falta de transparencia y problemas sociales debido a la necesidad de recordatorios constantes y múltiples transferencias. Además, el comercio informal pierde muchas ventas al no poder aceptar pagos digitales, y las diferencias de divisas son un problema importante para ellos.

### ¿Cuál es la solución? / What is the solution?

Qoperacha aborda estos problemas utilizando la tecnología QR y la API de Open Payments para agilizar el proceso de recaudación de fondos. Los usuarios pueden crear un "fondo" con un objetivo específico, el cual genera un código QR único que puede ser compartido. Los participantes pueden escanear el código QR para contribuir de forma instantánea y transparente. Cuando se completa un fondo, se puede generar un recuerdo digital como un recuerdo imborrable del logro colectivo.

### Beneficios Clave / Key Benefits

Para Usuarios: Elimina la fricción de cobrar a amigos, ofrece total transparencia con una barra de progreso en tiempo real, y puede crear un recuerdo digital del evento.

Para Comercios: Abre la puerta a la economía digital para pequeños vendedores, permitiéndoles aceptar pagos de forma segura e instantánea sin necesidad de costosas terminales.

Para la Comunidad: Fomenta la colaboración y la inclusión financiera, haciendo las transacciones más seguras y eficientes.

Para el Turismo: Facilita el cambio de divisas entre turistas y comerciantes, haciendo más sencillo el pago de productos o servicios.

Arquitectura y Stack Tecnológico / Technology Stack and Architecture

Qoperacha se basa en una arquitectura de cliente-servidor desacoplada para permitir la escalabilidad futura.

Frontend (Aplicación Móvil Android):

Tecnología: Kotlin y Android Studio.

Backend (API REST):

Tecnología: Node.js, TypeScript y Express.

Base de Datos:

Tecnología: PostgreSQL.

Modelo: Almacena datos de usuarios, fondos y transacciones.

Servicios Externos:

Pagos: Se utiliza la API de Open Payments para toda la infraestructura de pagos.

Funciones Indispensables / Essential Functions

El proyecto se enfoca en el desarrollo de un Producto Mínimo Viable (MVP) con los siguientes requisitos funcionales clave:

Gestión de Usuarios: El sistema debe permitir a los usuarios registrarse, iniciar sesión y asociar su cuenta con un identificador de billetera de Open Payments.

Gestión de Fondos: Los usuarios autenticados deben poder crear un fondo con un título y un monto objetivo. El sistema debe generar un código QR único para el fondo y mostrar el progreso de la recaudación en tiempo real.

Proceso de Pago: La aplicación debe permitir a los usuarios escanear un código QR para contribuir a un fondo. El sistema procesará los pagos de forma segura utilizando la API de Open Payments y actualizará el monto total del fondo de manera inmediata.

### Equipo y Roles / Team and Roles

- El equipo está compuesto por cuatro estudiantes de Ingeniería en Sistemas Computacionales:

- José Ricardo Mendoza Castañeda (Líder de Proyecto / Full-Stack): Responsable de la arquitectura general y de asegurar la cohesión entre el backend y el frontend.

- Christopher Rodríguez Mendoza (Especialista en Backend / Open Payments): Se enfoca en la implementación de la API REST, la lógica de negocio y la integración con la API de Open Payments.

- Daniel Peredo Borgonio (Especialista en Frontend): Se encarga de la interfaz de usuario, la experiencia de la aplicación móvil y el flujo de generación y escaneo de QR.

- Luca Alexander Barcenas Pineda (Diseñador UI/UX y QA / Especialista Web3): A cargo del diseño visual, el prototipado en Figma y las pruebas de calidad (QA) de la aplicación.