// 📄 lib/sendCustomOtp.ts
import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

// 🔐 ENV-Check
const {
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1",
  DB_ID,
  OTP_COLLECTION_ID,
  SMTP_USER,
  SMTP_PASS,
} = process.env;

if (
  !APPWRITE_PROJECT_ID ||
  !APPWRITE_API_KEY ||
  !DB_ID ||
  !OTP_COLLECTION_ID ||
  !SMTP_USER ||
  !SMTP_PASS
) {
  throw new Error("❌ Fehlende ENV-Variablen. Bitte .env.local prüfen.");
}

// 🧠 Retry-Mechanik
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const getBackoff = (attempt: number) =>
  Math.min(30000, Math.random() * Math.pow(2, attempt) * 1000);

/**
 * 📩 sendCustomOtp – OTP generieren, speichern und versenden
 */
export const sendCustomOtp = async (userId: string, email: string) => {
  const otp = generateOtp(); // 6-stelliger Code
  const expiresAt = new Date(Date.now() + 30 * 1000); // ⏱️ 30 Sekunden gültig

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);
  const databases = new Databases(client);

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // 📝 In DB speichern
      await databases.createDocument(DB_ID, OTP_COLLECTION_ID, ID.unique(), {
        userId,
        otp,
        expireAt: expiresAt.toISOString(),
      });

      // 📬 Versenden
      await transporter.sendMail({
        from: `"Leichtes Fahren" <${SMTP_USER}>`,
        to: email,
        subject: "🔐 Dein Verifizierungscode",
        html: buildEmailHtml(otp),
      });

      return { success: true, expiresAt: expiresAt.toISOString() };
    } catch (err: any) {
      console.error(`❌ Fehler bei Versuch ${attempt + 1}:`, err.message);
      if (++attempt >= maxRetries) {
        throw new Error(
          "❌ Max. Retry-Limit erreicht. OTP-Mail konnte nicht gesendet werden."
        );
      }

      const wait = getBackoff(attempt);
      console.log(`⏳ Warte ${Math.round(wait / 1000)}s…`);
      await delay(wait);
    }
  }
};

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const buildEmailHtml = (otp: string) => `
  <div style="font-family: sans-serif; padding: 24px; color: #1a1a1a;">
    <h2>Willkommen bei <strong>Leichtes Fahren</strong> 👋</h2>
    <p>Dein Code zur Verifizierung:</p>
    <h1 style="font-size: 32px; letter-spacing: 6px; margin: 20px 0;">${otp}</h1>
    <p>Dieser Code ist <strong>30 Sekunden gültig</strong>.</p>
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #ccc;" />
    <p style="font-size: 12px; color: #888;">Diese Mail wurde automatisch generiert.</p>
  </div>
`;
