"use client";

import { useState } from "react";

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const price = 3650;
  const total = price * quantity;

  const whatsappNumber = "94788809678";

  const orderMessage = encodeURIComponent(
    `Hello DARKY T,

I want to order:

Product: Artan Morgan01-RDR 2
Size: ${selectedSize}
Quantity: ${quantity}
Total: Rs. ${total.toLocaleString()}`
  );

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b px-6 py-5 md:px-12">
        <a
          href="/"
          className="text-2xl font-black tracking-[0.3em]"
        >
          DARKY T
        </a>

        <a
          href="/"
          className="text-sm font-semibold hover:text-gray-500"
        >
          BACK TO HOME
        </a>
      </nav>

      {/* Product Details */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-2 md:px-12">
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-100">
          <img
            src="/images/TSHIRT1.jpg"
            alt="Essential Black Tee"
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            DARKY T COLLECTION
          </p>

          <h1 className="mt- text-4xl font-black md:text-5xl">
            Arthur Morgan01-RDR 2
          </h1>

          <p className="mt-4 text-2xl font-bold">
            Rs. 3,650
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            Premium oversized T-shirt made with 240 GSM heavy cotton.
            Designed for comfort, durability and a bold streetwear look.
          </p>

          {/* Size Selection */}
          <div className="mt-8">
            <p className="mb-3 font-bold">
              SELECT SIZE
            </p>

            <div className="flex flex-wrap gap-3">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-12 w-12 border font-bold transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-8">
            <p className="mb-3 font-bold">
              QUANTITY
            </p>

            <div className="flex w-fit items-center border border-gray-300">
              <button
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                className="h-12 w-12 text-xl hover:bg-gray-100"
              >
                −
              </button>

              <span className="flex h-12 w-12 items-center justify-center font-bold">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((current) => current + 1)}
                className="h-12 w-12 text-xl hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-8 flex justify-between border-y py-5">
            <span className="font-bold">
              TOTAL
            </span>

            <span className="text-xl font-black">
              Rs. {total.toLocaleString()}
            </span>
          </div>

          {/* WhatsApp Order */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${orderMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 bg-black px-8 py-4 text-center font-bold text-white transition hover:bg-gray-800"
          >
            ORDER ON WHATSAPP
          </a>

          {/* Product Features */}
          <div className="mt-8 space-y-3 border-t pt-6 text-sm text-gray-600">
            <p>✓ 240 GSM heavy cotton</p>
            <p>✓ Premium oversized fit</p>
            <p>✓ High-quality print and finishing</p>
            <p>✓ Islandwide delivery</p>
          </div>
        </div>
      </section>
    </main>
  );
}