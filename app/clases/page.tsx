'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { t } from '@/lib/translations';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { X, Clock, BookOpen, CalendarDays, CreditCard, ArrowLeft, ChevronRight } from 'lucide-react';

interface BookingForm {
  firstName: string;
  lastName: string;
  email: string;
  serviceType: string;
  selectedTime: string;
}

interface PaymentForm {
  paymentMethod: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const paymentMethods = [
  { value: '', label: 'Selecciona un método de pago' },
  { value: 'mercadopago', label: 'MercadoPago', icon: '🇦🇷' },
  { value: 'stripe', label: 'Stripe (Tarjeta Internacional)', icon: '💳' },
];

const serviceOptions = [
  { value: '', label: 'Selecciona un servicio', price: 0 },
  { value: 'particular', label: 'Clase Particular (1 hora)', price: 15000 },
  { value: 'mensual', label: 'Clases Mensuales (4 clases/mes)', price: 50000 },
];

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export default function ClassesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingForm>({
    firstName: '',
    lastName: '',
    email: '',
    serviceType: '',
    selectedTime: '',
  });
  const [paymentData, setPaymentData] = useState<PaymentForm>({
    paymentMethod: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<BookingForm>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<PaymentForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleDateChange = (value: Date) => {
    setSelectedDate(value);
    setShowForm(true);
    setCurrentStep(1);
    // Pre-fill data if user is logged in
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user?.email || '' }));
    }
    if (session?.user?.name) {
      const nameParts = session.user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<BookingForm> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }
    if (!formData.email.trim()) {
      errors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Correo electrónico inválido';
    }
    if (!formData.serviceType) {
      errors.serviceType = 'Selecciona un tipo de servicio';
    }
    if (!formData.selectedTime) {
      errors.selectedTime = 'Selecciona un horario';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = (): boolean => {
    const errors: Partial<PaymentForm> = {};

    if (!paymentData.paymentMethod) {
      errors.paymentMethod = 'Selecciona un método de pago';
    }

    // Only validate card fields if Stripe is selected (MercadoPago uses transfer)
    if (paymentData.paymentMethod === 'stripe') {
      if (!paymentData.cardNumber.trim()) {
        errors.cardNumber = 'El número de tarjeta es requerido';
      } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Número de tarjeta inválido';
      }
      if (!paymentData.cardName.trim()) {
        errors.cardName = 'El nombre del titular es requerido';
      }
      if (!paymentData.expiryDate.trim()) {
        errors.expiryDate = 'La fecha de vencimiento es requerida';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        errors.expiryDate = 'Formato inválido (MM/AA)';
      }
      if (!paymentData.cvv.trim()) {
        errors.cvv = 'El CVV es requerido';
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        errors.cvv = 'CVV inválido';
      }
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!validatePayment()) {
      toast.error('Por favor completa los datos de pago correctamente');
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentData.paymentMethod === 'mercadopago') {
        // Create MercadoPago checkout
        const selectedService = serviceOptions.find(s => s.value === formData.serviceType);

        const response = await fetch('/api/payments/mercadopago', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            serviceType: formData.serviceType,
            serviceName: selectedService?.label,
            price: selectedService?.price,
            selectedDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
            selectedTime: formData.selectedTime,
          }),
        });

        const data = await response.json();

        if (data.success && (data.initPoint || data.sandboxInitPoint)) {
          // Redirect to MercadoPago checkout
          // Use initPoint for production/test accounts, sandboxInitPoint for TEST- credentials
          window.location.href = data.initPoint || data.sandboxInitPoint;
        } else {
          throw new Error(data.error || 'Error al crear el pago');
        }
      } else if (paymentData.paymentMethod === 'stripe') {
        // Stripe payment (to be implemented)
        console.log('Stripe payment:', {
          ...formData,
          date: selectedDate,
          payment: {
            cardNumber: '****' + paymentData.cardNumber.slice(-4),
            cardName: paymentData.cardName,
          }
        });
        toast.success('¡Reserva confirmada! Te contactaremos pronto.');
        closeForm();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error al procesar el pago. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedDate(null);
    setCurrentStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      serviceType: '',
      selectedTime: '',
    });
    setPaymentData({
      paymentMethod: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    });
    setFormErrors({});
    setPaymentErrors({});
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style jsx global>{`
        /* Pink Bulma-style Calendar - Large */
        .react-calendar {
          width: 100%;
          max-width: 100%;
          border: none;
          border-radius: 16px;
          font-family: inherit;
          background: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .react-calendar__navigation {
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
          border-radius: 16px 16px 0 0;
          margin-bottom: 0;
          height: 70px;
        }

        .react-calendar__navigation button {
          color: white;
          font-weight: 600;
          font-size: 1.25rem;
          min-width: 54px;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }

        .react-calendar__navigation button:disabled {
          background-color: transparent;
          color: rgba(255, 255, 255, 0.5);
        }

        .react-calendar__month-view__weekdays {
          background: #fdf2f8;
          padding: 12px 0;
        }

        .react-calendar__month-view__weekdays__weekday {
          color: #be185d;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }

        .react-calendar__tile {
          padding: 20px 12px;
          font-size: 1.1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background: #fce7f3;
          color: #be185d;
        }

        .react-calendar__tile--now {
          background: #fce7f3;
          color: #be185d;
          font-weight: 600;
        }

        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: #fbcfe8;
        }

        .react-calendar__tile--active {
          background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%) !important;
          color: white !important;
          font-weight: 600;
        }

        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: linear-gradient(135deg, #db2777 0%, #ec4899 100%) !important;
        }

        .react-calendar__tile:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
        }

        .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }
      `}</style>

      <h1 className="text-4xl font-bold text-center mb-8">{t.booking.title}</h1>

      {/* Calendario Grande */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">{t.booking.selectDate}</h2>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Calendar
            onChange={(value) => handleDateChange(value as Date)}
            value={selectedDate}
            locale="es-ES"
            minDate={new Date()}
            className="w-full"
          />
        </div>
      </div>

      {/* Modal/Popup del Formulario */}
      {showForm && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                {currentStep === 2 && (
                  <button
                    onClick={handlePreviousStep}
                    className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <h2 className="text-2xl font-semibold text-pink-600">
                  {currentStep === 1 ? 'Reserva tu Clase' : 'Información de Pago'}
                </h2>
              </div>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>

            <p className="text-gray-600 mb-6 text-lg">
              <CalendarDays className="inline h-5 w-5 mr-2 text-pink-500" />
              Fecha seleccionada:{' '}
              <span className="font-semibold text-pink-600">
                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </span>
            </p>

            {/* Paso 1: Información Personal */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primer Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tu primer nombre"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tu apellido"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Tipo de Servicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BookOpen className="inline h-4 w-4 mr-1" />
                      Tipo de Servicio *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                        formErrors.serviceType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.serviceType && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.serviceType}</p>
                    )}
                  </div>

                  {/* Horario */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Horario *
                    </label>
                    <select
                      value={formData.selectedTime}
                      onChange={(e) =>
                        setFormData({ ...formData, selectedTime: e.target.value })
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                        formErrors.selectedTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un horario</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time} hs
                        </option>
                      ))}
                    </select>
                    {formErrors.selectedTime && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.selectedTime}</p>
                    )}
                  </div>
                </div>

                {/* Botón Ya casi */}
                <button
                  onClick={handleNextStep}
                  className="w-full py-4 px-6 bg-pink-500 text-white font-semibold text-lg rounded-lg hover:bg-pink-600 transition duration-300 mt-8 flex items-center justify-center gap-2"
                >
                  Ya casi
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Paso 2: Información de Pago */}
            {currentStep === 2 && (
              <>
                {/* Resumen de la reserva */}
                <div className="bg-pink-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-pink-700 mb-3">Resumen de tu reserva</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <strong>Servicio:</strong> {serviceOptions.find(s => s.value === formData.serviceType)?.label}
                    </p>
                    <p className="text-gray-600">
                      <strong>Horario:</strong> {formData.selectedTime} hs
                    </p>
                    <p className="text-gray-600">
                      <strong>Alumno:</strong> {formData.firstName} {formData.lastName}
                    </p>
                  </div>
                  <div className="border-t border-pink-200 mt-3 pt-3">
                    <p className="text-xl font-bold text-pink-600">
                      Total a pagar: ${serviceOptions.find(s => s.value === formData.serviceType)?.price.toLocaleString('es-AR')} ARS
                    </p>
                  </div>
                </div>

                {/* Selector de método de pago */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline h-4 w-4 mr-1" />
                    Método de Pago *
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        paymentMethod: e.target.value,
                        // Reset card fields when changing payment method
                        cardNumber: '',
                        cardName: '',
                        expiryDate: '',
                        cvv: ''
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                      paymentErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {paymentMethods.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.icon ? `${method.icon} ${method.label}` : method.label}
                      </option>
                    ))}
                  </select>
                  {paymentErrors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-1">{paymentErrors.paymentMethod}</p>
                  )}
                </div>

                {/* Contenido según método de pago seleccionado */}
                {paymentData.paymentMethod === 'mercadopago' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      🇦🇷 Pagar con MercadoPago
                    </h3>
                    <p className="text-gray-700 mb-4">
                      Serás redirigido a MercadoPago para completar tu pago de forma segura.
                      Podés pagar con:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                      <li>Tarjeta de débito o crédito</li>
                      <li>Dinero en cuenta de MercadoPago</li>
                      <li>Transferencia bancaria</li>
                      <li>Efectivo en puntos de pago</li>
                    </ul>
                    <div className="bg-blue-100 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Modo de prueba:</strong> Estás usando credenciales de prueba.
                        Los pagos no serán reales.
                      </p>
                    </div>
                  </div>
                )}

                {paymentData.paymentMethod === 'stripe' && (
                  <>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                      <p className="font-medium text-purple-700">
                        💳 Pagando con Stripe - Acepta tarjetas internacionales
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Número de tarjeta */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de Tarjeta *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cardNumber}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })
                          }
                          maxLength={19}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                            paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {paymentErrors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">{paymentErrors.cardNumber}</p>
                        )}
                      </div>

                      {/* Nombre en la tarjeta */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Titular *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cardName}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                            paymentErrors.cardName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                        />
                        {paymentErrors.cardName && (
                          <p className="text-red-500 text-sm mt-1">{paymentErrors.cardName}</p>
                        )}
                      </div>

                      {/* Fecha de vencimiento */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Vencimiento *
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })
                          }
                          maxLength={5}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                            paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="MM/AA"
                        />
                        {paymentErrors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{paymentErrors.expiryDate}</p>
                        )}
                      </div>

                      {/* CVV */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) =>
                            setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '') })
                          }
                          maxLength={4}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg ${
                            paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="123"
                        />
                        {paymentErrors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{paymentErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Botón de pago */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !paymentData.paymentMethod}
                  className={`w-full py-4 px-6 text-white font-semibold text-lg rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2 ${
                    paymentData.paymentMethod === 'mercadopago'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : paymentData.paymentMethod === 'stripe'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-pink-500 hover:bg-pink-600'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  {isSubmitting
                    ? 'Procesando...'
                    : paymentData.paymentMethod === 'mercadopago'
                      ? 'Ir a pagar con MercadoPago'
                      : paymentData.paymentMethod === 'stripe'
                        ? 'Pagar con Stripe'
                        : 'Confirmar y Pagar'
                  }
                </button>

                {paymentData.paymentMethod === 'stripe' && (
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Tu pago está protegido con encriptación SSL
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
