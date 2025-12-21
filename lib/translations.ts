export const translations = {
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      pricing: 'Precios',
      classes: 'Clases',
      contact: 'Contacto',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      dashboard: 'Panel',
      admin: 'Administración'
    },
    home: {
      hero: {
        title: 'Reserva tu clase hoy',
        subtitle: 'Clases profesionales con instructores certificados',
        cta: 'Ver Clases Disponibles'
      },
      features: {
        title: 'Por qué elegirnos',
        booking: {
          title: 'Reserva Fácil',
          description: 'Sistema de reserva simple e intuitivo'
        },
        payment: {
          title: 'Pago Seguro',
          description: 'Paga con MercadoPago de forma segura'
        },
        capacity: {
          title: 'Cupos Limitados',
          description: 'Grupos pequeños para mejor atención'
        }
      }
    },
    services: {
      title: 'Nuestros Servicios',
      description: 'Ofrecemos una variedad de clases y servicios para todos los niveles'
    },
    pricing: {
      title: 'Planes y Precios',
      currency: 'ARS',
      perClass: 'por clase',
      bookNow: 'Reservar Ahora'
    },
    booking: {
      title: 'Reservar Clase',
      selectDate: 'Selecciona una fecha',
      availableClasses: 'Clases Disponibles',
      spotsLeft: 'lugares disponibles',
      confirmBooking: 'Confirmar Reserva',
      payNow: 'Pagar Ahora',
      bookingConfirmed: 'Reserva Confirmada',
      bookingError: 'Error al procesar la reserva'
    },
    payment: {
      processing: 'Procesando pago...',
      success: 'Pago exitoso',
      failed: 'El pago falló',
      pending: 'Pago pendiente'
    },
    admin: {
      title: 'Panel de Administración',
      classes: 'Gestionar Clases',
      bookings: 'Ver Reservas',
      services: 'Gestionar Servicios',
      users: 'Usuarios',
      addNewClass: 'Agregar Nueva Clase',
      editClass: 'Editar Clase',
      deleteClass: 'Eliminar Clase',
      capacity: 'Capacidad',
      price: 'Precio',
      date: 'Fecha',
      time: 'Hora'
    },
    forms: {
      email: 'Correo Electrónico',
      password: 'Contraseña',
      name: 'Nombre',
      title: 'Título',
      description: 'Descripción',
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar'
    },
    errors: {
      required: 'Este campo es requerido',
      invalidEmail: 'Correo electrónico inválido',
      minLength: 'Mínimo {min} caracteres',
      maxLength: 'Máximo {max} caracteres',
      invalidDate: 'Fecha inválida',
      pastDate: 'La fecha debe ser futura',
      capacityExceeded: 'No hay cupos disponibles'
    },
    messages: {
      loading: 'Cargando...',
      noData: 'No hay datos disponibles',
      success: 'Operación exitosa',
      error: 'Ocurrió un error'
    }
  }
};

export const t = translations.es;