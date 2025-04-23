// lib/sendCustomOtp.ts
import nodemailer from "nodemailer";
import { Client, Databases, ID } from "node-appwrite";

// 🔧 Appwrite Config
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

export const sendCustomOtp = async (userId: string, email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 30_000).toISOString();

  await databases.createDocument(
    process.env.DB_ID!,
    process.env.OTP_COLLECTION_ID!,
    ID.unique(),
    { userId, otp, expiresAt }
  );

  await transporter.sendMail({
    from: '"Leichtes Fahren" <support@leichtesfahren.pro>',
    to: email,
    subject: "🔐 Dein OTP",
    html: `<h1>Dein Code: ${otp}</h1><p>30 Sekunden gültig</p>`,
  });

  return { expiresAt };
};
