import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases, Query } from "node-appwrite";

/**
 * 🔐 Verifiziert OTP-Code & löscht ihn IMMER – auch wenn abgelaufen
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Nur POST-Anfragen erlaubt." });
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
    return res.status(500).json({
      error: "❌ Fehlende ENV-Variablen – prüfe .env / app.config.js",
    });
  }

  const { userId, otpCode } = req.body;

  if (
    typeof userId !== "string" ||
    typeof otpCode !== "string" ||
    otpCode.length !== 6
  ) {
    return res.status(400).json({
      error:
        "❗ Ungültige Eingaben. Bitte sende userId & 6-stelligen Code als Text.",
    });
  }

  try {
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY);

    const db = new Databases(client);

    const result = await db.listDocuments(DB_ID, OTP_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("otp", otpCode),
      Query.orderDesc("$createdAt"),
      Query.limit(1),
    ]);

    const otpDoc = result.documents[0];

    if (!otpDoc) {
      return res.status(400).json({
        error: "❌ Der Code ist ungültig oder existiert nicht.",
      });
    }

    const now = new Date();
    const expiresAt = new Date(otpDoc.expireAt);

    // ⚠️ Wenn abgelaufen: Sofort löschen & Fehler zurückgeben
    if (
      !otpDoc.expireAt ||
      isNaN(expiresAt.getTime()) ||
      now.getTime() >= expiresAt.getTime()
    ) {
      await db.deleteDocument(DB_ID, OTP_COLLECTION_ID, otpDoc.$id); // ❌ Löschen!
      return res.status(400).json({
        error: "❌ Der Code ist abgelaufen. Bitte fordere einen neuen an.",
      });
    }

    const userResult = await db.listDocuments(DB_ID, CLOUD_USERS_COLLECTION, [
      Query.equal("user_id", userId),
      Query.limit(1),
    ]);

    const userDoc = userResult.documents[0];
    if (!userDoc) {
      return res.status(404).json({
        error: "❌ Benutzer-Dokument nicht gefunden.",
      });
    }

    // ✅ Verifizieren
    await db.updateDocument(DB_ID, CLOUD_USERS_COLLECTION, userDoc.$id, {
      verified: true,
    });

    // ✅ OTP löschen nach Erfolg
    await db.deleteDocument(DB_ID, OTP_COLLECTION_ID, otpDoc.$id);

    return res.status(200).json({
      success: true,
      message: "✅ Verifizierung erfolgreich",
      userDocId: userDoc.$id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      error:
        "❌ Interner Serverfehler bei der Verifizierung. Bitte später erneut versuchen.",
    });
  }
}
