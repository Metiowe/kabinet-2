// 📄 pages/api/verify-otp.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases, Query } from "node-appwrite";

/**
 * 🔐 Verifiziert einen 6-stelligen OTP-Code anhand von userId & otpCode.
 * ➕ Wenn erfolgreich: Setzt das `verified`-Flag auf `true`.
 * 🧹 Löscht den OTP-Code aus der Datenbank – egal ob gültig oder abgelaufen.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 🔒 Nur POST erlaubt
  if (req.method !== "POST") {
    return res.status(405).json({ error: "❌ Nur POST erlaubt" });
  }

  // 🧪 ENV-Variablen prüfen
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
    return res
      .status(500)
      .json({ error: "❌ Fehlende Serverkonfiguration (ENV)" });
  }

  // 📥 Eingaben validieren
  const { userId, otpCode } = req.body;

  if (
    typeof userId !== "string" ||
    typeof otpCode !== "string" ||
    otpCode.length !== 6
  ) {
    return res.status(400).json({
      error:
        "❗ Ungültige Eingaben: userId (string) und otpCode (6-stellig) erforderlich",
    });
  }

  // 🧩 Appwrite Setup
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  const db = new Databases(client);

  try {
    // 🔎 Suche den OTP-Code zum User
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

    const expiresAt = new Date(otpDoc.expireAt);
    const now = new Date();

    // ⌛ Ablaufzeit prüfen
    if (!otpDoc.expireAt || isNaN(expiresAt.getTime()) || now >= expiresAt) {
      await db.deleteDocument(DB_ID, OTP_COLLECTION_ID, otpDoc.$id); // ⛔ Sofort löschen
      return res.status(410).json({ error: "⌛ Code abgelaufen" });
    }

    // 🧍 Benutzer-Dokument finden
    const userResult = await db.listDocuments(DB_ID, CLOUD_USERS_COLLECTION, [
      Query.equal("userId", userId),
      Query.limit(1),
    ]);

    const userDoc = userResult.documents[0];

    if (!userDoc) {
      return res
        .status(404)
        .json({ error: "❌ Benutzer-Dokument nicht gefunden" });
    }

    // ✅ Benutzer verifizieren
    await db.updateDocument(DB_ID, CLOUD_USERS_COLLECTION, userDoc.$id, {
      verified: true,
    });

    // 🧹 OTP-Code löschen
    await db.deleteDocument(DB_ID, OTP_COLLECTION_ID, otpDoc.$id);

    // 🟢 Erfolg zurückgeben
    return res.status(200).json({
      success: true,
      message: "✅ Verifizierung erfolgreich",
      userId,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err: any) {
    // 🚨 Fallback bei Fehler
    const errorResponse = {
      error: "❌ Interner Serverfehler",
      message: err?.message || "Unbekannter Fehler",
      name: err?.name || "Unbekannt",
      response: err?.response ?? null,
    };

    return res.status(500).json(errorResponse);
  }
}
