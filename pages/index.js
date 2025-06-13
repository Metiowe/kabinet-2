"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sofa,
  LampDesk,
  Ruler,
  Truck,
  LogOut,
} from "lucide-react";
import supabase from "@/lib/supabaseClient";

const footerImages = [
  "slider1.jpg",
  "slider2.jpg",
  "slider3.jpg",
  "slider4.jpg",
  "slider2.jpg",
  "slider1.jpg",
];

const sliderImages = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
  "/images/slider4.jpg",
];

export default function HomePage() {
  const sliderRef = useRef(null);
  const footerSliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [footerPage, setFooterPage] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.clientWidth * index,
        behavior: "smooth",
      });
    }
  }, [index]);

  useEffect(() => {
    const totalPages = Math.ceil(footerImages.length / 3);
    const interval = setInterval(() => {
      setFooterPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (footerSliderRef.current) {
      const containerWidth = footerSliderRef.current.clientWidth;
      footerSliderRef.current.scrollTo({
        left: footerPage * containerWidth,
        behavior: "smooth",
      });
    }
  }, [footerPage]);

  const goToPrev = () =>
    setIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  const goToNext = () => setIndex((prev) => (prev + 1) % sliderImages.length);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-700 dark:text-green-400 mr-8">
          MöbelStyle
        </h1>
        <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap space-x-4 text-sm font-semibold text-gray-700 dark:text-gray-200 scrollbar-hide">
          <a
            href="#mission"
            className="hover:text-green-700 dark:hover:text-green-400"
          >
            Über uns
          </a>
          <a
            href="#services"
            className="hover:text-green-700 dark:hover:text-green-400"
          >
            Leistungen
          </a>
          <a
            href="#contact"
            className="hover:text-green-700 dark:hover:text-green-400"
          >
            Kontakt
          </a>
          <a
            href="/produkte"
            className="hover:text-green-700 dark:hover:text-green-400"
          >
            Produkte kaufen
          </a>

          {!user ? (
            <>
              <a
                href="/auth/signin"
                className="hover:text-green-700 dark:hover:text-green-400"
              >
                Anmelden
              </a>
              <a
                href="/auth/signup"
                className="hover:text-green-700 dark:hover:text-green-400"
              >
                Registrieren
              </a>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div
                title={user.email}
                className="w-8 h-8 flex items-center justify-center bg-green-600 text-white font-bold rounded-full overflow-hidden"
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profilbild"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.email.charAt(0).toUpperCase()
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </nav>
      </header>

      <div className="h-16" />

      {/* Rest der Seite bleibt unverändert */}
      <section className="text-center py-12 px-4 bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
          Moderne Möbel für dein Zuhause
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
          Entdecke stilvolle Möbelstücke für Wohnzimmer, Küche und Büro.
          Nachhaltig. Zeitlos. Hochwertig.
        </p>
      </section>

      <div className="relative w-full h-64 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <button
          onClick={goToPrev}
          className="absolute left-4 z-10 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <ChevronLeft size={20} />
        </button>
        <div
          ref={sliderRef}
          className="w-full h-full flex overflow-hidden scroll-smooth"
        >
          {sliderImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <ChevronRight size={20} />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === index ? "bg-green-700" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800 flex flex-col md:flex-row items-center gap-20">
        <img
          src="/images/slider5.jpg"
          alt="Wohnwand Design"
          className="w-full md:w-1/2 rounded-xl shadow-lg hover:scale-105 transition duration-300"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
            MöbelStyle Kollektion 2025
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            Stilvolle Wohnlösungen, die Funktionalität und Eleganz verbinden.
            Perfekt für jedes Zuhause.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Nachhaltige Materialien, modernes Design, maßgeschneiderter Service.
            Direkt zu dir nach Hause geliefert.
          </p>
        </div>
      </section>

      <section
        id="mission"
        className="py-16 px-6 text-center bg-white dark:bg-gray-900"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-green-300">
          Warum MöbelStyle?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Design trifft Komfort", "Elegante Möbel für stilvolles Wohnen."],
            ["Nachhaltige Qualität", "Massivholz & umweltfreundliche Lacke."],
            ["Faire Preise", "Direkt vom Hersteller – ohne Umwege."],
          ].map(([title, desc], i) => (
            <div key={i}>
              <CheckCircle className="mx-auto text-green-600" size={36} />
              <h3 className="text-xl font-semibold mt-4">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="services"
        className="py-16 px-6 bg-gray-50 dark:bg-gray-800 text-center"
      >
        <h2 className="text-3xl font-bold mb-10 text-green-800 dark:text-green-300">
          Unsere Leistungen
        </h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:flex-wrap gap-8 text-left text-lg font-medium text-gray-700 dark:text-gray-300">
          {[
            {
              Icon: Sofa,
              title: "Wohnmöbel",
              desc: "Couch, Wohnwand & Regale im Set oder einzeln",
            },
            {
              Icon: LampDesk,
              title: "Büromöbel",
              desc: "Ergonomisch & stilvoll für dein Homeoffice",
            },
            {
              Icon: Ruler,
              title: "Maßanfertigung",
              desc: "Individuelle Möbel nach Wunschmaß",
            },
            {
              Icon: Truck,
              title: "Lieferung & Aufbau",
              desc: "Schnell, zuverlässig, direkt in dein Zuhause",
            },
          ].map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="relative group w-full md:w-1/2 lg:w-1/4 cursor-pointer p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <Icon className="w-8 h-8 text-green-700 dark:text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-400 mb-1">
                    {title}
                  </h3>
                  <p>{desc}</p>
                </div>
              </div>
              <div
                className="absolute inset-0 bg-green-50 dark:bg-gray-700 bg-opacity-95 flex flex-col justify-center items-center text-center p-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ pointerEvents: "none" }}
              >
                <h3 className="font-bold text-green-900 dark:text-green-200 mb-2 text-xl">
                  {title}
                </h3>
                <p className="text-green-800 dark:text-green-300">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6">
          Unsere Möbel in Aktion
        </h2>
        <div className="relative overflow-hidden">
          <div
            ref={footerSliderRef}
            className="flex transition-all duration-500 ease-in-out w-full overflow-hidden"
          >
            {Array.from({ length: Math.ceil(footerImages.length / 3) }).map(
              (_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex-shrink-0 w-full flex justify-center gap-4 px-4"
                >
                  {footerImages
                    .slice(pageIndex * 3, pageIndex * 3 + 3)
                    .map((img, i) => (
                      <div
                        key={i}
                        className="w-1/3 aspect-[2/1] rounded-2xl shadow-lg overflow-hidden"
                      >
                        <img
                          src={`/images/${img}`}
                          alt={`Produktvorschau ${i + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                        />
                      </div>
                    ))}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="py-16 px-6 text-center bg-gray-50 dark:bg-gray-800"
      >
        <h2 className="text-3xl font-bold mb-4">
          Du hast Fragen zu unseren Möbeln?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Unser Team hilft dir gerne weiter – persönlich, schnell & kostenlos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <a
            href="tel:+49123456789"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition"
          >
            <Phone size={20} /> Anrufen
          </a>
          <a
            href="mailto:kontakt@moebelstyle.de"
            className="bg-white border border-green-700 text-green-700 hover:bg-green-50 px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition"
          >
            <Mail size={20} /> E-Mail senden
          </a>
        </div>
      </section>

      <footer className="bg-green-700 text-white py-4 px-6 text-center text-sm">
        © {new Date().getFullYear()} MöbelStyle GmbH. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}
