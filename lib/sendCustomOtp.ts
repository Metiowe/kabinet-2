import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

// 🔧 Appwrite konfigurieren
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

// ✉️ SMTP-Transporter für Brevo einrichten
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

// ⏳ Backoff für Retry-Versuche
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const getBackoff = (attempt: number) =>
  Math.min(30000, Math.random() * Math.pow(2, attempt) * 1000);

/**
 * 📩 sendCustomOtp – Generiert und versendet einen 6-stelligen OTP-Code
 * - Speichert OTP-Code in Appwrite
 * - Versendet per SMTP (Brevo)
 * - Läuft mit maximal 5 Retry-Versuchen (exponentielles Backoff)
 */
export const sendCustomOtp = async (userId: string, email: string) => {
  console.log("🧪 OTP wird gesendet an:", email);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 30 * 1000); // ✅ 30 Sekunden gültig

  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // 📥 In Appwrite-DB speichern
      await databases.createDocument(
        process.env.DB_ID!,
        process.env.OTP_COLLECTION_ID!,
        ID.unique(),
        {
          userId,
          otp,
          expireAt: expiresAt.toISOString(),
        }
      );

      // 📧 Mail versenden
      await transporter.sendMail({
        from: '"Leichtes Fahren" <support@leichtesfahren.pro>',
        to: email,
        subject: "🔐 Dein Verifizierungscode",
        html: `
          <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a;">
            <h2>Willkommen bei <strong>Leichtes Fahren</strong> 👋</h2>
            <p>Um dein Konto zu verifizieren, gib diesen Code in der App ein:</p>
            <h1 style="font-size: 32px; letter-spacing: 6px; margin: 20px 0;">${otp}</h1>
            <p>Dieser Code ist <strong>30 Sekunden gültig</strong>.</p>
            <p style="margin-top: 24px;">Wenn du dich nicht registriert hast, kannst du diese Nachricht ignorieren.</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #ccc;" />
            <p style="font-size: 12px; color: #888;">Diese E-Mail wurde automatisch verschickt. Bitte nicht antworten.</p>
          </div>
        `,
      });

      // ✅ Erfolg zurückgeben
      return { success: true, expiresAt: expiresAt.toISOString() };
    } catch (err: any) {
      console.error(`❌ Fehler beim Versuch ${attempt + 1}:`, err.message);
      attempt++;
      if (attempt >= maxRetries)
        throw new Error(
          "❌ Max. Retry-Limit erreicht. Mail konnte nicht gesendet werden."
        );

      const wait = getBackoff(attempt);
      console.log(
        `⏳ Warte ${Math.round(wait / 1000)}s bis zum nächsten Versuch...`
      );
      await delay(wait);
    }
  }
};
