import nodemailer from "nodemailer";

interface WelcomeEmailData {
  to: string;
  adminName: string;
  companyName: string;
  companySlug: string;
  loginUrl: string;
}

interface InvitationEmailData {
  to: string;
  inviterName: string;
  companyName: string;
  companySlug: string;
  role: string;
  invitationUrl: string;
}

// Configuration du transporteur email (à adapter selon votre fournisseur)
const createTransporter = () => {
  // Pour le développement, utilisez un service comme Mailtrap ou similaire
  if (process.env.NODE_ENV === "development") {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.mailtrap.io",
      port: parseInt(process.env.SMTP_PORT || "2525"),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Pour la production, utilisez votre service email (SendGrid, AWS SES, etc.)
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendWelcomeEmail = async (data: any) => {
  console.log("Welcome email would be sent to:", data.to);
  // TODO: Implement email sending
  return { success: true };
};

export const sendInvitationEmail = async (data: any) => {
  console.log("Invitation email would be sent to:", data.to);
  // TODO: Implement email sending
  return { success: true };
};

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation de mot de passe</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .button:hover { background: #dc2626; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔒 BookingApp</div>
          <h1>Réinitialisation de mot de passe</h1>
        </div>
        
        <div class="content">
          <h2>🔐 Demande de réinitialisation</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe BookingApp.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important :</strong>
            <ul>
              <li>Ce lien est valide pendant 1 heure seulement</li>
              <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
              <li>Votre mot de passe actuel reste valide jusqu'à ce que vous le changiez</li>
            </ul>
          </div>
          
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">${resetUrl}</p>
        </div>
        
        <div class="footer">
          <p>Cet email a été envoyé suite à une demande de réinitialisation de mot de passe.</p>
          <p>&copy; 2024 BookingApp. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"BookingApp" <${process.env.EMAIL_FROM || "noreply@bookingapp.com"}>`,
    to: email,
    subject: "🔒 Réinitialisation de votre mot de passe BookingApp",
    html: htmlContent,
  });
}
