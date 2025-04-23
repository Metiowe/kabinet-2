"use client";

import React, { useEffect, useState } from "react";

/**
 * 🏠 HomePage – Nur Erfolgsmeldung nach Passwort-Reset
 */
export default function HomePage() {
  const [showResetNotice, setShowResetNotice] = useState(false);

  useEffect(() => {
    const success = localStorage.getItem("passwordResetSuccess");
    if (success === "true") {
      setShowResetNotice(true);
      localStorage.removeItem("passwordResetSuccess"); // nur einmal zeigen
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center">
        {showResetNotice && (
          <div className="bg-green-600 text-white rounded-lg px-6 py-4 text-lg font-semibold shadow-md">
            ✅ Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich
            jetzt in der App{" "}
            <span className="font-bold">leichtesfahren.pro</span> einloggen.
          </div>
        )}
      </div>
    </div>
  );
}
