"use client";

import {
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

import CartCount from "@/app/components/CartCount";
import SizeGuide from "@/app/components/SizeGuide";
import {
  getProductBySlug,
  productSizes,
  ProductSize,
} from "@/app/data/products";

type CartItem = {
  id: string;
  name: string;
  image: string;

  color: string;
  colorSlug: string;

  size: ProductSize;
  price: number;
  quantity: number;

  // Selected colour + size එකේ උපරිම stock
  maxStock: number;
};

type FeedbackMessage = {
  type: "success" | "warning" | "error";
  text: string;
};

export default function DynamicProductPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";

  const foundProduct =
    getProductBySlug(slug);

  const [selectedVariantIndex, setSelectedVariantIndex] =
    useState(0);

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);

  const [selectedSize, setSelectedSize] =
    useState<ProductSize>("M");

  const [quantity, setQuantity] =
    useState(1);

  const [feedback, setFeedback] =
    useState<FeedbackMessage | null>(null);

  function getFirstAvailableSize(
    stock: Record<ProductSize, number>
  ): ProductSize {
    const availableSize =
      productSizes.find(
        (size) =>
          (stock[size] ?? 0) > 0
      );

    return availableSize ?? "M";
  }

  function showFeedback(
    message: FeedbackMessage
  ) {
    setFeedback(message);

    window.setTimeout(() => {
      setFeedback(null);
    }, 3500);
  }

  useEffect(() => {
    setSelectedVariantIndex(0);
    setSelectedImageIndex(0);
    setQuantity(1);
    setFeedback(null);

    const firstVariant =
      foundProduct?.variants[0];

    if (firstVariant) {
      setSelectedSize(
        getFirstAvailableSize(
          firstVariant.stock
        )
      );
    } else {
      setSelectedSize("M");
    }
  }, [slug, foundProduct]);

  const foundVariant =
    foundProduct?.variants[
      selectedVariantIndex
    ] ??
    foundProduct?.variants[0];

  if (
    !foundProduct ||
    !foundVariant
  ) {
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
  const currentVariant = foundVariant;

  const galleryImages =
    currentVariant.images.length > 0
      ? currentVariant.images
      : [product.image];

  const safeImageIndex =
    selectedImageIndex >= 0 &&
    selectedImageIndex <
      galleryImages.length
      ? selectedImageIndex
      : 0;

  const selectedImage =
    galleryImages[
      safeImageIndex
    ] ?? product.image;

  const selectedStock =
    currentVariant.stock[
      selectedSize
    ] ?? 0;

  const isOutOfStock =
    selectedStock <= 0;

  const isLowStock =
    selectedStock > 0 &&
    selectedStock <= 3;

  const hasReachedStockLimit =
    !isOutOfStock &&
    quantity >= selectedStock;

  const total =
    product.price * quantity;

  function changeVariant(
    index: number
  ) {
    const nextVariant =
      product.variants[index];

    if (!nextVariant) {
      return;
    }

    setSelectedVariantIndex(index);
    setSelectedImageIndex(0);
    setQuantity(1);
    setFeedback(null);

    setSelectedSize(
      getFirstAvailableSize(
        nextVariant.stock
      )
    );
  }

  function changeSize(
    size: ProductSize
  ) {
    const sizeStock =
      currentVariant.stock[size] ?? 0;

    if (sizeStock <= 0) {
      return;
    }

    setSelectedSize(size);
    setQuantity(1);
    setFeedback(null);
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );

    setFeedback(null);
  }

  function increaseQuantity() {
    if (isOutOfStock) {
      showFeedback({
        type: "error",
        text: `${currentVariant.name} - ${selectedSize} size එක sold out.`,
      });

      return;
    }

    if (
      quantity >= selectedStock
    ) {
      showFeedback({
        type: "warning",
        text: `මේ size එකේ stock ${selectedStock}ක් විතරයි තියෙන්නේ.`,
      });

      return;
    }

    setQuantity((current) =>
      Math.min(
        selectedStock,
        current + 1
      )
    );

    setFeedback(null);
  }

  function showPreviousImage() {
    setSelectedImageIndex(
      (currentIndex) => {
        if (
          galleryImages.length <= 1
        ) {
          return 0;
        }

        return currentIndex === 0
          ? galleryImages.length - 1
          : currentIndex - 1;
      }
    );
  }

  function showNextImage() {
    setSelectedImageIndex(
      (currentIndex) => {
        if (
          galleryImages.length <= 1
        ) {
          return 0;
        }

        return currentIndex ===
          galleryImages.length - 1
          ? 0
          : currentIndex + 1;
      }
    );
  }

  function readCart(): CartItem[] {
    try {
      const savedCart =
        localStorage.getItem(
          "darky-cart"
        );

      if (!savedCart) {
        return [];
      }

      const parsedCart =
        JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart;
    } catch {
      return [];
    }
  }

  function addToCart() {
    if (isOutOfStock) {
      showFeedback({
        type: "error",
        text: `${currentVariant.name} - ${selectedSize} size එක sold out.`,
      });

      return;
    }

    const cartImage =
      currentVariant.images[0] ||
      product.image;

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      image: cartImage,

      color:
        currentVariant.name,

      colorSlug:
        currentVariant.slug,

      size: selectedSize,
      price: product.price,
      quantity,
      maxStock: selectedStock,
    };

    try {
      const cart = readCart();

      const existingIndex =
        cart.findIndex(
          (item) =>
            item.id ===
              newItem.id &&
            item.colorSlug ===
              newItem.colorSlug &&
            item.size ===
              newItem.size
        );

      if (existingIndex >= 0) {
        const existingItem =
          cart[existingIndex];

        const existingQuantity =
          Number(
            existingItem.quantity
          ) || 0;

        const remainingStock =
          selectedStock -
          existingQuantity;

        if (
          remainingStock <= 0
        ) {
          showFeedback({
            type: "warning",
            text: `${product.name} - ${currentVariant.name} - ${selectedSize} size එකේ available stock සියල්ල දැනටමත් cart එකේ තියෙනවා.`,
          });

          return;
        }

        const quantityToAdd =
          Math.min(
            quantity,
            remainingStock
          );

        cart[existingIndex] = {
          ...existingItem,

          image: cartImage,

          color:
            currentVariant.name,

          colorSlug:
            currentVariant.slug,

          size: selectedSize,
          price: product.price,

          quantity:
            existingQuantity +
            quantityToAdd,

          maxStock:
            selectedStock,
        };

        localStorage.setItem(
          "darky-cart",
          JSON.stringify(cart)
        );

        window.dispatchEvent(
          new Event(
            "darky-cart-updated"
          )
        );

        if (
          quantityToAdd <
          quantity
        ) {
          showFeedback({
            type: "warning",
            text: `Stock limit එක නිසා ${quantityToAdd}ක් විතරක් cart එකට add වුණා.`,
          });
        } else {
          showFeedback({
            type: "success",
            text: `${product.name} - ${currentVariant.name} - ${selectedSize} cart quantity එක update කළා.`,
          });
        }

        return;
      }

      cart.push(newItem);

      localStorage.setItem(
        "darky-cart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event(
          "darky-cart-updated"
        )
      );

      showFeedback({
        type: "success",
        text: `${product.name} - ${currentVariant.name} - ${selectedSize} cart එකට add කළා.`,
      });
    } catch {
      showFeedback({
        type: "error",
        text: "Product එක cart එකට add කරන්න බැරි වුණා.",
      });
    }
  }

  function directOrder() {
    if (isOutOfStock) {
      showFeedback({
        type: "error",
        text: `${currentVariant.name} - ${selectedSize} size එක sold out.`,
      });

      return;
    }

    const orderImage =
      currentVariant.images[0] ||
      product.image;

    const directOrderItem: CartItem =
      {
        id: product.id,
        name: product.name,
        image: orderImage,

        color:
          currentVariant.name,

        colorSlug:
          currentVariant.slug,

        size: selectedSize,
        price: product.price,
        quantity,
        maxStock: selectedStock,
      };

    try {
      localStorage.setItem(
        "darky-direct-order",
        JSON.stringify(
          directOrderItem
        )
      );

      window.location.href =
        "/direct-order";
    } catch {
      showFeedback({
        type: "error",
        text: "Delivery details page එකට යන්න බැරි වුණා.",
      });
    }
  }

  function getStockMessage() {
    if (isOutOfStock) {
      return `${currentVariant.name} - ${selectedSize} OUT OF STOCK`;
    }

    if (selectedStock === 1) {
      return `Only 1 item left in stock`;
    }

    if (isLowStock) {
      return `Only ${selectedStock} items left in stock`;
    }

    return `${selectedStock} items available`;
  }

  return (
    <main className="min-h-screen bg-white pb-28 text-black md:pb-0">
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

      {/* Feedback Message */}
      {feedback && (
        <div className="fixed left-1/2 top-5 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <div
            className={`border px-5 py-4 text-center text-sm font-bold shadow-xl ${
              feedback.type ===
              "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : feedback.type ===
                    "warning"
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {feedback.text}
          </div>
        </div>
      )}

      {/* Product Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-10 sm:px-6 md:grid-cols-2 md:px-12 md:py-12">
        {/* Product Gallery */}
        <div>
          {/* Main Image */}
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src={selectedImage}
              alt={`${product.name} ${currentVariant.name}`}
              className="aspect-square w-full object-cover"
            />

            {isOutOfStock && (
              <div className="absolute left-4 top-4 bg-red-600 px-4 py-2 text-sm font-black text-white">
                SOLD OUT
              </div>
            )}

            {!isOutOfStock &&
              isLowStock && (
                <div className="absolute left-4 top-4 bg-black px-4 py-2 text-sm font-black text-white">
                  ONLY {selectedStock} LEFT
                </div>
              )}

            {galleryImages.length >
              1 && (
              <>
                <button
                  type="button"
                  onClick={
                    showPreviousImage
                  }
                  aria-label="Previous product image"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-2xl font-bold shadow-md transition hover:bg-black hover:text-white"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={
                    showNextImage
                  }
                  aria-label="Next product image"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-2xl font-bold shadow-md transition hover:bg-black hover:text-white"
                >
                  ›
                </button>

                <div className="absolute bottom-3 right-3 bg-black/75 px-3 py-2 text-xs font-bold text-white">
                  {safeImageIndex + 1}{" "}
                  /{" "}
                  {
                    galleryImages.length
                  }
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {galleryImages.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {galleryImages.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex(
                        index
                      )
                    }
                    aria-label={`Show product image ${
                      index + 1
                    }`}
                    className={`overflow-hidden border-2 bg-gray-100 transition ${
                      safeImageIndex ===
                      index
                        ? "border-black"
                        : "border-transparent hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${
                        index + 1
                      }`}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
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
            Rs.{" "}
            {product.price.toLocaleString()}
          </p>

          {product.description && (
            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>
          )}

          {/* Colour Selection */}
          <div className="mt-8">
            <p className="font-bold">
              SELECT COLOUR
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Selected:{" "}
              <span className="font-bold text-black">
                {currentVariant.name}
              </span>
            </p>

            <div className="mt-4 flex flex-wrap gap-4">
              {product.variants.map(
                (variant, index) => {
                  const isSelected =
                    index ===
                    selectedVariantIndex;

                  const totalVariantStock =
                    Object.values(
                      variant.stock
                    ).reduce(
                      (
                        sum,
                        stockAmount
                      ) =>
                        sum +
                        stockAmount,
                      0
                    );

                  const variantOutOfStock =
                    totalVariantStock ===
                    0;

                  return (
                    <button
                      key={`${variant.slug}-${index}`}
                      type="button"
                      onClick={() =>
                        changeVariant(
                          index
                        )
                      }
                      className="group flex flex-col items-center gap-2"
                      aria-label={`Select ${variant.name}`}
                    >
                      <span
                        className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                          isSelected
                            ? "border-black"
                            : "border-gray-300 group-hover:border-gray-600"
                        }`}
                      >
                        <span
                          className="h-9 w-9 rounded-full border border-gray-300"
                          style={{
                            backgroundColor:
                              variant.hex,
                          }}
                        />

                        {variantOutOfStock && (
                          <span className="absolute h-px w-10 rotate-45 bg-red-600" />
                        )}
                      </span>

                      <span
                        className={`max-w-20 text-center text-xs ${
                          isSelected
                            ? "font-black text-black"
                            : "font-semibold text-gray-500"
                        }`}
                      >
                        {variant.name}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-bold">
                SELECT SIZE
              </p>

              {product.productType ===
              "tshirt" ? (
                <SizeGuide
                  productType="tshirt"
                  sizeGuide={
                    product.sizeGuide
                  }
                />
              ) : (
                <SizeGuide
                  productType="pants"
                  sizeGuide={
                    product.sizeGuide
                  }
                />
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {productSizes.map(
                (size) => {
                  const stock =
                    currentVariant
                      .stock[size] ??
                    0;

                  const soldOut =
                    stock <= 0;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={soldOut}
                      onClick={() =>
                        changeSize(size)
                      }
                      className={`relative min-w-14 border px-3 py-3 font-bold transition ${
                        soldOut
                          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                          : selectedSize ===
                              size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}

                      {!soldOut &&
                        stock <= 3 && (
                          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                            {stock}
                          </span>
                        )}
                    </button>
                  );
                }
              )}
            </div>

            <p
              className={`mt-4 text-sm font-bold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                    ? "text-orange-600"
                    : "text-green-600"
              }`}
            >
              {getStockMessage()}
            </p>
          </div>

          {/* Quantity */}
          <div className="mt-8">
            <p className="mb-3 font-bold">
              QUANTITY
            </p>

            <div className="flex items-center gap-4">
              <div className="flex w-fit items-center border border-gray-300">
                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  disabled={
                    quantity <= 1
                  }
                  className={`h-12 w-12 text-xl ${
                    quantity <= 1
                      ? "cursor-not-allowed text-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  −
                </button>

                <span className="flex h-12 min-w-12 items-center justify-center font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  disabled={
                    isOutOfStock ||
                    hasReachedStockLimit
                  }
                  className={`h-12 w-12 text-xl ${
                    isOutOfStock ||
                    hasReachedStockLimit
                      ? "cursor-not-allowed text-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  +
                </button>
              </div>

              {!isOutOfStock &&
                hasReachedStockLimit && (
                  <p className="text-sm font-bold text-orange-600">
                    Maximum stock
                    reached
                  </p>
                )}
            </div>
          </div>

          {/* Total */}
          <div className="mt-8 flex justify-between border-y py-5">
            <span className="font-bold">
              TOTAL
            </span>

            <span className="text-xl font-black">
              Rs.{" "}
              {total.toLocaleString()}
            </span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:block">
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
          </div>

          {/* Product Features */}
          <div className="mt-8 space-y-3 border-t pt-6 text-sm text-gray-600">
            {product.features.map(
              (feature, index) => (
                <p
                  key={`${feature}-${index}`}
                >
                  ✓ {feature}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {/* Mobile Sticky Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-3 shadow-[0_-5px_20px_rgba(0,0,0,0.12)] md:hidden">
        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed bg-gray-300 px-5 py-4 font-black text-gray-500"
          >
            OUT OF STOCK
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={addToCart}
              className="bg-black px-4 py-4 text-sm font-black text-white"
            >
              ADD TO CART
            </button>

            <button
              type="button"
              onClick={directOrder}
              className="flex items-center justify-center gap-2 bg-green-600 px-4 py-4 text-sm font-black text-white"
            >
              <FaWhatsapp className="text-xl" />
              BUY NOW
            </button>
          </div>
        )}
      </div>
    </main>
  );
}