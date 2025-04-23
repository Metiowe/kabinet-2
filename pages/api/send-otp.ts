// pages/api/send-otp.ts

import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "❌ Nur POST erlaubt" });
  }

  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "❗ userId oder email fehlt" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 30 * 1000);

  try {
    // ➕ OTP in Appwrite speichern
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

    // 📤 SMTP senden (nur serverseitig erlaubt!)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: '"Leichtes Fahren" <support@leichtesfahren.pro>',
      to: email,
      subject: "🔐 Dein Verifizierungscode",
      html: `
        <div style="font-family: sans-serif; padding: 24px;">
          <h2>Leichtes Fahren – Verifizierung</h2>
          <p>Gib diesen Code ein:</p>
          <h1 style="font-size: 32px;">${otp}</h1>
          <p>Gültig für 30 Sekunden.</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ success: true, expiresAt: expiresAt.toISOString() });
  } catch (err: any) {
    console.error("❌ Fehler beim OTP-Versand:", err.message);
    return res.status(500).json({ error: "❌ Fehler beim OTP-Versand" });
  }
}
