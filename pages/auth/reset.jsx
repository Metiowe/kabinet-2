import React, { useState } from "react";
import Link from "next/link";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleReset = (e) => {
    e.preventDefault();
    // Firebase Password Reset Logik kommt später
    setMessage(
      "📧 Wenn dein Konto existiert, hast du jetzt eine E-Mail zum Zurücksetzen."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/slider2.jpg')] bg-cover bg-center blur-sm opacity-30 dark:opacity-20" />

      <div className="relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
          Passwort zurücksetzen
        </h1>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/60 dark:bg-gray-700/60 backdrop-blur text-black dark:text-white"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-green-700 hover:bg-green-800 text-white transition"
          >
            Link zum Zurücksetzen senden
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-green-700 dark:text-green-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-gray-700 dark:text-gray-300">
          Du erinnerst dich doch?{" "}
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Zurück zum Login
          </Link>
        </p>
      </div>
    </div>
  );
}
