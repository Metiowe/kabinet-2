"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import supabase from "@/lib/supabaseClient";

export default function SignupPage() {
  const [message, setMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Bitte eine gültige E-Mail-Adresse eingeben.")
        .required("E-Mail ist erforderlich."),
      password: Yup.string()
        .min(6, "Passwort muss mindestens 6 Zeichen haben.")
        .required("Passwort ist erforderlich."),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwörter stimmen nicht überein.")
        .required("Passwortbestätigung ist erforderlich."),
    }),
    onSubmit: async ({ email, password }) => {
      setMessage(null);

      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes("already") ||
          msg.includes("exists") ||
          msg.includes("user") ||
          msg.includes("rate limit") ||
          error.status === 400
        ) {
          setMessage(
            "Diese E-Mail ist bereits registriert oder noch nicht bestätigt."
          );
        } else {
          setMessage("Fehler: " + error.message);
        }
      } else {
        setMessage("Bestätigungs-E-Mail gesendet. Bitte Posteingang checken.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/slider4.jpg')] bg-cover bg-center blur-sm opacity-30 dark:opacity-20" />

      <div className="relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
          Registrieren
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
              <p className="text-sm text-orange-400 mt-1">
                {formik.errors.email}
              </p>
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
              <p className="text-sm text-orange-400 mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Passwort bestätigen"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/60 dark:bg-gray-700/60 text-black dark:text-white"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-sm text-orange-400 mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-green-700 hover:bg-green-800 text-white transition"
          >
            Registrieren
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-green-700 dark:text-green-400">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-gray-700 dark:text-gray-300">
          Schon registriert?{" "}
          <Link href="/auth/signin" className="text-green-600 hover:underline">
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
