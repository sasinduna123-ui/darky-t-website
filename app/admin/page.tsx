"use client";

import { useMemo, useState } from "react";

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

type Stock = Record<Size, number>;

type Measurement = {
  chest: number;
  length: number;
  sleeve: number;
};

type SizeGuide = Record<Size, Measurement>;

const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const initialStock: Stock = {
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  XXL: 0,
};

const initialSizeGuide: SizeGuide = {
  XS: {
    chest: 38,
    length: 26,
    sleeve: 8,
  },
  S: {
    chest: 40,
    length: 27,
    sleeve: 8.5,
  },
  M: {
    chest: 42,
    length: 28,
    sleeve: 9,
  },
  L: {
    chest: 44,
    length: 29,
    sleeve: 9.5,
  },
  XL: {
    chest: 46,
    length: 30,
    sleeve: 10,
  },
  XXL: {
    chest: 48,
    length: 31,
    sleeve: 10.5,
  },
};

const initialFeatures = [
  "240 GSM heavy cotton",
  "Premium oversized fit",
  "High-quality print and finishing",
  "Islandwide delivery",
];

export default function AdminProductPage() {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [price, setPrice] = useState("3650");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<Stock>(initialStock);
  const [sizeGuide, setSizeGuide] =
    useState<SizeGuide>(initialSizeGuide);
  const [features, setFeatures] =
    useState<string[]>(initialFeatures);
  const [copied, setCopied] = useState(false);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function escapeText(value: string) {
    return value
      .trim()
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ");
  }

  const slug = useMemo(() => createSlug(name), [name]);

  const imagePath = image.trim()
    ? image.trim().startsWith("/images/")
      ? image.trim()
      : `/images/${image.trim()}`
    : "/images/product-image.jpg";

  const generatedCode = `{
  id: "${slug || "product-id"}",
  slug: "${slug || "product-slug"}",
  name: "${escapeText(name) || "Product Name"}",
  shortName: "${
    escapeText(shortName) ||
    escapeText(name) ||
    "Short Name"
  }",
  price: ${Number(price) || 0},
  image: "${imagePath}",
  description:
    "${escapeText(description)}",
  stock: {
    XS: ${stock.XS},
    S: ${stock.S},
    M: ${stock.M},
    L: ${stock.L},
    XL: ${stock.XL},
    XXL: ${stock.XXL},
  },
  features: [
    "${escapeText(features[0])}",
    "${escapeText(features[1])}",
    "${escapeText(features[2])}",
    "${escapeText(features[3])}",
  ],
  sizeGuide: {
    XS: {
      chest: ${sizeGuide.XS.chest},
      length: ${sizeGuide.XS.length},
      sleeve: ${sizeGuide.XS.sleeve},
    },
    S: {
      chest: ${sizeGuide.S.chest},
      length: ${sizeGuide.S.length},
      sleeve: ${sizeGuide.S.sleeve},
    },
    M: {
      chest: ${sizeGuide.M.chest},
      length: ${sizeGuide.M.length},
      sleeve: ${sizeGuide.M.sleeve},
    },
    L: {
      chest: ${sizeGuide.L.chest},
      length: ${sizeGuide.L.length},
      sleeve: ${sizeGuide.L.sleeve},
    },
    XL: {
      chest: ${sizeGuide.XL.chest},
      length: ${sizeGuide.XL.length},
      sleeve: ${sizeGuide.XL.sleeve},
    },
    XXL: {
      chest: ${sizeGuide.XXL.chest},
      length: ${sizeGuide.XXL.length},
      sleeve: ${sizeGuide.XXL.sleeve},
    },
  },
},`;

  function updateStock(size: Size, value: string) {
    const numberValue = Math.max(0, Number(value) || 0);

    setStock((currentStock) => ({
      ...currentStock,
      [size]: numberValue,
    }));
  }

  function updateMeasurement(
    size: Size,
    field: keyof Measurement,
    value: string
  ) {
    const numberValue = Math.max(0, Number(value) || 0);

    setSizeGuide((currentGuide) => ({
      ...currentGuide,
      [size]: {
        ...currentGuide[size],
        [field]: numberValue,
      },
    }));
  }

  function updateFeature(index: number, value: string) {
    setFeatures((currentFeatures) =>
      currentFeatures.map((feature, featureIndex) =>
        featureIndex === index ? value : feature
      )
    );
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Code එක copy කරන්න බැරි වුණා.");
    }
  }

  function resetForm() {
    setName("");
    setShortName("");
    setPrice("3650");
    setImage("");
    setDescription("");
    setStock({ ...initialStock });
    setSizeGuide({
      XS: { ...initialSizeGuide.XS },
      S: { ...initialSizeGuide.S },
      M: { ...initialSizeGuide.M },
      L: { ...initialSizeGuide.L },
      XL: { ...initialSizeGuide.XL },
      XXL: { ...initialSizeGuide.XXL },
    });
    setFeatures([...initialFeatures]);
    setCopied(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <nav className="flex items-center justify-between bg-black px-5 py-5 text-white md:px-12">
        <a
          href="/"
          className="text-xl font-black tracking-[0.25em] sm:text-2xl"
        >
          DARKY T
        </a>

        <a
          href="/"
          className="text-sm font-bold transition hover:text-gray-300"
        >
          BACK TO HOME
        </a>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-12">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
          DARKY T ADMIN
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          ADD NEW PRODUCT
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-gray-600">
          Product විස්තර, stock, features සහ size guide එක
          පුරවලා generated code එක copy කරගෙන products.ts
          file එකට paste කරන්න.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                PRODUCT DETAILS
              </h2>

              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    PRODUCT NAME
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Example: Red Oversized Tee"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    SHORT NAME
                  </label>

                  <input
                    type="text"
                    value={shortName}
                    onChange={(event) =>
                      setShortName(event.target.value)
                    }
                    placeholder="Example: Red Tee"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    PRICE
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    IMAGE FILE NAME
                  </label>

                  <input
                    type="text"
                    value={image}
                    onChange={(event) =>
                      setImage(event.target.value)
                    }
                    placeholder="Example: red-tee.jpg"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Photo එක public/images folder එකට දාලා file
                    name එක මෙතන දාන්න.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    DESCRIPTION
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={5}
                    placeholder="Product description එක ලියන්න"
                    className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                PRODUCT FEATURES
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Product page එකේ ✓ ලකුණ සමඟ පේන විස්තර හතර
                මෙතනින් වෙනස් කරන්න.
              </p>

              <div className="mt-6 space-y-4">
                {features.map((feature, index) => (
                  <div key={index}>
                    <label className="mb-2 block text-sm font-bold">
                      FEATURE {index + 1}
                    </label>

                    <input
                      type="text"
                      value={feature}
                      onChange={(event) =>
                        updateFeature(
                          index,
                          event.target.value
                        )
                      }
                      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                STOCK BY SIZE
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {sizes.map((size) => (
                  <div key={size}>
                    <label className="mb-2 block text-sm font-bold">
                      {size}
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={stock[size]}
                      onChange={(event) =>
                        updateStock(size, event.target.value)
                      }
                      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                SIZE GUIDE
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Measurements අඟල් වලින් දාන්න.
              </p>

              <div className="mt-6 space-y-5">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="border border-gray-200 p-5"
                  >
                    <h3 className="text-lg font-black">
                      SIZE {size}
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-2 block text-sm font-bold">
                          CHEST
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={sizeGuide[size].chest}
                          onChange={(event) =>
                            updateMeasurement(
                              size,
                              "chest",
                              event.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold">
                          LENGTH
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={sizeGuide[size].length}
                          onChange={(event) =>
                            updateMeasurement(
                              size,
                              "length",
                              event.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold">
                          SLEEVE
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={sizeGuide[size].sleeve}
                          onChange={(event) =>
                            updateMeasurement(
                              size,
                              "sleeve",
                              event.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="w-full border border-black bg-white px-6 py-4 font-bold transition hover:bg-black hover:text-white"
            >
              RESET FORM
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
                PRODUCT PREVIEW
              </p>

              <div className="mt-6 overflow-hidden bg-gray-100">
                <img
                  src={imagePath}
                  alt={name || "Product preview"}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                {name || "PRODUCT NAME"}
              </h2>

              <p className="mt-2 text-xl font-bold">
                Rs. {(Number(price) || 0).toLocaleString()}
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                {description ||
                  "Product description එක මෙතන පේනවා."}
              </p>

              <div className="mt-6 space-y-2 border-t pt-5 text-sm text-gray-600">
                {features.map((feature, index) => (
                  <p key={index}>
                    ✓ {feature || `Feature ${index + 1}`}
                  </p>
                ))}
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Product link
              </p>

              <p className="mt-1 break-all font-bold">
                /product/{slug || "product-slug"}
              </p>
            </div>

            <div className="bg-black p-6 text-white shadow-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-black">
                  GENERATED CODE
                </h2>

                <button
                  type="button"
                  onClick={copyCode}
                  className="bg-white px-5 py-3 font-black text-black transition hover:bg-gray-200"
                >
                  {copied ? "COPIED ✓" : "COPY CODE"}
                </button>
              </div>

              <pre className="mt-6 max-h-[800px] overflow-auto whitespace-pre-wrap border border-white/20 bg-gray-950 p-5 text-sm leading-7 text-gray-200">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}