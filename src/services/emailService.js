import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE, // Service SMTP
  port: parseInt(process.env.EMAIL_PORT, 10), // Port SMTP
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER, // Votre email
    pass: process.env.EMAIL_PASSWORD, // Mot de passe ou App Password
  },
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Support Gestion Facturation" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email envoyé avec succès à ${to}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email : ${error.message}`);
    throw new Error("Impossible d'envoyer l'email.");
  }
};
