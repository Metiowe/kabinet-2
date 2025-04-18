// pages/team.tsx
"use client";

import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * 👥 TeamPage – animierte Version mit Vertrauen & Persönlichkeit
 */
export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-900 px-6 py-12">
      <Head>
        <title>Unser Team – Leichtesfahren</title>
        <meta
          name="description"
          content="Lerne das Team hinter Leichtesfahren kennen – moderne Theorie-App für deinen Führerschein."
        />
      </Head>

      {/* 🧭 Titel */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-6 text-blue-700"
      >
        👥 Unser Team
      </motion.h1>

      {/* ✍️ Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center max-w-2xl mx-auto text-lg text-gray-700 mb-12"
      >
        Hinter <strong>Leichtesfahren</strong> steht ein engagiertes Team, das
        dir hilft, die Theorie modern, effizient und mit Freude zu lernen.
      </motion.p>

      {/* 👤 Mitglieder */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white pt-10 pb-6 px-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all"
          >
            <Image
              src={member.image}
              alt={member.name}
              width={100}
              height={100}
              className="rounded-full mx-auto mb-6 object-cover"
            />
            <h2 className="text-xl font-semibold leading-snug mb-2 break-words">
              {member.icon} {member.name}
            </h2>
            <p className="text-gray-600 text-sm whitespace-pre-line mt-3 leading-relaxed">
              {member.role}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 📅 Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-16 text-sm text-gray-500"
      >
        Made with ❤️ by Leichtesfahren • {new Date().getFullYear()}
      </motion.p>
    </div>
  );
}

const teamMembers = [
  {
    name: "Mahdi B.N",
    role: "Gründer & Entwickler",
    role: "UX/UI Design\nGründer & Fullstack Entwickler",
    image: "/logo6.png",
    icon: "👨‍💻",
  },
  {
    name: "Simin M",
    role: "Content & Mitentwicklung der\nPrüfungsfragen",
    image: "/logo6.png",
    icon: "✍️",
  },
  {
    name: "KI Logiksystem",
    role: "Adaptive Analyse,\nLernverhalten & smarte\nOptimierung der Vorbereitung",
    image: "/logo6.png",
    icon: "🤖",
  },
];
