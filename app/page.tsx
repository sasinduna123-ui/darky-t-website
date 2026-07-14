"use client";

import { useEffect, useState } from "react";
import { products } from "@/app/data/products";

type CartItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  function updateCartCount() {
    try {
      const savedCart = localStorage.getItem("darky-cart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const cart: CartItem[] = JSON.parse(savedCart);

      const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalItems);
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    updateCartCount();

    window.addEventListener("focus", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener(
      "darky-cart-updated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "focus",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );

      window.removeEventListener(
        "darky-cart-updated",
        updateCartCount
      );
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/10 bg-black">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-12">
          <a
            href="#home"
            onClick={closeMenu}
            className="text-lg font-black tracking-[0.18em] sm:text-2xl sm:tracking-[0.25em] md:text-3xl"
          >
            DARKY T
          </a>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 text-sm font-semibold lg:flex">
            <a
              href="#home"
              className="transition hover:text-gray-400"
            >
              HOME
            </a>

            <a
              href="#shop"
              className="transition hover:text-gray-400"
            >
              SHOP
            </a>

            <a
              href="#reviews"
              className="transition hover:text-gray-400"
            >
              REVIEWS
            </a>

            <a
              href="#about"
              className="transition hover:text-gray-400"
            >
              ABOUT
            </a>

            <a
              href="#contact"
              className="transition hover:text-gray-400"
            >
              CONTACT
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/cart"
              className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:scale-105 hover:bg-gray-200 sm:px-5 sm:py-3 sm:text-sm"
            >
              CART ({cartCount})
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-2xl lg:hidden"
              aria-label="Open menu"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute left-0 top-full w-full border-t border-white/10 bg-black px-5 py-6 shadow-2xl lg:hidden">
            <div className="flex flex-col">
              <a
                href="#home"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 font-bold transition hover:text-gray-400"
              >
                HOME
              </a>

              <a
                href="#shop"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 font-bold transition hover:text-gray-400"
              >
                SHOP
              </a>

              <a
                href="#reviews"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 font-bold transition hover:text-gray-400"
              >
                REVIEWS
              </a>

              <a
                href="#about"
                onClick={closeMenu}
                className="border-b border-white/10 py-4 font-bold transition hover:text-gray-400"
              >
                ABOUT
              </a>

              <a
                href="#contact"
                onClick={closeMenu}
                className="py-4 font-bold transition hover:text-gray-400"
              >
                CONTACT
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center px-5 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.78)), url('/images/hero.jpg')",
        }}
      >
        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.3em] text-gray-300 sm:text-sm sm:tracking-[0.4em]">
            PREMIUM STREETWEAR
          </p>

          <h1 className="text-4xl font-black leading-tight sm:text-6xl md:text-8xl">
            PREMIUM
            <br />
            OVERSIZED
            <br />
            T-SHIRTS
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
            Designed for comfort.
            <br />
            Made to stand out.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#shop"
              className="whitespace-nowrap rounded-full bg-white px-7 py-4 text-sm font-black text-black transition hover:scale-105 hover:bg-gray-200 sm:px-8 sm:text-base"
            >
              SHOP NOW
            </a>

            <a
              href="/cart"
              className="whitespace-nowrap rounded-full border-2 border-white px-7 py-4 text-sm font-black text-white transition hover:bg-white hover:text-black sm:px-8 sm:text-base"
            >
              VIEW CART ({cartCount})
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="shop"
        className="bg-white px-6 py-20 text-black md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            NEW COLLECTION
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            BEST SELLERS
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id}>
                <a
                  href={`/product/${product.slug}`}
                  className="block overflow-hidden bg-gray-100"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                  />
                </a>

                <a href={`/product/${product.slug}`}>
                  <h3 className="mt-5 text-xl font-black hover:underline">
                    {product.name}
                  </h3>
                </a>

                <p className="mt-2 text-lg font-semibold text-gray-700">
                  Rs. {product.price.toLocaleString()}
                </p>

                <a
                  href={`/product/${product.slug}`}
                  className="mt-4 block w-full bg-black px-5 py-3 text-center font-black text-white transition hover:bg-gray-800"
                >
                  VIEW PRODUCT
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviews"
        className="bg-gray-100 px-6 py-20 text-black md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
              CUSTOMER REVIEWS
            </p>

            <h2 className="mt-3 text-4xl font-black md:text-5xl">
              WHAT OUR CUSTOMERS SAY
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              DARKY T products ගැන අපේ customersලා කියන අදහස්.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="flex h-full flex-col justify-between bg-white p-7 shadow-sm">
              <div>
                <div className="text-xl tracking-[0.2em]">
                  ★★★★★
                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  “T-shirt එකේ quality එක ගොඩක් හොඳයි.
                  Material එක thick වගේම comfortable.
                  Oversized fit එකත් හරියටම තිබුණා.”
                </p>
              </div>

              <div className="mt-7 border-t pt-5">
                <p className="font-black">
                  KAVINDU
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Verified Customer
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between bg-white p-7 shadow-sm">
              <div>
                <div className="text-xl tracking-[0.2em]">
                  ★★★★★
                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  “White T-shirt එක ලස්සනට තිබුණා.
                  Stitching සහ finishing දෙකම හොඳයි.
                  Delivery එකත් ඉක්මනින් ලැබුණා.”
                </p>
              </div>

              <div className="mt-7 border-t pt-5">
                <p className="font-black">
                  NETHMI
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Verified Customer
                </p>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between bg-white p-7 shadow-sm">
              <div>
                <div className="text-xl tracking-[0.2em]">
                  ★★★★★
                </div>

                <p className="mt-5 leading-7 text-gray-600">
                  “Size guide එකෙන් size එක select කරන්න ලේසි
                  වුණා. Dark grey colour එකත් photo එකේ වගේම
                  තිබුණා.”
                </p>
              </div>

              <div className="mt-7 border-t pt-5">
                <p className="font-black">
                  SACHIN
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Verified Customer
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href="#shop"
              className="inline-block bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
            >
              SHOP NOW
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-black px-6 py-20 text-white md:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm tracking-[0.3em] text-gray-400">
              ABOUT DARKY T
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              MADE TO
              <br />
              STAND OUT.
            </h2>
          </div>

          <div className="space-y-6 text-gray-300">
            <p className="leading-7">
              DARKY T is a premium streetwear clothing
              brand focused on oversized T-shirts,
              comfort and bold designs.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">
                  240 GSM
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Heavy cotton fabric
                </p>
              </div>

              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">
                  OVERSIZED
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Premium relaxed fit
                </p>
              </div>

              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">
                  PREMIUM
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Quality print and finish
                </p>
              </div>

              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">
                  ISLANDWIDE
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Delivery across Sri Lanka
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-white px-6 py-20 text-black md:px-12"
      >
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            CONTACT US
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            READY TO ORDER?
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-600">
            Select a product, choose the size and quantity,
            add it to the cart, and complete the order
            through WhatsApp checkout.
          </p>

          <a
            href="#shop"
            className="mt-8 inline-block whitespace-nowrap rounded-full bg-black px-8 py-4 font-black text-white transition hover:scale-105 hover:bg-gray-800"
          >
            SHOP COLLECTION
          </a>

          <div className="mt-10">
            <a
              href="https://www.tiktok.com/@sasindu_nathee?_r=1&_t=ZS-981NZk7vYkz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black hover:text-gray-500"
            >
              TIKTOK
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-black tracking-[0.35em]">
          DARKY T
        </h2>

        <p className="mt-4 text-sm text-gray-400">
          Premium Oversized Streetwear
        </p>

        <a
          href="#shop"
          className="mt-6 inline-block font-semibold text-gray-400 hover:text-white"
        >
          SHOP
        </a>

        <p className="mt-6 text-xs text-gray-500">
          © 2026 DARKY T. All rights reserved.
        </p>
      </footer>
    </main>
  );
}