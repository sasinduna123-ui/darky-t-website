"use client";

import { useMemo, useState } from "react";

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
type ProductType = "tshirt" | "pants";

type Stock = Record<Size, number>;

type ColourVariantForm = {
  name: string;
  hex: string;
  images: string[];
  stock: Stock;
};

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

function createEmptyStock(): Stock {
  return {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  };
}

function createEmptyVariant(
  name = "",
  hex = "#000000"
): ColourVariantForm {
  return {
    name,
    hex,
    images: ["", "", "", ""],
    stock: createEmptyStock(),
  };
}

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
  "Available in multiple colours",
  "Islandwide delivery",
];

const pantsFeatures = [
  "Premium durable fabric",
  "Relaxed streetwear fit",
  "Available in multiple colours",
  "Islandwide delivery",
];

export default function AdminProductPage() {
  const [productType, setProductType] =
    useState<ProductType>("tshirt");

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [price, setPrice] = useState("3650");
  const [description, setDescription] = useState("");

  const [features, setFeatures] =
    useState<string[]>(tshirtFeatures);

  const [variants, setVariants] = useState<
    ColourVariantForm[]
  >([createEmptyVariant("Black", "#000000")]);

  const [
    selectedPreviewVariant,
    setSelectedPreviewVariant,
  ] = useState(0);

  const [
    selectedPreviewImage,
    setSelectedPreviewImage,
  ] = useState(0);

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

  function createImagePath(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "";
    }

    if (trimmedValue.startsWith("/images/")) {
      return trimmedValue;
    }

    return `/images/${trimmedValue}`;
  }

  const slug = useMemo(() => createSlug(name), [name]);

  const firstVariant =
    variants[0] ?? createEmptyVariant("Black");

  const firstVariantImages = firstVariant.images
    .map(createImagePath)
    .filter((image) => image !== "");

  const mainImage =
    firstVariantImages[0] ||
    "/images/product-image.jpg";

  const currentPreviewVariant =
    variants[selectedPreviewVariant] ?? firstVariant;

  const currentPreviewImages =
    currentPreviewVariant.images
      .map(createImagePath)
      .filter((image) => image !== "");

  const previewImage =
    currentPreviewImages[selectedPreviewImage] ||
    currentPreviewImages[0] ||
    mainImage;

  const variantsCode = variants
    .map((variant, variantIndex) => {
      const finalName =
        escapeText(variant.name) ||
        `Colour ${variantIndex + 1}`;

      const variantSlug =
        createSlug(finalName) ||
        `colour-${variantIndex + 1}`;

      const finalHex =
        variant.hex.trim() || "#000000";

      const preparedImages = variant.images
        .map(createImagePath)
        .filter((image) => image !== "");

      const finalImages =
        preparedImages.length > 0
          ? preparedImages
          : ["/images/product-image.jpg"];

      const imagesCode = finalImages
        .map((image) => `        "${image}",`)
        .join("\n");

      return `    {
      name: "${finalName}",
      slug: "${variantSlug}",
      hex: "${finalHex}",

      images: [
${imagesCode}
      ],

      stock: {
        XS: ${variant.stock.XS},
        S: ${variant.stock.S},
        M: ${variant.stock.M},
        L: ${variant.stock.L},
        XL: ${variant.stock.XL},
        XXL: ${variant.stock.XXL},
      },
    }`;
    })
    .join(",\n\n");

  const firstImagesCode = (
    firstVariantImages.length > 0
      ? firstVariantImages
      : ["/images/product-image.jpg"]
  )
    .map((image) => `    "${image}",`)
    .join("\n");

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

  image: "${mainImage}",

  images: [
${firstImagesCode}
  ],

  stock: {
    XS: ${firstVariant.stock.XS},
    S: ${firstVariant.stock.S},
    M: ${firstVariant.stock.M},
    L: ${firstVariant.stock.L},
    XL: ${firstVariant.stock.XL},
    XXL: ${firstVariant.stock.XXL},
  },

  description:
    "${escapeText(description)}",

  features: [
    "${escapeText(features[0] || "")}",
    "${escapeText(features[1] || "")}",
    "${escapeText(features[2] || "")}",
    "${escapeText(features[3] || "")}",
  ],

  variants: [
${variantsCode}
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
      setPrice("3650");
      setFeatures([...tshirtFeatures]);
    } else {
      setPrice("4950");
      setFeatures([...pantsFeatures]);
    }
  }

  function addNewColour() {
    setVariants((current) => [
      ...current,
      createEmptyVariant(
        `Colour ${current.length + 1}`,
        "#000000"
      ),
    ]);

    setSelectedPreviewVariant(variants.length);
    setSelectedPreviewImage(0);
  }

  function removeColour(index: number) {
    if (variants.length === 1) {
      alert(
        "Product එකකට අවම වශයෙන් colour එකක් තිබිය යුතුයි."
      );
      return;
    }

    setVariants((current) =>
      current.filter(
        (_, variantIndex) => variantIndex !== index
      )
    );

    setSelectedPreviewVariant((currentIndex) => {
      if (currentIndex === index) {
        return 0;
      }

      if (currentIndex > index) {
        return currentIndex - 1;
      }

      return currentIndex;
    });

    setSelectedPreviewImage(0);
  }

  function updateVariantName(
    index: number,
    value: string
  ) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, name: value }
          : variant
      )
    );
  }

  function updateVariantHex(
    index: number,
    value: string
  ) {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, hex: value }
          : variant
      )
    );
  }

  function updateVariantImage(
    variantIndex: number,
    imageIndex: number,
    value: string
  ) {
    setVariants((current) =>
      current.map(
        (variant, currentVariantIndex) => {
          if (
            currentVariantIndex !== variantIndex
          ) {
            return variant;
          }

          return {
            ...variant,
            images: variant.images.map(
              (image, currentImageIndex) =>
                currentImageIndex === imageIndex
                  ? value
                  : image
            ),
          };
        }
      )
    );

    setSelectedPreviewVariant(variantIndex);
    setSelectedPreviewImage(0);
  }

  function updateVariantStock(
    variantIndex: number,
    size: Size,
    value: string
  ) {
    const stockValue = Math.max(
      0,
      Number(value) || 0
    );

    setVariants((current) =>
      current.map(
        (variant, currentVariantIndex) =>
          currentVariantIndex === variantIndex
            ? {
                ...variant,
                stock: {
                  ...variant.stock,
                  [size]: stockValue,
                },
              }
            : variant
      )
    );
  }

  function updateFeature(
    index: number,
    value: string
  ) {
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
    const numberValue = Math.max(
      0,
      Number(value) || 0
    );

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
    const numberValue = Math.max(
      0,
      Number(value) || 0
    );

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
      await navigator.clipboard.writeText(
        generatedCode
      );

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
    setDescription("");
    setFeatures([...tshirtFeatures]);

    setVariants([
      createEmptyVariant("Black", "#000000"),
    ]);

    setSelectedPreviewVariant(0);
    setSelectedPreviewImage(0);

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
                        event.target
                          .value as ProductType
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
                    placeholder="Example: Darky Essential Tee"
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
                    placeholder="Example: Essential Tee"
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
                    DESCRIPTION
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Product description එක ලියන්න"
                    className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                PRODUCT FEATURES
              </h2>

              <div className="mt-6 space-y-4">
                {features.map(
                  (feature, index) => (
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
                  )
                )}
              </div>
            </div>

            {/* Colour Variants */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    COLOUR VARIANTS
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Colours ඕනෑම ප්‍රමාණයක් add
                    කරන්න පුළුවන්.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addNewColour}
                  className="bg-black px-5 py-3 text-sm font-black text-white transition hover:bg-gray-800"
                >
                  + ADD NEW COLOUR
                </button>
              </div>

              <p className="mt-5 text-sm font-bold">
                TOTAL COLOURS: {variants.length}
              </p>

              <div className="mt-7 space-y-8">
                {variants.map(
                  (variant, variantIndex) => (
                    <div
                      key={variantIndex}
                      className="border border-gray-300 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-9 w-9 rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                variant.hex,
                            }}
                          />

                          <h3 className="text-xl font-black">
                            COLOUR{" "}
                            {variantIndex + 1}
                          </h3>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPreviewVariant(
                                variantIndex
                              );
                              setSelectedPreviewImage(
                                0
                              );
                            }}
                            className="border border-black px-4 py-2 text-sm font-bold transition hover:bg-black hover:text-white"
                          >
                            PREVIEW
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeColour(
                                variantIndex
                              )
                            }
                            className="border border-red-600 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                          >
                            REMOVE COLOUR
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold">
                            COLOUR NAME
                          </label>

                          <input
                            value={variant.name}
                            onChange={(event) =>
                              updateVariantName(
                                variantIndex,
                                event.target.value
                              )
                            }
                            placeholder="Example: Black"
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold">
                            HEX COLOUR
                          </label>

                          <div className="flex gap-3">
                            <input
                              type="color"
                              value={variant.hex}
                              onChange={(event) =>
                                updateVariantHex(
                                  variantIndex,
                                  event.target.value
                                )
                              }
                              className="h-12 w-16 border border-gray-300"
                            />

                            <input
                              value={variant.hex}
                              onChange={(event) =>
                                updateVariantHex(
                                  variantIndex,
                                  event.target.value
                                )
                              }
                              placeholder="#000000"
                              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      </div>

                      <h4 className="mt-7 font-black">
                        PHOTOS
                      </h4>

                      <p className="mt-2 text-sm text-gray-500">
                        Photo files `public/images`
                        folder එකට දාලා file name එක
                        මෙතන දාන්න.
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {variant.images.map(
                          (image, imageIndex) => (
                            <div key={imageIndex}>
                              <label className="mb-2 block text-sm font-bold">
                                PHOTO{" "}
                                {imageIndex + 1}
                              </label>

                              <input
                                value={image}
                                onChange={(event) =>
                                  updateVariantImage(
                                    variantIndex,
                                    imageIndex,
                                    event.target
                                      .value
                                  )
                                }
                                placeholder={`Example: product-colour-${
                                  imageIndex + 1
                                }.jpg`}
                                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                              />
                            </div>
                          )
                        )}
                      </div>

                      <h4 className="mt-7 font-black">
                        STOCK BY SIZE
                      </h4>

                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {sizes.map((size) => (
                          <div key={size}>
                            <label className="mb-2 block text-sm font-bold">
                              {size}
                            </label>

                            <input
                              type="number"
                              min="0"
                              value={
                                variant.stock[size]
                              }
                              onChange={(event) =>
                                updateVariantStock(
                                  variantIndex,
                                  size,
                                  event.target.value
                                )
                              }
                              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={addNewColour}
                className="mt-8 w-full border-2 border-dashed border-black px-6 py-4 font-black transition hover:bg-black hover:text-white"
              >
                + ADD ANOTHER COLOUR
              </button>
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

                    {productType ===
                    "tshirt" ? (
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
                                tshirtSizeGuide[
                                  size
                                ][field]
                              }
                              onChange={(
                                event
                              ) =>
                                updateTshirtMeasurement(
                                  size,
                                  field,
                                  event.target
                                    .value
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
                                pantsSizeGuide[
                                  size
                                ][field]
                              }
                              onChange={(
                                event
                              ) =>
                                updatePantsMeasurement(
                                  size,
                                  field,
                                  event.target
                                    .value
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

          {/* Preview and Generated Code */}
          <div className="space-y-8">
            <div className="bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
                PRODUCT PREVIEW
              </p>

              <div className="mt-6 overflow-hidden bg-gray-100">
                <img
                  src={previewImage}
                  alt={
                    name || "Product preview"
                  }
                  className="aspect-square w-full object-cover"
                />
              </div>

              {currentPreviewImages.length >
                1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {currentPreviewImages.map(
                    (image, imageIndex) => (
                      <button
                        key={`${image}-${imageIndex}`}
                        type="button"
                        onClick={() =>
                          setSelectedPreviewImage(
                            imageIndex
                          )
                        }
                        className={`overflow-hidden border-2 ${
                          selectedPreviewImage ===
                          imageIndex
                            ? "border-black"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Preview ${
                            imageIndex + 1
                          }`}
                          className="aspect-square w-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              )}

              <p className="mt-5 text-sm font-bold uppercase text-gray-500">
                {productType === "tshirt"
                  ? "T-SHIRT"
                  : "PANTS"}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {name || "PRODUCT NAME"}
              </h2>

              <p className="mt-2 text-xl font-bold">
                Rs.{" "}
                {(
                  Number(price) || 0
                ).toLocaleString()}
              </p>

              <p className="mt-5 text-sm text-gray-500">
                Selected colour
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span
                  className="h-8 w-8 rounded-full border border-gray-300"
                  style={{
                    backgroundColor:
                      currentPreviewVariant.hex,
                  }}
                />

                <span className="font-black">
                  {currentPreviewVariant.name ||
                    `Colour ${
                      selectedPreviewVariant + 1
                    }`}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {variants.map(
                  (variant, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedPreviewVariant(
                          index
                        );
                        setSelectedPreviewImage(
                          0
                        );
                      }}
                      className={`h-10 w-10 rounded-full border-2 p-1 ${
                        selectedPreviewVariant ===
                        index
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      aria-label={
                        variant.name ||
                        `Colour ${index + 1}`
                      }
                    >
                      <span
                        className="block h-full w-full rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            variant.hex,
                        }}
                      />
                    </button>
                  )
                )}
              </div>

              <p className="mt-5 leading-7 text-gray-600">
                {description ||
                  "Product description එක මෙතන පේනවා."}
              </p>

              <div className="mt-6 space-y-2 border-t pt-5 text-sm text-gray-600">
                {features.map(
                  (feature, index) => (
                    <p key={index}>
                      ✓{" "}
                      {feature ||
                        `Feature ${
                          index + 1
                        }`}
                    </p>
                  )
                )}
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Total colours
              </p>

              <p className="mt-1 font-black">
                {variants.length}
              </p>

              <p className="mt-6 text-sm text-gray-500">
                Product link
              </p>

              <p className="mt-1 break-all font-bold">
                /product/
                {slug || "product-slug"}
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
                  {copied
                    ? "COPIED ✓"
                    : "COPY CODE"}
                </button>
              </div>

              <pre className="mt-6 max-h-[1000px] overflow-auto whitespace-pre-wrap border border-white/20 bg-gray-950 p-5 text-sm leading-7 text-gray-200">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}