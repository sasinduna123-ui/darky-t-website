"use client";

import { useEffect, useState } from "react";

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

    return () => {
      window.removeEventListener("focus", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6 md:px-12">
        <a
          href="#home"
          className="text-lg font-black tracking-[0.18em] sm:text-2xl sm:tracking-[0.25em] md:text-3xl"
        >
          DARKY T
        </a>

        <div className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          <a href="#home" className="transition hover:text-gray-400">
            HOME
          </a>

          <a href="#shop" className="transition hover:text-gray-400">
            SHOP
          </a>

          <a href="#about" className="transition hover:text-gray-400">
            ABOUT
          </a>

          <a href="#contact" className="transition hover:text-gray-400">
            CONTACT
          </a>
        </div>

        <a
          href="#shop"
          className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:scale-105 hover:bg-gray-200 sm:px-6 sm:py-3 sm:text-base"
        >
          SHOP NOW
        </a>
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

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {/* Black Product */}
            <div>
              <a href="/product" className="block overflow-hidden">
                <img
                  src="/images/TSHIRT1.jpg"
                  alt="Essential Black Tee"
                  className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                />
              </a>

              <a href="/product">
                <h3 className="mt-5 text-xl font-black hover:underline">
                  Essential Black Tee
                </h3>
              </a>

              <p className="mt-2 text-lg font-semibold text-gray-700">
                Rs. 3,650
              </p>

              <a
                href="/product"
                className="mt-4 block w-full bg-black px-5 py-3 text-center font-black text-white transition hover:bg-gray-800"
              >
                VIEW PRODUCT
              </a>
            </div>

            {/* White Product */}
            <div>
              <a href="/product/white" className="block overflow-hidden">
                <img
                  src="/images/TSHIRT2.jpg"
                  alt="Heavy Cotton White Tee"
                  className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                />
              </a>

              <a href="/product/white">
                <h3 className="mt-5 text-xl font-black hover:underline">
                  Heavy Cotton White Tee
                </h3>
              </a>

              <p className="mt-2 text-lg font-semibold text-gray-700">
                Rs. 3,650
              </p>

              <a
                href="/product/white"
                className="mt-4 block w-full bg-black px-5 py-3 text-center font-black text-white transition hover:bg-gray-800"
              >
                VIEW PRODUCT
              </a>
            </div>

            {/* Grey Product */}
            <div>
              <a href="/product/grey" className="block overflow-hidden">
                <img
                  src="/images/TSHIRT3.jpg"
                  alt="Dark Grey Oversized Tee"
                  className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                />
              </a>

              <a href="/product/grey">
                <h3 className="mt-5 text-xl font-black hover:underline">
                  Dark Grey Oversized Tee
                </h3>
              </a>

              <p className="mt-2 text-lg font-semibold text-gray-700">
                Rs. 3,650
              </p>

              <a
                href="/product/grey"
                className="mt-4 block w-full bg-black px-5 py-3 text-center font-black text-white transition hover:bg-gray-800"
              >
                VIEW PRODUCT
              </a>
            </div>
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
              DARKY T is a premium streetwear clothing brand focused on
              oversized T-shirts, comfort and bold designs.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">240 GSM</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Heavy cotton fabric
                </p>
              </div>

              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">OVERSIZED</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Premium relaxed fit
                </p>
              </div>

              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">PREMIUM</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Quality print and finish
                </p>
              </div>

              <div className="border border-white/20 p-5">
                <h3 className="text-xl font-black">ISLANDWIDE</h3>
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
            Select a product, choose the size and quantity, add it to the cart,
            and complete the order through WhatsApp checkout.
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