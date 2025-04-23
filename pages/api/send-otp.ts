// src/pages/api/send-otp.ts

import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

// Faustregel: Timeout für OTP-Endpoint in ms
const OTP_EXPIRY_MS = 3 * 60 * 1000; // 3 Minuten

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true; expiresAt: string } | { error: string }>
) {
  console.log("📥 Request erhalten:", req.method, req.url);

  // Nur POST erlauben
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: "❌ Method Not Allowed – nur POST erlaubt" });
  }

  // ENV lesen & validieren
  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    DB_ID,
    OTP_COLLECTION_ID,
    SMTP_HOST = "smtp-relay.brevo.com",
    SMTP_PORT = "587",
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM = SMTP_USER,
  } = process.env;

  if (
    !APPWRITE_ENDPOINT ||
    !APPWRITE_PROJECT_ID ||
    !APPWRITE_API_KEY ||
    !DB_ID ||
    !OTP_COLLECTION_ID ||
    !SMTP_USER ||
    !SMTP_PASS
  ) {
    console.error("❌ Fehlende ENV-Variablen – check Vercel Settings!");
    return res
      .status(500)
      .json({ error: "❌ Interner Serverfehler (ENV fehlt)" });
  }

  // Payload validieren
  const { userId, email } = req.body as { userId?: unknown; email?: unknown };
  if (
    typeof userId !== "string" ||
    !userId.trim() ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    console.warn("⚠️ Ungültige Anfrage:", { userId, email });
    return res
      .status(400)
      .json({ error: "❗ userId fehlt oder email ist ungültig" });
  }

  // OTP & Expiry generieren
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAtDate = new Date(Date.now() + OTP_EXPIRY_MS);
  const expiresAt = expiresAtDate.toISOString();

  try {
    // Appwrite: OTP speichern
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY);
    const databases = new Databases(client);
    const doc = await databases.createDocument(
      DB_ID,
      OTP_COLLECTION_ID,
      ID.unique(),
      { userId, otp, expireAt: expiresAt }
    );
    console.log("✅ OTP in DB gespeichert, ID=", doc.$id);

    // Nodemailer: SMTP-Transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.verify();
    console.log("✅ SMTP ready");

    // Mail versenden und Response loggen
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject: "🔐 Dein Verifizierungscode",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 24px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 16px;">Leichtes Fahren – Verifizierung</h2>
          <p style="font-size: 16px; color: #555;">Gib diesen Code ein:</p>
          <p style="font-size: 40px; letter-spacing: 4px; font-weight: bold; color: #1a73e8; margin: 16px 0;">${otp}</p>
          <p style="font-size: 14px; color: #888;">Gültig bis <strong>${expiresAtDate.toLocaleTimeString(
            "de-DE"
          )}</strong></p>
        </div>
      `,
    });
    console.log("✅ Mail gesendet, messageId=", info.messageId);
    console.log("   SMTP-Response=", info.response);

    // Erfolgreiche Antwort
    return res.status(200).json({ success: true, expiresAt });
  } catch (err: any) {
    console.error("❌ Fehler beim OTP-Versand:", err);
    return res
      .status(500)
      .json({ error: "❌ Interner Serverfehler beim OTP-Versand" });
  }
}
