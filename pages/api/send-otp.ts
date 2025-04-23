// src/pages/api/send-otp.ts

import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: true; expiresAt: string } | { error: string }>
) {
  console.log("📥 Request erhalten:", req.method, req.url);

  // ↳ ENV erst hier validieren
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

  // 🔒 Nur POST zulassen
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: "❌ Method Not Allowed – nur POST erlaubt" });
  }

  // 📦 Payload validieren
  const { userId, email } = req.body as {
    userId?: unknown;
    email?: unknown;
  };
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

  // 🔢 OTP generieren & Ablaufzeit definieren
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 Min.

  try {
    // 💾 Appwrite
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY);
    const databases = new Databases(client);
    const doc = await databases.createDocument(
      DB_ID,
      OTP_COLLECTION_ID,
      ID.unique(),
      { userId, otp, expireAt: expiresAt.toISOString() }
    );
    console.log("✅ OTP in DB gespeichert:", doc.$id);

    // ✉️ Mailer
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.verify();
    console.log("✅ SMTP ready");

    await transporter.sendMail({
      from: `"Leichtes Fahren" <${SMTP_USER}>`,
      to: email,
      subject: "🔐 Dein Verifizierungscode",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          background-color: #f7f7f7;
          padding: 24px;
          border-radius: 8px;
        ">
          <h2 style="color: #333; margin-bottom: 16px;">
            Leichtes Fahren – Verifizierung
          </h2>
          <p style="font-size: 16px; color: #555;">
            Gib diesen Code ein:
          </p>
          <p style="
            font-size: 40px;
            letter-spacing: 4px;
            font-weight: bold;
            color: #1a73e8;
            margin: 16px 0;
          ">
            ${otp}
          </p>
          <p style="font-size: 14px; color: #888;">
            Gültig bis <strong>${expiresAt.toLocaleTimeString("de-DE")}</strong>
          </p>
        </div>
      `,
    });
    console.log("✅ Mail gesendet an:", email);

    return res
      .status(200)
      .json({ success: true, expiresAt: expiresAt.toISOString() });
  } catch (err: any) {
    console.error("❌ Fehler beim OTP-Versand:", err.message || err);
    return res
      .status(500)
      .json({ error: "❌ Interner Serverfehler beim OTP-Versand" });
  }
}
