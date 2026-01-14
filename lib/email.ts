import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dani.alaniz11@gmail.com';

interface BookingEmailData {
  buyerName: string;
  buyerEmail: string;
  serviceType: string;
  selectedDate: string;
  selectedTime: string;
  amount: number;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    // Send confirmation to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.buyerEmail,
      subject: '¡Reserva Confirmada! - American English Classes',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .total { font-size: 24px; color: #ec4899; font-weight: bold; text-align: center; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Reserva Confirmada!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${data.buyerName}</strong>,</p>
              <p>¡Gracias por tu reserva! Tu clase ha sido confirmada exitosamente.</p>

              <div class="booking-details">
                <h3>Detalles de tu reserva:</h3>
                <div class="detail-row">
                  <span class="detail-label">Servicio:</span>
                  <span>${data.serviceType === 'particular' ? 'Clase Particular (1 hora)' : 'Clases Mensuales (4 clases/mes)'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Fecha:</span>
                  <span>${data.selectedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Horario:</span>
                  <span>${data.selectedTime} hs</span>
                </div>
                <div class="total">
                  Total pagado: $${data.amount.toLocaleString('es-AR')} ARS
                </div>
              </div>

              <p>Si tenés alguna pregunta, no dudes en contactarnos.</p>
              <p>¡Nos vemos en clase!</p>

              <div class="footer">
                <p>American English Classes</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nueva Reserva - ${data.buyerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nueva Reserva Recibida</h2>
            </div>
            <div class="content">
              <div class="info">
                <p><strong>Cliente:</strong> ${data.buyerName}</p>
                <p><strong>Email:</strong> ${data.buyerEmail}</p>
                <p><strong>Servicio:</strong> ${data.serviceType === 'particular' ? 'Clase Particular' : 'Clases Mensuales'}</p>
                <p><strong>Fecha:</strong> ${data.selectedDate}</p>
                <p><strong>Horario:</strong> ${data.selectedTime} hs</p>
                <p><strong>Monto:</strong> $${data.amount.toLocaleString('es-AR')} ARS</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Confirmation emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}
