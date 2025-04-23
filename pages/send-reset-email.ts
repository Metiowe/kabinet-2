import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// 🔐 Transporter für Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, resetLink } = req.body;

  if (!email || !resetLink) {
    return res.status(400).json({ error: "E-Mail und Link sind erforderlich" });
  }

  try {
    await transporter.sendMail({
      from: `"Leichtesfahren" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔁 Passwort zurücksetzen",
      html: `
        <p>Hallo,</p>
        <p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Falls du das nicht angefordert hast, kannst du diese Nachricht ignorieren.</p>
        <p>Leichtesfahren Team</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("E-Mail-Versand fehlgeschlagen:", error);
    res.status(500).json({ error: "E-Mail-Versand fehlgeschlagen" });
  }
}
