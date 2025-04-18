"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCheck, FaGift, FaGlobe, FaRedo } from "react-icons/fa";

// 📋 Fragen mit Mehrfachantworten, Punkten, Kategorien usw.
const questions = [
  {
    id: 1,
    reference: "1.2.03-019",
    category: "Vorfahrt",
    points: 3,
    image: "/logo6.png",
    question: {
      de: "Was ist bei diesem Verkehrszeichen zu beachten?",
      fa: "در این تابلو باید به چه نکته‌ای توجه کرد؟",
    },
    options: {
      de: [
        "Vorfahrt gewähren",
        "Halt. Vorfahrt gewähren",
        "Stoppschild überfahren",
      ],
      fa: [
        "حق تقدم را رعایت کنید",
        "ایست. حق تقدم دهید",
        "تابلوی ایست را رد کنید",
      ],
    },
    correctIndexes: [0, 1],
  },
  {
    id: 2,
    reference: "1.1.01-002",
    category: "Verkehrszeichen",
    points: 2,
    image: "/logo6.png",
    question: {
      de: "Was bedeutet dieses Verkehrszeichen?",
      fa: "این علامت ترافیکی چه مفهومی دارد؟",
    },
    options: {
      de: [
        "Verbot für Fahrzeuge aller Art",
        "Fußgängerzone",
        "Einfahrt verboten",
      ],
      fa: ["ممنوعیت برای تمام وسایل نقلیه", "منطقه عابر پیاده", "ورود ممنوع"],
    },
    correctIndexes: [2],
  },
];

export default function QuizPreview() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState([]);
  const [language, setLanguage] = useState("de");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const missedCorrects = confirmed
    ? q.correctIndexes.filter((i) => !selected.includes(i))
    : [];

  // 🔁 Sprache umschalten
  const toggleSelect = (index) => {
    if (confirmed) return;
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // ⏲ Zeit runterzählen
  useEffect(() => {
    if (confirmed || finished) return;
    if (timeLeft === 0) handleConfirm();
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, confirmed]);

  // ✅ Antwort bestätigen
  const handleConfirm = () => {
    if (selected.length === 0 || confirmed) return;
    const correctSet = new Set(q.correctIndexes);
    const selectedSet = new Set(selected);
    const isFullyCorrect =
      [...correctSet].every((i) => selectedSet.has(i)) &&
      [...selectedSet].every((i) => correctSet.has(i));

    if (isFullyCorrect) setScore((s) => s + q.points);
    setConfirmed(true);
  };

  // ⏭ Nächste Frage oder Finish
  const handleNext = () => {
    if (isLast) return setFinished(true);
    setSelected([]);
    setConfirmed(false);
    setTimeLeft(30);
    setCurrent((prev) => prev + 1);
  };

  // 🔁 Zurück zur Startseite
  const handleRestart = () => router.push("/");

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4 text-center">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            {language === "de" ? "Dein Ergebnis" : "نتیجه شما"}
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {language === "de"
              ? `Du hast ${score} Punkte erreicht!`
              : `شما ${score} امتیاز کسب کردید!`}
          </p>
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
          >
            <FaRedo className="inline mr-2" />
            {language === "de"
              ? "Zurück zur Startseite"
              : "بازگشت به صفحه اصلی"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 🔤 Sprachumschalter + Fortschrittsanzeige */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mr-4">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setLanguage((prev) => (prev === "de" ? "fa" : "de"))}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <FaGlobe /> {language === "de" ? "فارسی" : "Deutsch"}
          </button>
        </div>

        {/* ⏲ Zeit */}
        <div className="text-right text-sm text-gray-600 mb-2">
          {language === "de" ? "Zeit verbleibend" : "زمان باقی‌مانده"}:{" "}
          {timeLeft}s
        </div>

        {/* 🧭 Zusatzinfos */}
        <div className="mb-4 text-sm text-gray-600 flex flex-col sm:flex-row sm:justify-center gap-2 text-center">
          <span>📚 {q.category}</span>
          <span>⭐ {q.points} Punkte</span>
          <span>📘 Ref: {q.reference}</span>
        </div>

        {/* 🖼 Bild */}
        <div className="mb-6">
          <Image
            src={q.image}
            alt="Fragenbild"
            width={600}
            height={300}
            className="rounded-xl mx-auto object-cover"
          />
        </div>

        {/* ❓ Frage */}
        <h3
          className={`text-lg font-bold mb-3 leading-relaxed text-center text-gray-800 ${
            language === "fa" ? "font-negar" : ""
          }`}
        >
          {q.question[language]}
        </h3>

        {/* ✅ Optionen */}
        <div className="flex flex-col gap-3 items-center mt-4">
          {q.options[language].map((opt, index) => {
            const isSelected = selected.includes(index);
            const isCorrect = confirmed && q.correctIndexes.includes(index);
            const isIncorrect =
              confirmed && isSelected && !q.correctIndexes.includes(index);
            const isMissed =
              confirmed && !isSelected && q.correctIndexes.includes(index);

            return (
              <button
                key={index}
                onClick={() => toggleSelect(index)}
                className={`w-full sm:w-4/5 px-4 py-2 rounded-lg border text-sm text-gray-800 transition-all flex justify-between items-center
                  ${language === "fa" ? "flex-row-reverse" : ""}
                  ${
                    isSelected
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-gray-100"
                  }
                  ${isCorrect ? "border-green-500 bg-green-100" : ""}
                  ${isIncorrect ? "border-red-500 bg-red-100" : ""}
                  ${isMissed ? "border-yellow-500 bg-yellow-100" : ""}`}
              >
                <span>{opt}</span>
                {confirmed && isCorrect && (
                  <span className="text-green-600 font-bold">✔✔</span>
                )}
                {confirmed && isIncorrect && (
                  <span className="text-red-500 font-bold">✔</span>
                )}
                {confirmed && isMissed && (
                  <span className="text-yellow-600 font-bold">⚠</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 🟡 Hinweis bei fehlenden richtigen Antworten */}
        {confirmed && missedCorrects.length > 0 && (
          <div className="mt-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-300 px-4 py-2 rounded-md text-center">
            {language === "de"
              ? "Du hast eine oder mehrere richtige Antworten vergessen."
              : "شما یک یا چند گزینه صحیح را انتخاب نکرده‌اید."}
          </div>
        )}

        {/* 🔘 Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition disabled:opacity-50"
            >
              <FaCheck className="inline mr-2" />{" "}
              {language === "de" ? "Bestätigen" : "تایید"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
            >
              <FaGift className="inline mr-2" />{" "}
              {language === "de" ? "Nächste Frage" : "سوال بعدی"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
