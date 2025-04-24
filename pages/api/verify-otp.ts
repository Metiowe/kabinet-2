// 📄 pages/api/verify-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases, Query } from "node-appwrite";

/**
 * 🔐 Verifiziert OTP-Code und löscht ihn – egal ob gültig oder abgelaufen
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "❌ Nur POST erlaubt" });
  }

  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    DB_ID,
    OTP_COLLECTION_ID,
    CLOUD_USERS_COLLECTION,
  } = process.env;

  if (
    !APPWRITE_ENDPOINT ||
    !APPWRITE_PROJECT_ID ||
    !APPWRITE_API_KEY ||
    !DB_ID ||
    !OTP_COLLECTION_ID ||
    !CLOUD_USERS_COLLECTION
  ) {
    console.error("❌ Fehlende ENV Variablen");
    return res.status(500).json({ error: "❌ Fehlende Serverkonfiguration" });
  }

  const { userId, otpCode } = req.body;
  if (
    typeof userId !== "string" ||
    typeof otpCode !== "string" ||
    otpCode.length !== 6
  ) {
    return res.status(400).json({
      error:
        "❗ Ungültige Eingaben: userId und 6-stelliger otpCode erforderlich",
    });
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);
  const db = new Databases(client);

  try {
    const otpResult = await db.listDocuments(DB_ID, OTP_COLLECTION_ID, [
      Query.equal("user_id", userId),
      Query.equal("otp", otpCode),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);

    const otpDoc = otpResult.documents[0];
    if (!otpDoc) {
      return res
        .status(400)
        .json({ error: "❌ Code ungültig oder nicht gefunden" });
    }

    const now = new Date();
    const expiresAt = new Date(otpDoc.expireAt);

    if (!otpDoc.expireAt || isNaN(expiresAt.getTime()) || now >= expiresAt) {
      try {
        await db.deleteDocument(DB_ID, OTP_COLLECTION_ID, otpDoc.$id);
      } catch (e) {
        console.warn("⚠️ Konnte OTP-Dokument nicht löschen:", e);
      }
      return res.status(410).json({ error: "⌛ Code abgelaufen" });
    }

    const userResult = await db.listDocuments(DB_ID, CLOUD_USERS_COLLECTION, [
      Query.equal("user_id", userId),
      Query.limit(1),
    ]);

    const userDoc = userResult.documents[0];
    if (!userDoc) {
      return res
        .status(404)
        .json({ error: "❌ Benutzer-Dokument nicht gefunden" });
    }

    await db.updateDocument(DB_ID, CLOUD_USERS_COLLECTION, userDoc.$id, {
      verified: true,
    });

    try {
      await db.deleteDocument(DB_ID, OTP_COLLECTION_ID, otpDoc.$id);
    } catch (e) {
      console.warn(
        "⚠️ Konnte OTP-Dokument nach Verifizierung nicht löschen:",
        e
      );
    }

    return res.status(200).json({
      success: true,
      message: "✅ Verifizierung erfolgreich",
      userId,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    console.error("❌ Serverfehler bei Verifizierung:", err);
    return res.status(500).json({ error: "❌ Interner Serverfehler" });
  }
}
