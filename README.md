# Sistema de Reserva de Clases

Sistema web para gestión de reservas de clases con pagos integrados mediante MercadoPago, diseñado específicamente para usuarios en Argentina.

## Características

- 🔐 Autenticación con Google mediante NextAuth
- 📅 Calendario interactivo para selección de clases
- 💳 Integración con MercadoPago para pagos en Argentina
- 👥 Control de capacidad de clases
- 🇦🇷 Interfaz completamente en español
- 👨‍💼 Panel de administración para gestión de clases
- 📊 Dashboard de usuario para ver reservas

## Tecnologías Utilizadas

- **Next.js 15** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **MongoDB Native Driver** - Cliente de base de datos
- **MongoDB** - Base de datos NoSQL
- **NextAuth v5** - Autenticación
- **MercadoPago SDK** - Procesamiento de pagos
- **Tailwind CSS** - Estilos
- **React Calendar** - Componente de calendario
- **Lucide React** - Iconos

## Requisitos Previos

- Node.js 18+
- MongoDB (local o MongoDB Atlas)
- Cuenta de Google Cloud (para OAuth)
- Cuenta de MercadoPago (para pagos)

## Instalación

1. Clona el repositorio y navega al directorio:
```bash
cd class-booking
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en `.env`:
```env
# Base de datos MongoDB
# Para MongoDB local:
DATABASE_URL="mongodb://localhost:27017/class_booking"
# Para MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/class_booking?retryWrites=true&w=majority"

# NextAuth
AUTH_SECRET="genera-un-secret-aleatorio"
NEXT_PUBLIC_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id-de-google"
GOOGLE_CLIENT_SECRET="tu-client-secret-de-google"

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="tu-access-token-de-mercadopago"
```

5. (Opcional) Verifica la conexión a MongoDB:
```bash
npm run dev
```

**Nota**: La aplicación usa el driver nativo de MongoDB, no requiere migraciones ni generación de esquemas. Las colecciones se crean automáticamente cuando insertas datos.

## Configuración de Servicios Externos

### MongoDB

Tienes dos opciones para MongoDB:

#### Opción 1: MongoDB Local
1. Descarga e instala MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Inicia el servicio de MongoDB
3. Usa la URL de conexión: `mongodb://localhost:27017/class_booking`

#### Opción 2: MongoDB Atlas (Nube - Recomendado)
1. Crea una cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea un nuevo cluster (el tier gratuito es suficiente)
3. Crea un usuario de base de datos en "Database Access"
4. Añade tu IP a la lista blanca en "Network Access" (o permite acceso desde cualquier IP: 0.0.0.0/0)
5. Haz clic en "Connect" en tu cluster y selecciona "Connect your application"
6. Copia la cadena de conexión y reemplaza `<password>` con tu contraseña
7. Usa esta URL en tu `.env`: `mongodb+srv://username:password@cluster.mongodb.net/class_booking?retryWrites=true&w=majority`

### Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Crea credenciales OAuth 2.0
5. Agrega `http://localhost:3000/api/auth/callback/google` como URI de redirección autorizada
6. Copia el Client ID y Client Secret a tu archivo `.env`

### MercadoPago

1. Crea una cuenta en [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
2. Crea una nueva aplicación
3. Obtén tu Access Token de producción o prueba
4. Copia el token a tu archivo `.env`

## Uso

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
class-booking/
├── app/                    # Páginas y rutas de Next.js
│   ├── api/               # API Routes
│   ├── admin/             # Panel de administración
│   ├── booking/           # Páginas de reserva
│   ├── clases/            # Listado de clases
│   ├── dashboard/         # Panel de usuario
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
├── lib/                   # Utilidades y configuraciones
│   ├── db.ts             # Cliente MongoDB
│   ├── mongodb-adapter.ts # Adaptador NextAuth para MongoDB
│   ├── types.ts          # Interfaces TypeScript para modelos
│   ├── mercadopago.ts    # Configuración MercadoPago
│   └── translations.ts   # Traducciones en español
└── types/                # Definiciones de TypeScript
```

## Funcionalidades Principales

### Para Usuarios
- Registro/inicio de sesión con Google
- Ver calendario de clases disponibles
- Reservar clases con límite de capacidad
- Pagar con MercadoPago
- Ver historial de reservas en el dashboard

### Para Administradores
- Crear, editar y eliminar clases
- Establecer capacidad máxima por clase
- Ver todas las reservas
- Gestionar servicios y precios

## Scripts Disponibles

```bash
npm run dev    # Inicia servidor de desarrollo
npm run build  # Compila para producción
npm start      # Inicia servidor de producción
npm run lint   # Ejecuta el linter
```

## Consideraciones de Seguridad

- Nunca commits el archivo `.env` con credenciales reales
- Usa variables de entorno diferentes para desarrollo y producción
- Mantén las dependencias actualizadas
- Configura CORS apropiadamente en producción

## Soporte

Para reportar problemas o solicitar funcionalidades, por favor abre un issue en el repositorio.