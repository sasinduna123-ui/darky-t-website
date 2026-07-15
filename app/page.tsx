"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Product,
} from "@/app/data/products";

import {
  fetchProductsFromSupabase,
} from "@/app/data/supabase-products";

type CartItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

type ProductFilter =
  | "all"
  | "tshirt"
  | "pants";

type StockFilter =
  | "all"
  | "in-stock"
  | "sold-out";

type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "name-az";

function getTotalProductStock(
  product: Product
): number {
  return product.variants.reduce(
    (
      productTotal,
      variant
    ) => {
      const variantStock =
        Object.values(
          variant.stock
        ).reduce(
          (
            total,
            stockAmount
          ) =>
            total +
            Number(
              stockAmount || 0
            ),
          0
        );

      return (
        productTotal +
        variantStock
      );
    },
    0
  );
}

function getAvailableColours(
  product: Product
): number {
  return product.variants.filter(
    (variant) => {
      const totalVariantStock =
        Object.values(
          variant.stock
        ).reduce(
          (
            total,
            stockAmount
          ) =>
            total +
            Number(
              stockAmount || 0
            ),
          0
        );

      return (
        totalVariantStock > 0
      );
    }
  ).length;
}

export default function Home() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(true);

  const [
    productsError,
    setProductsError,
  ] = useState("");

  const [
    cartCount,
    setCartCount,
  ] = useState(0);

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    productFilter,
    setProductFilter,
  ] =
    useState<ProductFilter>("all");

  const [
    stockFilter,
    setStockFilter,
  ] =
    useState<StockFilter>("all");

  const [
    sortOption,
    setSortOption,
  ] =
    useState<SortOption>("default");

  function updateCartCount() {
    try {
      const savedCart =
        localStorage.getItem(
          "darky-cart"
        );

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const parsedCart =
        JSON.parse(savedCart);

      if (
        !Array.isArray(parsedCart)
      ) {
        setCartCount(0);
        return;
      }

      const cart: CartItem[] =
        parsedCart;

      const totalItems =
        cart.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.quantity || 0
            ),
          0
        );

      setCartCount(
        totalItems
      );
    } catch {
      setCartCount(0);
    }
  }

  async function loadProducts() {
    setProductsLoading(true);
    setProductsError("");

    try {
      const databaseProducts =
        await fetchProductsFromSupabase();

      setProducts(
        databaseProducts
      );
    } catch (error) {
      console.error(
        "Product loading error:",
        error
      );

      setProducts([]);

      setProductsError(
        "Products database එකෙන් load කරන්න බැරි වුණා. Page එක refresh කරලා නැවත බලන්න."
      );
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    updateCartCount();
    loadProducts();

    window.addEventListener(
      "focus",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

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

  function clearFilters() {
    setSearchText("");
    setProductFilter("all");
    setStockFilter("all");
    setSortOption("default");
  }

  const filteredProducts =
    useMemo(() => {
      const cleanSearch =
        searchText
          .trim()
          .toLowerCase();

      const filtered =
        products.filter(
          (product) => {
            const totalStock =
              getTotalProductStock(
                product
              );

            const matchesSearch =
              !cleanSearch ||
              product.name
                .toLowerCase()
                .includes(
                  cleanSearch
                ) ||
              product.shortName
                .toLowerCase()
                .includes(
                  cleanSearch
                ) ||
              product.description
                .toLowerCase()
                .includes(
                  cleanSearch
                ) ||
              product.variants.some(
                (variant) =>
                  variant.name
                    .toLowerCase()
                    .includes(
                      cleanSearch
                    )
              );

            const matchesType =
              productFilter ===
                "all" ||
              product.productType ===
                productFilter;

            const matchesStock =
              stockFilter ===
                "all" ||
              (
                stockFilter ===
                  "in-stock" &&
                totalStock > 0
              ) ||
              (
                stockFilter ===
                  "sold-out" &&
                totalStock === 0
              );

            return (
              matchesSearch &&
              matchesType &&
              matchesStock
            );
          }
        );

      return [
        ...filtered,
      ].sort(
        (
          firstProduct,
          secondProduct
        ) => {
          if (
            sortOption ===
            "price-low"
          ) {
            return (
              firstProduct.price -
              secondProduct.price
            );
          }

          if (
            sortOption ===
            "price-high"
          ) {
            return (
              secondProduct.price -
              firstProduct.price
            );
          }

          if (
            sortOption ===
            "name-az"
          ) {
            return firstProduct.name.localeCompare(
              secondProduct.name
            );
          }

          return 0;
        }
      );
    }, [
      products,
      searchText,
      productFilter,
      stockFilter,
      sortOption,
    ]);

  const activeFilterCount =
    [
      searchText.trim() !== "",
      productFilter !== "all",
      stockFilter !== "all",
      sortOption !== "default",
    ].filter(Boolean).length;

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

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (current) =>
                    !current
                )
              }
              className="flex h-10 w-10 items-center justify-center border border-white/30 text-2xl lg:hidden"
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {menuOpen
                ? "×"
                : "☰"}
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
            STREETWEAR
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
        className="bg-white px-5 py-20 text-black sm:px-6 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            NEW COLLECTION
          </p>

          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black md:text-5xl">
                SHOP PRODUCTS
              </h2>

              <p className="mt-3 text-gray-600">
                Search, filter and find your style.
              </p>
            </div>

            {!productsLoading &&
              !productsError && (
                <div className="text-sm font-bold text-gray-500">
                  {
                    filteredProducts.length
                  }{" "}
                  {filteredProducts.length ===
                  1
                    ? "PRODUCT"
                    : "PRODUCTS"}{" "}
                  FOUND
                </div>
              )}
          </div>

          {/* Loading */}
          {productsLoading && (
            <div className="mt-10 border border-gray-200 bg-gray-50 px-6 py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

              <h3 className="mt-6 text-2xl font-black">
                LOADING PRODUCTS
              </h3>

              <p className="mt-3 text-gray-600">
                Supabase database එකෙන් products load කරනවා...
              </p>
            </div>
          )}

          {/* Database Error */}
          {!productsLoading &&
            productsError && (
              <div className="mt-10 border border-red-200 bg-red-50 px-6 py-12 text-center">
                <h3 className="text-3xl font-black text-red-600">
                  PRODUCT LOAD ERROR
                </h3>

                <p className="mx-auto mt-4 max-w-xl leading-7 text-red-700">
                  {productsError}
                </p>

                <button
                  type="button"
                  onClick={
                    loadProducts
                  }
                  className="mt-7 bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
                >
                  TRY AGAIN
                </button>
              </div>
            )}

          {!productsLoading &&
            !productsError && (
              <>
                {/* Search and Filters */}
                <div className="mt-10 border border-gray-200 bg-gray-50 p-5 md:p-7">
                  <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
                    {/* Search */}
                    <div>
                      <label className="mb-2 block text-xs font-black tracking-[0.18em] text-gray-500">
                        SEARCH PRODUCTS
                      </label>

                      <div className="relative">
                        <input
                          type="search"
                          value={
                            searchText
                          }
                          onChange={(
                            event
                          ) =>
                            setSearchText(
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="Search product or colour..."
                          className="w-full border border-gray-300 bg-white px-4 py-4 pr-12 outline-none transition focus:border-black"
                        />

                        {searchText && (
                          <button
                            type="button"
                            onClick={() =>
                              setSearchText(
                                ""
                              )
                            }
                            aria-label="Clear search"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-black text-gray-400 hover:text-black"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stock Filter */}
                    <div>
                      <label className="mb-2 block text-xs font-black tracking-[0.18em] text-gray-500">
                        STOCK
                      </label>

                      <select
                        value={
                          stockFilter
                        }
                        onChange={(
                          event
                        ) =>
                          setStockFilter(
                            event
                              .target
                              .value as StockFilter
                          )
                        }
                        className="w-full border border-gray-300 bg-white px-4 py-4 outline-none transition focus:border-black"
                      >
                        <option value="all">
                          ALL PRODUCTS
                        </option>

                        <option value="in-stock">
                          IN STOCK
                        </option>

                        <option value="sold-out">
                          SOLD OUT
                        </option>
                      </select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="mb-2 block text-xs font-black tracking-[0.18em] text-gray-500">
                        SORT BY
                      </label>

                      <select
                        value={
                          sortOption
                        }
                        onChange={(
                          event
                        ) =>
                          setSortOption(
                            event
                              .target
                              .value as SortOption
                          )
                        }
                        className="w-full border border-gray-300 bg-white px-4 py-4 outline-none transition focus:border-black"
                      >
                        <option value="default">
                          DEFAULT
                        </option>

                        <option value="price-low">
                          PRICE: LOW TO HIGH
                        </option>

                        <option value="price-high">
                          PRICE: HIGH TO LOW
                        </option>

                        <option value="name-az">
                          NAME: A TO Z
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Product Type */}
                  <div className="mt-6">
                    <p className="mb-3 text-xs font-black tracking-[0.18em] text-gray-500">
                      PRODUCT TYPE
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setProductFilter(
                            "all"
                          )
                        }
                        className={`border px-5 py-3 text-sm font-black transition ${
                          productFilter ===
                          "all"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        ALL
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setProductFilter(
                            "tshirt"
                          )
                        }
                        className={`border px-5 py-3 text-sm font-black transition ${
                          productFilter ===
                          "tshirt"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        T-SHIRTS
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setProductFilter(
                            "pants"
                          )
                        }
                        className={`border px-5 py-3 text-sm font-black transition ${
                          productFilter ===
                          "pants"
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-black hover:border-black"
                        }`}
                      >
                        PANTS
                      </button>
                    </div>
                  </div>

                  {activeFilterCount >
                    0 && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
                      <p className="text-sm font-bold text-gray-600">
                        {
                          activeFilterCount
                        }{" "}
                        active{" "}
                        {activeFilterCount ===
                        1
                          ? "filter"
                          : "filters"}
                      </p>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="text-sm font-black underline underline-offset-4 hover:text-gray-500"
                      >
                        CLEAR ALL FILTERS
                      </button>
                    </div>
                  )}
                </div>

                {/* Products */}
                {filteredProducts.length >
                0 ? (
                  <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map(
                      (product) => {
                        const totalStock =
                          getTotalProductStock(
                            product
                          );

                        const isSoldOut =
                          totalStock <=
                          0;

                        const availableColours =
                          getAvailableColours(
                            product
                          );

                        const isLowStock =
                          totalStock >
                            0 &&
                          totalStock <=
                            5;

                        return (
                          <article
                            key={
                              product.id
                            }
                            className="group"
                          >
                            <a
                              href={`/product/${product.slug}`}
                              className="relative block overflow-hidden bg-gray-100"
                            >
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                              />

                              <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
                                <span className="bg-black px-3 py-2 text-[10px] font-black tracking-[0.15em] text-white">
                                  {product.productType ===
                                  "tshirt"
                                    ? "T-SHIRT"
                                    : "PANTS"}
                                </span>

                                {isSoldOut && (
                                  <span className="bg-red-600 px-3 py-2 text-[10px] font-black tracking-[0.15em] text-white">
                                    SOLD OUT
                                  </span>
                                )}

                                {!isSoldOut &&
                                  isLowStock && (
                                    <span className="bg-orange-500 px-3 py-2 text-[10px] font-black tracking-[0.15em] text-white">
                                      LOW STOCK
                                    </span>
                                  )}
                              </div>

                              {!isSoldOut && (
                                <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-2 text-xs font-black text-black shadow-sm">
                                  {
                                    availableColours
                                  }{" "}
                                  {availableColours ===
                                  1
                                    ? "COLOUR"
                                    : "COLOURS"}
                                </div>
                              )}
                            </a>

                            <div className="mt-5">
                              <div className="flex items-start justify-between gap-4">
                                <a
                                  href={`/product/${product.slug}`}
                                >
                                  <h3 className="text-xl font-black uppercase hover:underline">
                                    {
                                      product.name
                                    }
                                  </h3>
                                </a>

                                <p className="whitespace-nowrap text-lg font-black">
                                  Rs.{" "}
                                  {product.price.toLocaleString()}
                                </p>
                              </div>

                              {product.description && (
                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                                  {
                                    product.description
                                  }
                                </p>
                              )}

                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                {product.variants
                                  .slice(
                                    0,
                                    6
                                  )
                                  .map(
                                    (
                                      variant,
                                      index
                                    ) => {
                                      const variantStock =
                                        Object.values(
                                          variant.stock
                                        ).reduce(
                                          (
                                            total,
                                            stockAmount
                                          ) =>
                                            total +
                                            Number(
                                              stockAmount ||
                                                0
                                            ),
                                          0
                                        );

                                      return (
                                        <span
                                          key={`${variant.slug}-${index}`}
                                          title={`${variant.name}${
                                            variantStock <=
                                            0
                                              ? " - Sold out"
                                              : ""
                                          }`}
                                          className={`h-6 w-6 rounded-full border border-gray-300 ${
                                            variantStock <=
                                            0
                                              ? "opacity-30"
                                              : ""
                                          }`}
                                          style={{
                                            backgroundColor:
                                              variant.hex,
                                          }}
                                        />
                                      );
                                    }
                                  )}

                                {product
                                  .variants
                                  .length >
                                  6 && (
                                  <span className="text-xs font-bold text-gray-500">
                                    +
                                    {product
                                      .variants
                                      .length -
                                      6}
                                  </span>
                                )}
                              </div>

                              <a
                                href={`/product/${product.slug}`}
                                className={`mt-5 block w-full px-5 py-4 text-center font-black transition ${
                                  isSoldOut
                                    ? "bg-gray-300 text-gray-600 hover:bg-gray-400"
                                    : "bg-black text-white hover:bg-gray-800"
                                }`}
                              >
                                {isSoldOut
                                  ? "VIEW SOLD OUT PRODUCT"
                                  : "VIEW PRODUCT"}
                              </a>
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="mt-10 border border-gray-200 bg-gray-50 px-6 py-16 text-center">
                    <h3 className="text-3xl font-black">
                      {products.length ===
                      0
                        ? "NO DATABASE PRODUCTS"
                        : "NO PRODUCTS FOUND"}
                    </h3>

                    <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
                      {products.length ===
                      0
                        ? "Supabase database එකේ active products කිසිවක් නැහැ."
                        : "Search හෝ filters වලට ගැළපෙන product එකක් නැහැ."}
                    </p>

                    {products.length >
                      0 && (
                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="mt-7 bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
                      >
                        CLEAR FILTERS
                      </button>
                    )}

                    {products.length ===
                      0 && (
                      <button
                        type="button"
                        onClick={
                          loadProducts
                        }
                        className="mt-7 bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
                      >
                        RELOAD PRODUCTS
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
        </div>
      </section>

      {/* Reviews */}
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

      {/* About */}
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

      {/* Contact */}
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
            Select a product, choose the colour, size and
            quantity, add it to the cart, and complete the
            order through WhatsApp checkout.
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