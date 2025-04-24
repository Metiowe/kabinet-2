//pages/reset.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { account } from "@/lib/appwrite";

export default function ResetPage() {
  const router = useRouter();
  const { userId, secret } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  // ⛔️ Typen sicherstellen: warte bis router.query geladen ist
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (router.isReady) setReady(true);
  }, [router.isReady]);

  const handleReset = async () => {
    if (!userId || !secret || Array.isArray(userId) || Array.isArray(secret)) {
      setMessage("❌ Link ungültig oder abgelaufen.");
      return;
    }

    if (!password || password.length < 6) {
      setMessage("❌ Passwort muss min. 6 Zeichen haben.");
      return;
    }

    if (password !== confirm) {
      setMessage("❌ Passwörter stimmen nicht überein.");
      return;
    }

    try {
      // ✅ Nur 3 Argumente übergeben – fix für Appwrite v17
      await account.updateRecovery(userId, secret, password);

      localStorage.setItem("passwordResetSuccess", "true");
      setMessage("✅ Passwort erfolgreich geändert.");

      setTimeout(() => router.replace("/"), 3000);
    } catch (err: any) {
      setMessage("❌ Fehler beim Zurücksetzen: " + err.message);
    }
  };

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-6">
      <h1 className="text-2xl font-bold mb-4">Passwort zurücksetzen</h1>

      <input
        type="password"
        placeholder="Neues Passwort"
        className="mb-2 p-3 rounded bg-gray-800 w-full max-w-md"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort bestätigen"
        className="mb-4 p-3 rounded bg-gray-800 w-full max-w-md"
        onChange={(e) => setConfirm(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="bg-blue-600 hover:bg-blue-700 py-2 px-6 rounded"
      >
        Zurücksetzen
      </button>

      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </main>
  );
}
