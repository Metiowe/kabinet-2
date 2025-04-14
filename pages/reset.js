// pages/reset.js
import { useState } from "react";
import { useRouter } from "next/router";
import { account } from "../lib/appwrite";

export default function ResetPage() {
  const router = useRouter();
  const { userId, secret } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const inputStyle =
    "w-full p-3 pr-10 border border-gray-700 rounded-lg mb-4 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-850 shadow-xl rounded-2xl w-full max-w-md p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Passwort zurücksetzen
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          Bitte gib dein neues Passwort ein.
        </p>

        {/* Neues Passwort */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Neues Passwort"
            className={inputStyle}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="material-icons absolute right-3 top-3 text-gray-400 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </div>

        {/* Bestätigen */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Passwort bestätigen"
            className={inputStyle}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            className="material-icons absolute right-3 top-3 text-gray-400 cursor-pointer"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? "visibility_off" : "visibility"}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-4 transition duration-200"
        >
          Passwort zurücksetzen
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
}
