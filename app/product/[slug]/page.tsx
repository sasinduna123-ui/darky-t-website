"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  FaWhatsapp,
} from "react-icons/fa";

import CartCount from "@/app/components/CartCount";
import SizeGuide from "@/app/components/SizeGuide";

import {
  fetchProductsFromSupabase,
} from "@/app/data/supabase-products";

import type {
  Product,
  ProductSize,
} from "@/app/data/products";

const productSizes: ProductSize[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

type CartItem = {
  id: string;
  name: string;
  image: string;

  color: string;
  colorSlug: string;

  size: string;
  price: number;
  quantity: number;

  maxStock: number;
};

export default function DynamicProductPage() {
  const params = useParams();

  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";

  const [
    product,
    setProduct,
  ] = useState<Product | null>(
    null
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  const [
    selectedVariantIndex,
    setSelectedVariantIndex,
  ] = useState(0);

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState(0);

  const [
    selectedSize,
    setSelectedSize,
  ] =
    useState<ProductSize>("M");

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    cartMessage,
    setCartMessage,
  ] = useState("");

  async function loadProduct() {
    if (!slug) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");

    try {
      const databaseProducts =
        await fetchProductsFromSupabase();

      const foundProduct =
        databaseProducts.find(
          (currentProduct) =>
            currentProduct.slug ===
            slug
        );

      setProduct(
        foundProduct ?? null
      );
    } catch (error) {
      console.error(
        "Product load error:",
        error
      );

      setProduct(null);

      setLoadError(
        "Product එක database එකෙන් load කරන්න බැරි වුණා."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();

    setSelectedVariantIndex(0);
    setSelectedImageIndex(0);
    setSelectedSize("M");
    setQuantity(1);
    setCartMessage("");
  }, [slug]);

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setCartMessage("");
      }, 3500);

    return () =>
      window.clearTimeout(timer);
  }, [cartMessage]);

  const currentVariant =
    product?.variants[
      selectedVariantIndex
    ] ??
    product?.variants[0];

  const galleryImages =
    currentVariant &&
    currentVariant.images.length >
      0
      ? currentVariant.images
      : product
        ? [product.image]
        : [];

  const safeImageIndex =
    selectedImageIndex >= 0 &&
    selectedImageIndex <
      galleryImages.length
      ? selectedImageIndex
      : 0;

  const selectedImage =
    galleryImages[
      safeImageIndex
    ] ??
    product?.image ??
    "/images/product-image.jpg";

  const selectedStock =
    currentVariant
      ? Number(
          currentVariant.stock[
            selectedSize
          ] ?? 0
        )
      : 0;

  const isOutOfStock =
    selectedStock <= 0;

  const isLowStock =
    selectedStock > 0 &&
    selectedStock <= 3;

  const total =
    product
      ? product.price * quantity
      : 0;

  function getFirstAvailableSize(
    variantIndex: number
  ): ProductSize {
    if (!product) {
      return "M";
    }

    const variant =
      product.variants[
        variantIndex
      ];

    if (!variant) {
      return "M";
    }

    return (
      productSizes.find(
        (size) =>
          Number(
            variant.stock[size] ??
              0
          ) > 0
      ) ?? "M"
    );
  }

  function changeVariant(
    index: number
  ) {
    const nextSize =
      getFirstAvailableSize(index);

    setSelectedVariantIndex(
      index
    );

    setSelectedImageIndex(0);
    setSelectedSize(nextSize);
    setQuantity(1);
    setCartMessage("");
  }

  function changeSize(
    size: ProductSize
  ) {
    if (!currentVariant) {
      return;
    }

    const sizeStock =
      Number(
        currentVariant.stock[
          size
        ] ?? 0
      );

    if (sizeStock <= 0) {
      return;
    }

    setSelectedSize(size);
    setQuantity(1);
    setCartMessage("");
  }

  function showPreviousImage() {
    setSelectedImageIndex(
      (currentIndex) => {
        if (
          galleryImages.length <=
          1
        ) {
          return 0;
        }

        return currentIndex === 0
          ? galleryImages.length -
              1
          : currentIndex - 1;
      }
    );
  }

  function showNextImage() {
    setSelectedImageIndex(
      (currentIndex) => {
        if (
          galleryImages.length <=
          1
        ) {
          return 0;
        }

        return currentIndex ===
          galleryImages.length -
            1
          ? 0
          : currentIndex + 1;
      }
    );
  }

  function increaseQuantity() {
    if (
      isOutOfStock ||
      quantity >= selectedStock
    ) {
      setCartMessage(
        `Maximum stock එක ${selectedStock}යි.`
      );

      return;
    }

    setQuantity(
      (current) =>
        current + 1
    );
  }

  function decreaseQuantity() {
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  }

  function addToCart() {
    if (
      !product ||
      !currentVariant ||
      isOutOfStock
    ) {
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
      const savedCart =
        localStorage.getItem(
          "darky-cart"
        );

      const parsedCart =
        savedCart
          ? JSON.parse(
              savedCart
            )
          : [];

      const cart: CartItem[] =
        Array.isArray(
          parsedCart
        )
          ? parsedCart
          : [];

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

      if (
        existingIndex >= 0
      ) {
        const existingItem =
          cart[
            existingIndex
          ];

        const existingQuantity =
          Number(
            existingItem.quantity
          ) || 0;

        const updatedQuantity =
          Math.min(
            selectedStock,
            existingQuantity +
              quantity
          );

        cart[
          existingIndex
        ] = {
          ...existingItem,
          ...newItem,
          quantity:
            updatedQuantity,
          maxStock:
            selectedStock,
        };

        if (
          existingQuantity +
            quantity >
          selectedStock
        ) {
          setCartMessage(
            `${product.name} cart quantity stock limit එක ${selectedStock}ට සීමා කළා.`
          );
        } else {
          setCartMessage(
            `${product.name} cart quantity update කළා.`
          );
        }
      } else {
        cart.push(newItem);

        setCartMessage(
          `${product.name} - ${currentVariant.name} cart එකට add කළා.`
        );
      }

      localStorage.setItem(
        "darky-cart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event(
          "darky-cart-updated"
        )
      );
    } catch {
      setCartMessage(
        "Product එක cart එකට add කරන්න බැරි වුණා."
      );
    }
  }

  function directOrder() {
    if (
      !product ||
      !currentVariant ||
      isOutOfStock
    ) {
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
        maxStock:
          selectedStock,
      };

    try {
      localStorage.setItem(
        "darky-direct-order",
        JSON.stringify(
          directOrderItem
        )
      );

      localStorage.removeItem(
        "darky-direct-order-id"
      );

      window.location.href =
        "/direct-order";
    } catch {
      setCartMessage(
        "Delivery details page එකට යන්න බැරි වුණා."
      );
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <div>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <h1 className="mt-6 text-3xl font-black">
            LOADING PRODUCT
          </h1>

          <p className="mt-3 text-gray-600">
            Supabase database එකෙන් product එක load කරනවා...
          </p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black text-red-600">
            PRODUCT LOAD ERROR
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            {loadError}
          </p>

          <button
            type="button"
            onClick={loadProduct}
            className="mt-8 bg-black px-8 py-4 font-bold text-white transition hover:bg-gray-800"
          >
            TRY AGAIN
          </button>

          <a
            href="/#shop"
            className="mt-4 block font-bold underline underline-offset-4"
          >
            BACK TO SHOP
          </a>
        </div>
      </main>
    );
  }

  if (
    !product ||
    !currentVariant
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <div>
          <h1 className="text-4xl font-black">
            PRODUCT NOT FOUND
          </h1>

          <p className="mt-4 text-gray-600">
            මේ product එක Supabase database එකේ හොයාගන්න බැහැ.
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

  const totalVariantStock =
    Object.values(
      currentVariant.stock
    ).reduce(
      (
        totalStock,
        stockAmount
      ) =>
        totalStock +
        Number(
          stockAmount || 0
        ),
      0
    );

  return (
    <main className="min-h-screen bg-white pb-28 text-black md:pb-0">
      {cartMessage && (
        <div className="fixed left-1/2 top-5 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <div className="border border-black bg-white px-5 py-4 text-center text-sm font-bold shadow-2xl">
            {cartMessage}
          </div>
        </div>
      )}

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
            href="/#shop"
            className="whitespace-nowrap text-xs font-semibold hover:text-gray-500 sm:text-sm"
          >
            BACK TO SHOP
          </a>
        </div>
      </nav>

      {/* Product Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-10 sm:px-6 md:grid-cols-2 md:px-12 md:py-12">
        {/* Product Gallery */}
        <div>
          <div className="relative overflow-hidden bg-gray-100">
            <img
              src={selectedImage}
              alt={`${product.name} ${currentVariant.name}`}
              className="aspect-square w-full object-cover"
            />

            {totalVariantStock <=
              0 && (
              <span className="absolute left-3 top-3 bg-red-600 px-4 py-2 text-xs font-black text-white">
                SOLD OUT
              </span>
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
                  {safeImageIndex +
                    1}{" "}
                  /{" "}
                  {
                    galleryImages.length
                  }
                </div>
              </>
            )}
          </div>

          {galleryImages.length >
            1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {galleryImages.map(
                (
                  image,
                  index
                ) => (
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

          <p className="mt-4 text-xs font-black tracking-[0.18em] text-gray-500">
            {product.productType ===
            "tshirt"
              ? "PREMIUM T-SHIRT"
              : "PREMIUM PANTS"}
          </p>

          <h1 className="mt-2 text-4xl font-black uppercase md:text-5xl">
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
                {
                  currentVariant.name
                }
              </span>
            </p>

            <div className="mt-4 flex flex-wrap gap-4">
              {product.variants.map(
                (
                  variant,
                  index
                ) => {
                  const isSelected =
                    index ===
                    selectedVariantIndex;

                  const variantStock =
                    Object.values(
                      variant.stock
                    ).reduce(
                      (
                        sum,
                        stockAmount
                      ) =>
                        sum +
                        Number(
                          stockAmount ||
                            0
                        ),
                      0
                    );

                  const variantOutOfStock =
                    variantStock <= 0;

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
                        {
                          variant.name
                        }
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
                    Number(
                      currentVariant
                        .stock[
                        size
                      ] ?? 0
                    );

                  const soldOut =
                    stock <= 0;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={
                        soldOut
                      }
                      onClick={() =>
                        changeSize(
                          size
                        )
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
                        stock <=
                          3 && (
                          <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-2 py-1 text-[9px] font-black text-white">
                            {stock}
                          </span>
                        )}
                    </button>
                  );
                }
              )}
            </div>

            <p
              className={`mt-4 text-sm font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                    ? "text-orange-600"
                    : "text-green-600"
              }`}
            >
              {isOutOfStock
                ? `${currentVariant.name} - ${selectedSize} OUT OF STOCK`
                : isLowStock
                  ? `${currentVariant.name} - ${selectedSize}: Only ${selectedStock} left`
                  : `${currentVariant.name} - ${selectedSize}: ${selectedStock} available`}
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

              <span className="flex h-12 w-12 items-center justify-center font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  isOutOfStock ||
                  quantity >=
                    selectedStock
                }
                className={`h-12 w-12 text-xl ${
                  isOutOfStock ||
                  quantity >=
                    selectedStock
                    ? "cursor-not-allowed text-gray-300"
                    : "hover:bg-gray-100"
                }`}
              >
                +
              </button>
            </div>

            {!isOutOfStock &&
              quantity >=
                selectedStock && (
                <p className="mt-3 text-xs font-bold text-orange-600">
                  Maximum stock reached
                </p>
              )}
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
              disabled={
                isOutOfStock
              }
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
              onClick={
                directOrder
              }
              disabled={
                isOutOfStock
              }
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

          {/* Features */}
          <div className="mt-8 space-y-3 border-t pt-6 text-sm text-gray-600">
            {product.features.map(
              (
                feature,
                index
              ) => (
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
      <div className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-2 gap-3 border-t bg-white p-3 shadow-2xl md:hidden">
        <button
          type="button"
          onClick={addToCart}
          disabled={
            isOutOfStock
          }
          className={`px-4 py-4 text-sm font-black ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-300 text-gray-500"
              : "bg-black text-white"
          }`}
        >
          {isOutOfStock
            ? "OUT OF STOCK"
            : "ADD TO CART"}
        </button>

        <button
          type="button"
          onClick={directOrder}
          disabled={
            isOutOfStock
          }
          className={`flex items-center justify-center gap-2 px-4 py-4 text-sm font-black text-white ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-600"
          }`}
        >
          {!isOutOfStock && (
            <FaWhatsapp className="text-xl" />
          )}

          {isOutOfStock
            ? "SOLD OUT"
            : "ORDER NOW"}
        </button>
      </div>
    </main>
  );
}