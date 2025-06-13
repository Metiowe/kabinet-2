"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, ShoppingCart, Trash2 } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Küchenschrank Classic",
    description: "Geräumiger Hängeschrank mit Soft-Close-Türen in Weiß matt.",
    price: 199,
    rating: 4,
    image: "/images/slider1.jpg",
  },
  {
    id: 2,
    title: "Esszimmertisch Eiche",
    description: "Massivholz-Tisch für bis zu 6 Personen, geölt und langlebig.",
    price: 449,
    rating: 5,
    image: "/images/slider2.jpg",
  },
  {
    id: 3,
    title: "Stuhlset ModernLine (2 Stück)",
    description: "Komfortable Polsterstühle mit Metallbeinen in Schwarz.",
    price: 129,
    rating: 3,
    image: "/images/slider3.jpg",
  },
];

export default function ProduktePage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(null);

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setShowSuccess(product.title);
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item, i) => i !== id);
    setCart(updatedCart);
    if (updatedCart.length === 0) setShowCart(false);
  };

  const handleCheckout = () => {
    alert("Vielen Dank für Ihren Einkauf!");
    setCart([]);
    setShowCart(false);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-6 pb-20 relative">
      <div className="fixed top-6 right-6 z-50">
        <div
          onClick={() => setShowCart(!showCart)}
          className="cursor-pointer flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow"
        >
          <ShoppingCart
            className="text-green-600 dark:text-green-400"
            size={20}
          />
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">
            {cart.length} im Warenkorb
          </span>
        </div>

        {showCart && cart.length > 0 && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-72">
            <ul className="mb-2 space-y-2">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm text-gray-800 dark:text-white"
                >
                  <span>{item.title}</span>
                  <div className="flex items-center gap-2">
                    <span>{item.price.toFixed(2)} €</span>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-sm font-bold text-green-700 dark:text-green-300 border-t pt-2">
              Gesamt: {totalPrice.toFixed(2)} €
            </div>
            <button
              onClick={handleCheckout}
              className="mt-2 w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-full text-sm font-semibold"
            >
              Jetzt kaufen
            </button>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition duration-500 z-50">
          ✔️ {`"${showSuccess}"`} wurde dem Warenkorb hinzugefügt
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4 text-green-700 dark:text-green-400">
        🛋️ Möbel kaufen
      </h1>

      <input
        type="text"
        placeholder="🔍 Suche nach Produkten..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition"
            >
              <Image
                src={product.image || "/images/default.jpg"}
                alt={product.title}
                width={400}
                height={240}
                className="w-full h-60 object-cover"
              />
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold text-base cursor-pointer hover:underline"
                    >
                      🛒 {product.price.toFixed(2)} €
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {product.description}
                  </p>
                  <div className="flex items-center mt-2 gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= product.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Keine Produkte gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
