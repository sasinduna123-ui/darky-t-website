"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

import CartCount from "@/app/components/CartCount";
import SizeGuide from "@/app/components/SizeGuide";
import { getProductBySlug } from "@/app/data/products";

type CartItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

const productSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;

type ProductSize = (typeof productSizes)[number];

export default function DynamicProductPage() {
  const params = useParams();
  const slug = String(params.slug);

  const foundProduct = getProductBySlug(slug);

  const [selectedSize, setSelectedSize] =
    useState<ProductSize>("M");

  const [quantity, setQuantity] = useState(1);

  if (!foundProduct) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <div>
          <h1 className="text-4xl font-black">
            PRODUCT NOT FOUND
          </h1>

          <p className="mt-4 text-gray-600">
            මේ product එක හොයාගන්න බැහැ.
          </p>

          <a
            href="/#shop"
            className="mt-8 inline-block bg-black px-8 py-4 font-bold text-white transition hover:bg-gray-800"
          >
            BACK TO SHOP
          </a>
        </div>
      </main>
    );
  }

  const product = foundProduct;

  const selectedStock =
    product.stock[selectedSize] ?? 0;

  const isOutOfStock = selectedStock === 0;
  const total = product.price * quantity;

  function addToCart() {
    if (isOutOfStock) return;

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      size: selectedSize,
      price: product.price,
      quantity,
    };

    try {
      const savedCart =
        localStorage.getItem("darky-cart");

      const cart: CartItem[] = savedCart
        ? JSON.parse(savedCart)
        : [];

      const existingIndex = cart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size
      );

      if (existingIndex >= 0) {
        cart[existingIndex].quantity = Math.min(
          selectedStock,
          cart[existingIndex].quantity + quantity
        );
      } else {
        cart.push(newItem);
      }

      localStorage.setItem(
        "darky-cart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event("darky-cart-updated")
      );

      alert("Product added to cart!");
    } catch {
      alert("Could not add product to cart.");
    }
  }

  function directOrder() {
    if (isOutOfStock) return;

    const directOrderItem: CartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      size: selectedSize,
      price: product.price,
      quantity,
    };

    try {
      localStorage.setItem(
        "darky-direct-order",
        JSON.stringify(directOrderItem)
      );

      window.location.href = "/direct-order";
    } catch {
      alert(
        "Could not continue to delivery details."
      );
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b px-4 py-5 sm:px-6 md:px-12">
        <a
          href="/"
          className="text-xl font-black tracking-[0.2em] sm:text-2xl sm:tracking-[0.3em]"
        >
          DARKY T
        </a>

        <div className="flex items-center gap-4 sm:gap-5">
          <CartCount />

          <a
            href="/"
            className="whitespace-nowrap text-xs font-semibold hover:text-gray-500 sm:text-sm"
          >
            BACK TO HOME
          </a>
        </div>
      </nav>

      {/* Product Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-2 md:px-12">
        {/* Product Image */}
        <div className="overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            DARKY T COLLECTION
          </p>

          <h1 className="mt-4 text-4xl font-black uppercase md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold">
            Rs. {product.price.toLocaleString()}
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-bold">
                SELECT SIZE
              </p>

              {product.productType === "tshirt" ? (
                <SizeGuide
                  productType="tshirt"
                  sizeGuide={product.sizeGuide}
                />
              ) : (
                <SizeGuide
                  productType="pants"
                  sizeGuide={product.sizeGuide}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {productSizes.map((size) => {
                const stock =
                  product.stock[size] ?? 0;

                const soldOut = stock === 0;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={soldOut}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }}
                    className={`min-w-14 border px-3 py-3 font-bold transition ${
                      soldOut
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                        : selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            <p
              className={`mt-3 text-sm font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {isOutOfStock
                ? "OUT OF STOCK"
                : `Only ${selectedStock} left in stock`}
            </p>
          </div>

          {/* Quantity */}
          <div className="mt-8">
            <p className="mb-3 font-bold">
              QUANTITY
            </p>

            <div className="flex w-fit items-center border border-gray-300">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1)
                  )
                }
                className="h-12 w-12 text-xl hover:bg-gray-100"
              >
                −
              </button>

              <span className="flex h-12 w-12 items-center justify-center font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(
                      selectedStock,
                      current + 1
                    )
                  )
                }
                disabled={quantity >= selectedStock}
                className={`h-12 w-12 text-xl ${
                  quantity >= selectedStock
                    ? "cursor-not-allowed text-gray-300"
                    : "hover:bg-gray-100"
                }`}
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

          {/* Add To Cart */}
          <button
            type="button"
            onClick={addToCart}
            disabled={isOutOfStock}
            className={`mt-8 w-full px-8 py-4 text-center font-bold transition ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isOutOfStock
              ? "OUT OF STOCK"
              : "ADD TO CART"}
          </button>

          {/* Direct Order */}
          <button
            type="button"
            onClick={directOrder}
            disabled={isOutOfStock}
            className={`mt-4 flex w-full items-center justify-center gap-3 px-8 py-4 text-center font-bold text-white transition ${
              isOutOfStock
                ? "cursor-not-allowed bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {!isOutOfStock && (
              <FaWhatsapp className="text-2xl" />
            )}

            <span>
              {isOutOfStock
                ? "OUT OF STOCK"
                : "ORDER WITH DELIVERY DETAILS"}
            </span>
          </button>

          {/* Product Features */}
          <div className="mt-8 space-y-3 border-t pt-6 text-sm text-gray-600">
            {product.features?.map(
              (feature, index) => (
                <p key={`${feature}-${index}`}>
                  ✓ {feature}
                </p>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}