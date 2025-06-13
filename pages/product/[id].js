"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Küchenschrank Classic",
    description: "Geräumiger Hängeschrank mit Soft-Close-Türen in Weiß matt.",
    price: 199,
    rating: 4,
    image: "/images/kuche1.jpg",
  },
  {
    id: 2,
    title: "Esszimmertisch Eiche",
    description: "Massivholz-Tisch für bis zu 6 Personen, geölt und langlebig.",
    price: 449,
    rating: 5,
    image: "/images/tisch1.jpg",
  },
  {
    id: 3,
    title: "Stuhlset ModernLine (2 Stück)",
    description: "Komfortable Polsterstühle im 2er-Set mit Metallbeinen.",
    price: 129,
    rating: 3,
    image: "/images/stuhl1.jpg",
  },
];

export default function ProduktDetailPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const id = parseInt(router.query.id);
      const found = products.find((p) => p.id === id);
      setProduct(found);
    }
  }, [router.isReady, router.query.id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white">
        <p className="text-lg">🔍 Lade Produktdetails...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
          {product.title}
        </h1>

        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded mb-4">
            Kein Bild verfügbar
          </div>
        )}

        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={
                star <= product.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-400"
              }
            />
          ))}
        </div>

        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {product.description}
        </p>

        <p className="text-xl font-bold text-green-700 dark:text-green-400 mb-6">
          Preis: {product.price.toFixed(2)} €
        </p>

        <button
          onClick={() =>
            alert(`${product.title} wurde zum Warenkorb hinzugefügt.`)
          }
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-full font-semibold transition"
        >
          🛒 In den Warenkorb
        </button>
      </div>
    </div>
  );
}
