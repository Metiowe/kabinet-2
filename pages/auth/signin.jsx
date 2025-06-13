"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [showResend, setShowResend] = useState(false);
  const [emailToResend, setEmailToResend] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Bitte eine gültige E-Mail eingeben.")
        .required("E-Mail ist erforderlich."),
      password: Yup.string()
        .min(6, "Passwort muss mindestens 6 Zeichen lang sein.")
        .required("Passwort ist erforderlich."),
    }),
    onSubmit: async ({ email, password }) => {
      setMessage(null);
      setShowResend(false);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setMessage(signInError.message);
        return;
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        setMessage("Fehler beim Abrufen des Benutzers.");
        return;
      }

      const isConfirmed = userData.user.email_confirmed_at !== null;

      if (!isConfirmed) {
        setMessage("Bitte bestätige zuerst deine E-Mail-Adresse.");
        setShowResend(true);
        setEmailToResend(email);
        return;
      }

      router.push("/");
    },
  });

  const handleResend = async () => {
    setMessage("Bestätigungslink wird gesendet...");

    const { error } = await supabase.auth.signUp({
      email: emailToResend,
      password: crypto.randomUUID(), // Dummy Passwort
      options: {
        shouldCreateUser: false, // Verhindert "already registered" Fehler
      },
    });

    if (error) {
      setMessage("Fehler beim erneuten Senden: " + error.message);
    } else {
      setMessage("Neuer Bestätigungslink gesendet. Bitte Posteingang prüfen.");
      setShowResend(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/slider3.jpg')] bg-cover bg-center blur-sm opacity-30 dark:opacity-20" />
      <div className="relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
          Anmelden
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="E-Mail"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/60 dark:bg-gray-700/60 text-black dark:text-white"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-400 mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Passwort"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/60 dark:bg-gray-700/60 text-black dark:text-white"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-400 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>
          <div className="text-right text-sm">
            <Link href="/auth/reset" className="text-blue-600 hover:underline">
              Passwort vergessen?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-green-700 hover:bg-green-800 text-white transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-red-400">{message}</p>
        )}

        {showResend && (
          <div className="mt-4 text-center">
            <button
              onClick={handleResend}
              className="text-sm text-blue-600 hover:underline"
            >
              Bestätigungslink erneut senden
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-center text-gray-700 dark:text-gray-300">
          Noch kein Konto?{" "}
          <Link href="/auth/signup" className="text-green-600 hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
