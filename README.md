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

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **NextAuth v5** - Autenticación
- **MercadoPago SDK** - Procesamiento de pagos
- **Tailwind CSS** - Estilos
- **React Calendar** - Componente de calendario
- **Lucide React** - Iconos

## Requisitos Previos

- Node.js 18+ 
- PostgreSQL
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
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/class_booking"

# NextAuth
AUTH_SECRET="genera-un-secret-aleatorio"
NEXT_PUBLIC_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id-de-google"
GOOGLE_CLIENT_SECRET="tu-client-secret-de-google"

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN="tu-access-token-de-mercadopago"
```

5. Ejecuta las migraciones de Prisma:
```bash
npx prisma migrate dev
```

6. Genera el cliente de Prisma:
```bash
npx prisma generate
```

7. (Opcional) Carga datos de prueba:
```bash
npx prisma db seed
```

## Configuración de Servicios Externos

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
│   ├── db.ts             # Cliente Prisma
│   ├── mercadopago.ts    # Configuración MercadoPago
│   └── translations.ts   # Traducciones en español
├── prisma/               # Esquema y migraciones
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
npm run dev        # Inicia servidor de desarrollo
npm run build      # Compila para producción
npm start          # Inicia servidor de producción
npm run lint       # Ejecuta el linter
npx prisma studio  # Abre Prisma Studio para ver la BD
```

## Consideraciones de Seguridad

- Nunca commits el archivo `.env` con credenciales reales
- Usa variables de entorno diferentes para desarrollo y producción
- Mantén las dependencias actualizadas
- Configura CORS apropiadamente en producción

## Soporte

Para reportar problemas o solicitar funcionalidades, por favor abre un issue en el repositorio.