import nodemailer from "nodemailer";

interface WelcomeEmailData {
  to: string;
  adminName: string;
  companyName: string;
  companySlug: string;
  loginUrl: string;
  temporaryPassword?: string; // Mot de passe temporaire pour la première connexion
}

interface InvitationEmailData {
  to: string;
  inviterName: string;
  companyName: string;
  companySlug: string;
  role: string;
  invitationUrl: string;
}

interface PasswordResetEmailData {
  to: string;
  userName: string;
  companyName: string;
  resetUrl: string;
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

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur BookingApp</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #6b7280; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .button:hover { background: #1d4ed8; }
        .password-box { background: #f3f4f6; border: 2px solid #d1d5db; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-family: monospace; font-size: 18px; font-weight: bold; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .success { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏢 BookingApp</div>
          <h1>Bienvenue ${data.adminName} !</h1>
        </div>
        
        <div class="content">
          <h2>🎉 Votre organisation "${data.companyName}" a été créée avec succès</h2>
          <p>Félicitations ! Votre espace de réservation est maintenant prêt à être utilisé.</p>
          
          <div class="success">
            <strong>✅ Votre compte administrateur a été créé</strong>
            <p>Email : <strong>${data.to}</strong></p>
            ${
              data.temporaryPassword
                ? `
              <p>Mot de passe temporaire :</p>
              <div class="password-box">${data.temporaryPassword}</div>
            `
                : ""
            }
          </div>
          
          ${
            data.temporaryPassword
              ? `
            <div class="warning">
              <strong>🔐 Important - Première connexion :</strong>
              <ul>
                <li>Utilisez le mot de passe temporaire ci-dessus pour votre première connexion</li>
                <li>Vous serez <strong>obligé</strong> de changer ce mot de passe lors de votre première connexion</li>
                <li>Choisissez un mot de passe sécurisé que vous seul connaissez</li>
              </ul>
            </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" class="button">Se connecter à mon dashboard</a>
          </div>
          
          <h3>🚀 Prochaines étapes :</h3>
          <ul>
            <li>Connectez-vous avec vos identifiants</li>
            ${data.temporaryPassword ? "<li>Changez votre mot de passe temporaire</li>" : ""}
            <li>Configurez vos salles et espaces</li>
            <li>Invitez vos collaborateurs</li>
            <li>Commencez à créer vos réservations</li>
          </ul>
          
          <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">${data.loginUrl}</p>
        </div>
        
        <div class="footer">
          <p>Bienvenue dans la famille BookingApp !</p>
          <p>&copy; 2024 BookingApp. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // En mode développement, afficher le mot de passe temporaire dans la console
    if (process.env.NODE_ENV === "development" && data.temporaryPassword) {
      console.log("=".repeat(60));
      console.log("🔐 MOT DE PASSE TEMPORAIRE GÉNÉRÉ");
      console.log("=".repeat(60));
      console.log(`📧 Email: ${data.to}`);
      console.log(`🏢 Entreprise: ${data.companyName}`);
      console.log(`🔑 Mot de passe temporaire: ${data.temporaryPassword}`);
      console.log(`🔗 URL de connexion: ${data.loginUrl}`);
      console.log("=".repeat(60));
      console.log(
        "⚠️  IMPORTANT: Utilisez ce mot de passe pour votre première connexion"
      );
      console.log(
        "⚠️  Vous serez obligé de le changer lors de votre première connexion"
      );
      console.log("=".repeat(60));
    }

    await transporter.sendMail({
      from: `"BookingApp" <${process.env.EMAIL_FROM || "noreply@bookingapp.com"}>`,
      to: data.to,
      subject: `🎉 Bienvenue sur BookingApp - ${data.companyName}`,
      html: htmlContent,
    });

    console.log(`Email de bienvenue envoyé à ${data.to}`);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de bienvenue:", error);

    // En cas d'erreur d'envoi, afficher quand même le mot de passe temporaire
    if (data.temporaryPassword) {
      console.log("=".repeat(60));
      console.log("🚨 ERREUR D'ENVOI D'EMAIL - MOT DE PASSE TEMPORAIRE");
      console.log("=".repeat(60));
      console.log(`📧 Email: ${data.to}`);
      console.log(`🏢 Entreprise: ${data.companyName}`);
      console.log(`🔑 Mot de passe temporaire: ${data.temporaryPassword}`);
      console.log(`🔗 URL de connexion: ${data.loginUrl}`);
      console.log("=".repeat(60));
    }

    throw error;
  }
};

export const sendInvitationEmail = async (data: any) => {
  console.log("Invitation email would be sent to:", data.to);
  // TODO: Implement email sending
  return { success: true };
};

export async function sendPasswordResetEmail(
  data: PasswordResetEmailData
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
          <p>Bonjour ${data.userName},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte ${data.companyName}.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" class="button">Réinitialiser mon mot de passe</a>
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
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">${data.resetUrl}</p>
        </div>
        
        <div class="footer">
          <p>Cet email a été envoyé suite à une demande de réinitialisation de mot de passe.</p>
          <p>&copy; 2024 BookingApp. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"BookingApp" <${process.env.EMAIL_FROM || "noreply@bookingapp.com"}>`,
      to: data.to,
      subject: "🔒 Réinitialisation de votre mot de passe BookingApp",
      html: htmlContent,
    });

    console.log(`Email de réinitialisation envoyé à ${data.to}`);
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de réinitialisation:",
      error
    );

    // En développement, afficher le lien de réinitialisation
    if (process.env.NODE_ENV === "development") {
      console.log("=".repeat(60));
      console.log("🔑 LIEN DE RÉINITIALISATION (DÉVELOPPEMENT)");
      console.log("=".repeat(60));
      console.log(`📧 Email: ${data.to}`);
      console.log(`👤 Utilisateur: ${data.userName}`);
      console.log(`🏢 Entreprise: ${data.companyName}`);
      console.log(`🔗 URL: ${data.resetUrl}`);
      console.log("=".repeat(60));
    }

    throw error;
  }
}
