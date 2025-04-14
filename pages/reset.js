// pages/reset.js

import { useState } from "react";
import { useRouter } from "next/router";
import { account } from "../lib/appwrite";

export default function ResetPage() {
  const router = useRouter();
  const { userId, secret } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!password || password !== confirm) {
      return setMessage("❌ Passwörter stimmen nicht überein.");
    }

    try {
      await account.updateRecovery(userId, secret, password, confirm);
      setMessage(
        "✅ Passwort erfolgreich geändert. Du wirst weitergeleitet..."
      );
      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      setMessage("❌ Fehler: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">
          Passwort zurücksetzen
        </h1>

        <input
          type="password"
          placeholder="Neues Passwort"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort bestätigen"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Zurücksetzen
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}
