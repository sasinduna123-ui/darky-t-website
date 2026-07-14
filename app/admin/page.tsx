"use client";

import { useMemo, useState } from "react";

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
type ProductType = "tshirt" | "pants";

type Stock = Record<Size, number>;

type TshirtMeasurement = {
  chest: number;
  length: number;
  sleeve: number;
};

type PantsMeasurement = {
  waist: number;
  hip: number;
  length: number;
  thigh: number;
};

type TshirtSizeGuide = Record<Size, TshirtMeasurement>;
type PantsSizeGuide = Record<Size, PantsMeasurement>;

const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const initialStock: Stock = {
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  XXL: 0,
};

const initialTshirtSizeGuide: TshirtSizeGuide = {
  XS: { chest: 38, length: 26, sleeve: 8 },
  S: { chest: 40, length: 27, sleeve: 8.5 },
  M: { chest: 42, length: 28, sleeve: 9 },
  L: { chest: 44, length: 29, sleeve: 9.5 },
  XL: { chest: 46, length: 30, sleeve: 10 },
  XXL: { chest: 48, length: 31, sleeve: 10.5 },
};

const initialPantsSizeGuide: PantsSizeGuide = {
  XS: { waist: 26, hip: 36, length: 38, thigh: 20 },
  S: { waist: 28, hip: 38, length: 39, thigh: 21 },
  M: { waist: 30, hip: 40, length: 40, thigh: 22 },
  L: { waist: 32, hip: 42, length: 41, thigh: 23 },
  XL: { waist: 34, hip: 44, length: 42, thigh: 24 },
  XXL: { waist: 36, hip: 46, length: 43, thigh: 25 },
};

const tshirtFeatures = [
  "240 GSM heavy cotton",
  "Premium oversized fit",
  "High-quality print and finishing",
  "Islandwide delivery",
];

const pantsFeatures = [
  "Premium durable fabric",
  "Relaxed streetwear fit",
  "Multiple utility pockets",
  "Islandwide delivery",
];

export default function AdminProductPage() {
  const [productType, setProductType] =
    useState<ProductType>("tshirt");

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [price, setPrice] = useState("3650");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [stock, setStock] = useState<Stock>({
    ...initialStock,
  });

  const [features, setFeatures] =
    useState<string[]>(tshirtFeatures);

  const [tshirtSizeGuide, setTshirtSizeGuide] =
    useState<TshirtSizeGuide>({
      XS: { ...initialTshirtSizeGuide.XS },
      S: { ...initialTshirtSizeGuide.S },
      M: { ...initialTshirtSizeGuide.M },
      L: { ...initialTshirtSizeGuide.L },
      XL: { ...initialTshirtSizeGuide.XL },
      XXL: { ...initialTshirtSizeGuide.XXL },
    });

  const [pantsSizeGuide, setPantsSizeGuide] =
    useState<PantsSizeGuide>({
      XS: { ...initialPantsSizeGuide.XS },
      S: { ...initialPantsSizeGuide.S },
      M: { ...initialPantsSizeGuide.M },
      L: { ...initialPantsSizeGuide.L },
      XL: { ...initialPantsSizeGuide.XL },
      XXL: { ...initialPantsSizeGuide.XXL },
    });

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

  const tshirtSizeGuideCode = `sizeGuide: {
    XS: {
      chest: ${tshirtSizeGuide.XS.chest},
      length: ${tshirtSizeGuide.XS.length},
      sleeve: ${tshirtSizeGuide.XS.sleeve},
    },
    S: {
      chest: ${tshirtSizeGuide.S.chest},
      length: ${tshirtSizeGuide.S.length},
      sleeve: ${tshirtSizeGuide.S.sleeve},
    },
    M: {
      chest: ${tshirtSizeGuide.M.chest},
      length: ${tshirtSizeGuide.M.length},
      sleeve: ${tshirtSizeGuide.M.sleeve},
    },
    L: {
      chest: ${tshirtSizeGuide.L.chest},
      length: ${tshirtSizeGuide.L.length},
      sleeve: ${tshirtSizeGuide.L.sleeve},
    },
    XL: {
      chest: ${tshirtSizeGuide.XL.chest},
      length: ${tshirtSizeGuide.XL.length},
      sleeve: ${tshirtSizeGuide.XL.sleeve},
    },
    XXL: {
      chest: ${tshirtSizeGuide.XXL.chest},
      length: ${tshirtSizeGuide.XXL.length},
      sleeve: ${tshirtSizeGuide.XXL.sleeve},
    },
  },`;

  const pantsSizeGuideCode = `sizeGuide: {
    XS: {
      waist: ${pantsSizeGuide.XS.waist},
      hip: ${pantsSizeGuide.XS.hip},
      length: ${pantsSizeGuide.XS.length},
      thigh: ${pantsSizeGuide.XS.thigh},
    },
    S: {
      waist: ${pantsSizeGuide.S.waist},
      hip: ${pantsSizeGuide.S.hip},
      length: ${pantsSizeGuide.S.length},
      thigh: ${pantsSizeGuide.S.thigh},
    },
    M: {
      waist: ${pantsSizeGuide.M.waist},
      hip: ${pantsSizeGuide.M.hip},
      length: ${pantsSizeGuide.M.length},
      thigh: ${pantsSizeGuide.M.thigh},
    },
    L: {
      waist: ${pantsSizeGuide.L.waist},
      hip: ${pantsSizeGuide.L.hip},
      length: ${pantsSizeGuide.L.length},
      thigh: ${pantsSizeGuide.L.thigh},
    },
    XL: {
      waist: ${pantsSizeGuide.XL.waist},
      hip: ${pantsSizeGuide.XL.hip},
      length: ${pantsSizeGuide.XL.length},
      thigh: ${pantsSizeGuide.XL.thigh},
    },
    XXL: {
      waist: ${pantsSizeGuide.XXL.waist},
      hip: ${pantsSizeGuide.XXL.hip},
      length: ${pantsSizeGuide.XXL.length},
      thigh: ${pantsSizeGuide.XXL.thigh},
    },
  },`;

  const generatedCode = `{
  id: "${slug || "product-id"}",
  slug: "${slug || "product-slug"}",
  name: "${escapeText(name) || "Product Name"}",
  shortName: "${
    escapeText(shortName) ||
    escapeText(name) ||
    "Short Name"
  }",
  productType: "${productType}",
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
    "${escapeText(features[0] || "")}",
    "${escapeText(features[1] || "")}",
    "${escapeText(features[2] || "")}",
    "${escapeText(features[3] || "")}",
  ],
  ${
    productType === "tshirt"
      ? tshirtSizeGuideCode
      : pantsSizeGuideCode
  }
},`;

  function changeProductType(type: ProductType) {
    setProductType(type);

    if (type === "tshirt") {
      setFeatures([...tshirtFeatures]);
      setPrice("3650");
    } else {
      setFeatures([...pantsFeatures]);
      setPrice("4950");
    }
  }

  function updateStock(size: Size, value: string) {
    const numberValue = Math.max(0, Number(value) || 0);

    setStock((current) => ({
      ...current,
      [size]: numberValue,
    }));
  }

  function updateFeature(index: number, value: string) {
    setFeatures((current) =>
      current.map((feature, featureIndex) =>
        featureIndex === index ? value : feature
      )
    );
  }

  function updateTshirtMeasurement(
    size: Size,
    field: keyof TshirtMeasurement,
    value: string
  ) {
    const numberValue = Math.max(0, Number(value) || 0);

    setTshirtSizeGuide((current) => ({
      ...current,
      [size]: {
        ...current[size],
        [field]: numberValue,
      },
    }));
  }

  function updatePantsMeasurement(
    size: Size,
    field: keyof PantsMeasurement,
    value: string
  ) {
    const numberValue = Math.max(0, Number(value) || 0);

    setPantsSizeGuide((current) => ({
      ...current,
      [size]: {
        ...current[size],
        [field]: numberValue,
      },
    }));
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
    setProductType("tshirt");
    setName("");
    setShortName("");
    setPrice("3650");
    setImage("");
    setDescription("");
    setStock({ ...initialStock });
    setFeatures([...tshirtFeatures]);

    setTshirtSizeGuide({
      XS: { ...initialTshirtSizeGuide.XS },
      S: { ...initialTshirtSizeGuide.S },
      M: { ...initialTshirtSizeGuide.M },
      L: { ...initialTshirtSizeGuide.L },
      XL: { ...initialTshirtSizeGuide.XL },
      XXL: { ...initialTshirtSizeGuide.XXL },
    });

    setPantsSizeGuide({
      XS: { ...initialPantsSizeGuide.XS },
      S: { ...initialPantsSizeGuide.S },
      M: { ...initialPantsSizeGuide.M },
      L: { ...initialPantsSizeGuide.L },
      XL: { ...initialPantsSizeGuide.XL },
      XXL: { ...initialPantsSizeGuide.XXL },
    });

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
          className="text-sm font-bold hover:text-gray-300"
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

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            {/* Product Details */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                PRODUCT DETAILS
              </h2>

              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    PRODUCT TYPE
                  </label>

                  <select
                    value={productType}
                    onChange={(event) =>
                      changeProductType(
                        event.target.value as ProductType
                      )
                    }
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  >
                    <option value="tshirt">
                      T-SHIRT
                    </option>

                    <option value="pants">
                      PANTS / TROUSERS
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    PRODUCT NAME
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder={
                      productType === "tshirt"
                        ? "Example: Black Oversized Tee"
                        : "Example: Black Cargo Pants"
                    }
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    SHORT NAME
                  </label>

                  <input
                    value={shortName}
                    onChange={(event) =>
                      setShortName(event.target.value)
                    }
                    placeholder="Example: Black Tee"
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
                    value={image}
                    onChange={(event) =>
                      setImage(event.target.value)
                    }
                    placeholder="Example: black-pants.jpg"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    Photo එක public/images folder එකට දාලා
                    file name එක මෙතන දාන්න.
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

            {/* Features */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                PRODUCT FEATURES
              </h2>

              <div className="mt-6 space-y-4">
                {features.map((feature, index) => (
                  <div key={index}>
                    <label className="mb-2 block text-sm font-bold">
                      FEATURE {index + 1}
                    </label>

                    <input
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

            {/* Stock */}
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

            {/* Size Guide */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                {productType === "tshirt"
                  ? "T-SHIRT SIZE GUIDE"
                  : "PANTS SIZE GUIDE"}
              </h2>

              <p className="mt-3 text-sm text-gray-500">
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

                    {productType === "tshirt" ? (
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        {(
                          [
                            "chest",
                            "length",
                            "sleeve",
                          ] as const
                        ).map((field) => (
                          <div key={field}>
                            <label className="mb-2 block text-sm font-bold uppercase">
                              {field}
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={
                                tshirtSizeGuide[size][field]
                              }
                              onChange={(event) =>
                                updateTshirtMeasurement(
                                  size,
                                  field,
                                  event.target.value
                                )
                              }
                              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {(
                          [
                            "waist",
                            "hip",
                            "length",
                            "thigh",
                          ] as const
                        ).map((field) => (
                          <div key={field}>
                            <label className="mb-2 block text-sm font-bold uppercase">
                              {field}
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={
                                pantsSizeGuide[size][field]
                              }
                              onChange={(event) =>
                                updatePantsMeasurement(
                                  size,
                                  field,
                                  event.target.value
                                )
                              }
                              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                          </div>
                        ))}
                      </div>
                    )}
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

          {/* Preview and Code */}
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

              <p className="mt-5 text-sm font-bold uppercase text-gray-500">
                {productType === "tshirt"
                  ? "T-SHIRT"
                  : "PANTS"}
              </p>

              <h2 className="mt-2 text-2xl font-black">
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
                  className="bg-white px-5 py-3 font-black text-black hover:bg-gray-200"
                >
                  {copied ? "COPIED ✓" : "COPY CODE"}
                </button>
              </div>

              <pre className="mt-6 max-h-[900px] overflow-auto whitespace-pre-wrap border border-white/20 bg-gray-950 p-5 text-sm leading-7 text-gray-200">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}