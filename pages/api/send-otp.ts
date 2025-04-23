// pages/api/send-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { sendCustomOtp } from "@/lib/sendCustomOtp";

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

  try {
    const result = await sendCustomOtp(userId, email);
    return res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    console.error("❌ Fehler beim OTP-Versand:", err.message);
    return res.status(500).json({ error: "❌ Fehler beim OTP-Versand" });
  }
}
