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
      setMessage("✅ Passwort erfolgreich geändert.");
      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      setMessage("❌ Fehler: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-800 mb-2">
          Passwort zurücksetzen
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Bitte gib dein neues Passwort ein.
        </p>

        <input
          type="password"
          placeholder="Neues Passwort"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort bestätigen"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
        >
          Passwort zurücksetzen
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
