import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

// 🔐 ENV prüfen + erzwingen
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`❌ ENV fehlt: ${key}`);
  return value;
};

const APPWRITE_ENDPOINT = getEnv("APPWRITE_ENDPOINT");
const APPWRITE_PROJECT_ID = getEnv("APPWRITE_PROJECT_ID");
const APPWRITE_API_KEY = getEnv("APPWRITE_API_KEY");
const DB_ID = getEnv("DB_ID");
const OTP_COLLECTION_ID = getEnv("OTP_COLLECTION_ID");
const SMTP_USER = getEnv("SMTP_USER");
const SMTP_PASS = getEnv("SMTP_PASS");

// 🔍 Debug-Ausgabe
console.log("✅ ENV CHECK:", {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  DB_ID,
  OTP_COLLECTION_ID,
  SMTP_USER,
  SMTP_PASS: SMTP_PASS ? "OK" : "MISSING",
});

// ⚙️ Appwrite Setup
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("📥 Request erhalten:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "❌ Nur POST erlaubt" });
  }

  const { userId, email } = req.body;

  if (!userId || !email) {
    console.warn("⚠️ userId oder email fehlt", { userId, email });
    return res.status(400).json({ error: "❗ userId oder email fehlt" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 180 * 1000); // ⏱️ 3 Minuten

  console.log("🔐 OTP generiert:", otp);
  console.log("⏳ Gültig bis:", expiresAt.toISOString());

  try {
    const doc = await databases.createDocument(
      DB_ID,
      OTP_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        otp,
        expireAt: expiresAt.toISOString(),
      }
    );

    console.log("✅ OTP gespeichert:", doc.$id);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP Verbindung erfolgreich");

    const info = await transporter.sendMail({
      from: `"Leichtes Fahren" <${SMTP_USER}>`,
      to: email,
      subject: "🔐 Dein Verifizierungscode",
      html: `
        <div style="font-family: sans-serif; padding: 24px;">
          <h2>Leichtes Fahren – Verifizierung</h2>
          <p>Gib diesen Code ein:</p>
          <h1 style="font-size: 32px;">${otp}</h1>
          <p>Gültig bis <strong>${expiresAt.toLocaleTimeString()}</strong>.</p>
        </div>
      `,
    });

    console.log("✅ Mail gesendet:", info.response);

    return res.status(200).json({
      success: true,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    console.error("❌ Fehler beim OTP-Versand:", err.message || err);
    return res.status(500).json({ error: "❌ Fehler beim OTP-Versand" });
  }
}
