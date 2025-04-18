"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaApple, FaGooglePlay, FaBookOpen, FaUsers } from "react-icons/fa";

/**
 * 🏠 HomePage – Startseite mit Willkommensnachricht & grüner Erfolgsinfo
 */
export default function HomePage() {
  // ✅ Wenn Passwort zurückgesetzt wurde → Hinweis anzeigen
  const [showResetNotice, setShowResetNotice] = useState(false);

  useEffect(() => {
    const success = localStorage.getItem("passwordResetSuccess");
    if (success === "true") {
      setShowResetNotice(true);
      localStorage.removeItem("passwordResetSuccess"); // nur einmal zeigen
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* ✅ Grüner Hinweis nach erfolgreicher Passwortänderung */}
      {showResetNotice && (
        <div className="bg-green-600 text-white text-center py-3 px-4 font-medium">
          ✅ Du kannst dich jetzt mit deinem neuen Passwort in der App{" "}
          <strong>leichtesfahren.pro</strong> einloggen.
        </div>
      )}

      {/* 🔝 HEADER – Navigation oben */}
      <header className="w-full bg-white/90 backdrop-blur-md shadow-md py-4 px-6 flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-blue-700">
          leichtesfahren.pro
        </h1>

        <nav className="flex gap-4 text-sm sm:text-base">
          {/* 👥 Teamseite */}
          <Link href="/team" className="text-blue-600 hover:text-purple-600">
            <FaUsers className="inline mr-1" /> Team
          </Link>
        </nav>
      </header>

      {/* 🎞️ Auto-Image-Slider – mobilfreundlich, kleiner & mit Pause */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto mt-6 sm:mt-10 overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
        <motion.div
          className="flex"
          animate={{
            x: [
              "0%",
              "0%", // ⏸️ Pause auf Bild 1
              "-100%",
              "-100%", // ⏸️ Pause auf Bild 2
              "-200%",
              "-200%", // ⏸️ Pause auf Bild 3
              "-300%",
              "-300%", // ⏸️ Pause auf Bild 4
              "-400%",
              "-400%", // ⏸️ Pause auf Bild 5
              "0%",
            ],
          }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          }}
        >
          {["q1", "q2", "q3", "q4", "q5"].map((img, idx) => (
            <img
              key={idx}
              src={`/images/${img}.png`}
              alt={`App Screenshot ${idx + 1}`}
              className="w-full aspect-square object-contain shrink-0"
            />
          ))}
        </motion.div>
      </div>

      {/* 📱 MAIN-CONTENT – Begrüßung + Download */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {/* 🌸 Farsi Begrüßung */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl w-full mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-rose-600 font-negar mb-2">
            به رانندگی آسان خوش آمدید
          </h2>
          <p className="text-center text-base sm:text-lg text-gray-800 font-light font-negar leading-relaxed">
            یک اپلیکیشن برای یادگیری آسان، ایمن و چندزبانه سوالات گواهینامه
            آلمانی 🇩🇪🇮🇷
          </p>
        </motion.div>

        {/* 🇩🇪 Deutsch Begrüßung */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-2xl w-full"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-4">
            Willkommen bei{" "}
            <span className="text-purple-500">leichtesfahren.pro</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 font-light">
            Deine App für sicheres, leichtes und mehrsprachiges Lernen der
            deutschen Führerscheinfragen 🇩🇪🇮🇷
          </p>
        </motion.div>

        {/* 📲 Download Buttons */}
        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.leichtesfahren"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition w-full text-center"
          >
            <FaGooglePlay /> Google Play
          </a>
          <a
            href="https://apps.apple.com/app/leichtesfahren"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl shadow-md transition w-full text-center"
          >
            <FaApple /> App Store
          </a>
        </motion.div>

        {/* ❓ Fragen testen Button */}
        <motion.div
          className="mt-10 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/quiz-preview">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 w-full rounded-full shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 animate-bounce"
            >
              <FaBookOpen className="text-white" /> Fragen ausprobieren
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* 🔻 FOOTER */}
      <footer className="w-full bg-white/90 backdrop-blur-md text-center text-sm py-4 px-6 text-gray-600 border-t">
        © {new Date().getFullYear()} leichtesfahren.pro – made with 💙 for alle
        Lernenden
      </footer>
    </div>
  );
}
