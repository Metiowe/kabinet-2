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
} from "lucide-react";

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

const neueProdukte = [
  {
    title: "Sideboard Loft",
    image: "/images/slider2.jpg",
  },
  {
    title: "Schreibtisch Smart",
    image: "/images/slider3.jpg",
  },
  {
    title: "Küchentisch Urban",
    image: "/images/slider1.jpg",
  },
];

export default function HomePage() {
  const sliderRef = useRef(null);
  const footerSliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [footerPage, setFooterPage] = useState(0);
  const [neuIndex, setNeuIndex] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setNeuIndex((prev) => (prev + 1) % neueProdukte.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () =>
    setIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  const goToNext = () => setIndex((prev) => (prev + 1) % sliderImages.length);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700 dark:text-green-400">
          MöbelStyle
        </h1>
        <nav className="space-x-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
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
        </nav>
      </header>

      <div className="h-16" />

      <div className="px-6 pt-8 pb-4">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
          🆕 Neuigkeiten
        </h2>
        <div className="overflow-hidden w-full rounded-lg shadow-md">
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${neuIndex * 100}%)` }}
          >
            {neueProdukte.map((item, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 bg-white dark:bg-gray-800 flex items-center gap-4 p-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-20 object-cover rounded-md shadow"
                />
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="text-center py-12 px-4 bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
          Moderne Möbel für dein Zuhause
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
          Entdecke stilvolle Möbelstücke für Wohnzimmer, Küche und Büro.
          Nachhaltig. Zeitlos. Hochwertig.
        </p>
      </section>

      <footer className="bg-green-700 text-white py-4 px-6 text-center text-sm">
        © {new Date().getFullYear()} MöbelStyle GmbH. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}
