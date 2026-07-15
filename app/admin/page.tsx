"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  products,
  Product,
  ProductSize,
  ProductStock,
  ProductType,
  TshirtSizeGuide,
  PantsSizeGuide,
  defaultTshirtSizeGuide,
  defaultPantsSizeGuide,
  productSizes,
} from "@/app/data/products";

type ColourVariantForm = {
  name: string;
  hex: string;
  images: string[];
  stock: ProductStock;
};

type AdminMode =
  | "create"
  | "edit";

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

function createEmptyStock(): ProductStock {
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
  name = "Black",
  hex = "#000000"
): ColourVariantForm {
  return {
    name,
    hex,
    images: ["", "", "", ""],
    stock: createEmptyStock(),
  };
}

function cloneTshirtSizeGuide(
  guide: TshirtSizeGuide
): TshirtSizeGuide {
  return {
    XS: { ...guide.XS },
    S: { ...guide.S },
    M: { ...guide.M },
    L: { ...guide.L },
    XL: { ...guide.XL },
    XXL: { ...guide.XXL },
  };
}

function clonePantsSizeGuide(
  guide: PantsSizeGuide
): PantsSizeGuide {
  return {
    XS: { ...guide.XS },
    S: { ...guide.S },
    M: { ...guide.M },
    L: { ...guide.L },
    XL: { ...guide.XL },
    XXL: { ...guide.XXL },
  };
}

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
  const trimmedValue =
    value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (
    trimmedValue.startsWith(
      "/images/"
    )
  ) {
    return trimmedValue;
  }

  return `/images/${trimmedValue}`;
}

function prepareVariantFromProduct(
  variant: Product["variants"][number]
): ColourVariantForm {
  const preparedImages = [
    ...variant.images,
  ];

  while (
    preparedImages.length < 4
  ) {
    preparedImages.push("");
  }

  return {
    name: variant.name,
    hex: variant.hex,
    images: preparedImages,
    stock: {
      ...variant.stock,
    },
  };
}

export default function AdminProductPage() {
  const [adminMode, setAdminMode] =
    useState<AdminMode>("create");

  const [
    selectedExistingSlug,
    setSelectedExistingSlug,
  ] = useState("");

  const [
    originalProductSlug,
    setOriginalProductSlug,
  ] = useState("");

  const [
    productType,
    setProductType,
  ] =
    useState<ProductType>("tshirt");

  const [name, setName] =
    useState("");

  const [shortName, setShortName] =
    useState("");

  const [price, setPrice] =
    useState("3650");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    features,
    setFeatures,
  ] = useState<string[]>([
    ...tshirtFeatures,
  ]);

  const [
    variants,
    setVariants,
  ] = useState<
    ColourVariantForm[]
  >([
    createEmptyVariant(),
  ]);

  const [
    tshirtSizeGuide,
    setTshirtSizeGuide,
  ] = useState<TshirtSizeGuide>(
    cloneTshirtSizeGuide(
      defaultTshirtSizeGuide
    )
  );

  const [
    pantsSizeGuide,
    setPantsSizeGuide,
  ] = useState<PantsSizeGuide>(
    clonePantsSizeGuide(
      defaultPantsSizeGuide
    )
  );

  const [
    selectedPreviewVariant,
    setSelectedPreviewVariant,
  ] = useState(0);

  const [
    selectedPreviewImage,
    setSelectedPreviewImage,
  ] = useState(0);

  const [copied, setCopied] =
    useState(false);

  const [
    deleteCodeCopied,
    setDeleteCodeCopied,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const slug = useMemo(
    () => createSlug(name),
    [name]
  );

  const firstVariant =
    variants[0] ??
    createEmptyVariant();

  const firstVariantImages =
    firstVariant.images
      .map(createImagePath)
      .filter(Boolean);

  const mainImage =
    firstVariantImages[0] ||
    "/images/product-image.jpg";

  const currentPreviewVariant =
    variants[
      selectedPreviewVariant
    ] ?? firstVariant;

  const currentPreviewImages =
    currentPreviewVariant.images
      .map(createImagePath)
      .filter(Boolean);

  const previewImage =
    currentPreviewImages[
      selectedPreviewImage
    ] ||
    currentPreviewImages[0] ||
    mainImage;

  function resetForm() {
    setAdminMode("create");
    setSelectedExistingSlug("");
    setOriginalProductSlug("");

    setProductType("tshirt");
    setName("");
    setShortName("");
    setPrice("3650");
    setDescription("");

    setFeatures([
      ...tshirtFeatures,
    ]);

    setVariants([
      createEmptyVariant(),
    ]);

    setTshirtSizeGuide(
      cloneTshirtSizeGuide(
        defaultTshirtSizeGuide
      )
    );

    setPantsSizeGuide(
      clonePantsSizeGuide(
        defaultPantsSizeGuide
      )
    );

    setSelectedPreviewVariant(0);
    setSelectedPreviewImage(0);
    setCopied(false);
    setDeleteCodeCopied(false);
    setMessage("");
  }

  function changeProductType(
    type: ProductType
  ) {
    setProductType(type);

    if (type === "tshirt") {
      setPrice("3650");
      setFeatures([
        ...tshirtFeatures,
      ]);
    } else {
      setPrice("4950");
      setFeatures([
        ...pantsFeatures,
      ]);
    }
  }

  function loadExistingProduct(
    productSlug: string
  ) {
    setSelectedExistingSlug(
      productSlug
    );

    if (!productSlug) {
      resetForm();
      return;
    }

    const product =
      products.find(
        (currentProduct) =>
          currentProduct.slug ===
          productSlug
      );

    if (!product) {
      setMessage(
        "Product එක හොයාගන්න බැහැ."
      );

      return;
    }

    setAdminMode("edit");

    setOriginalProductSlug(
      product.slug
    );

    setProductType(
      product.productType
    );

    setName(product.name);

    setShortName(
      product.shortName
    );

    setPrice(
      String(product.price)
    );

    setDescription(
      product.description
    );

    setFeatures([
      ...product.features,
    ]);

    setVariants(
      product.variants.map(
        prepareVariantFromProduct
      )
    );

    if (
      product.productType ===
      "tshirt"
    ) {
      setTshirtSizeGuide(
        cloneTshirtSizeGuide(
          product.sizeGuide
        )
      );
    } else {
      setPantsSizeGuide(
        clonePantsSizeGuide(
          product.sizeGuide
        )
      );
    }

    setSelectedPreviewVariant(0);
    setSelectedPreviewImage(0);

    setCopied(false);
    setDeleteCodeCopied(false);

    setMessage(
      `${product.name} edit කරන්න load කළා.`
    );
  }

  function addNewColour() {
    setVariants((current) => [
      ...current,
      createEmptyVariant(
        `Colour ${
          current.length + 1
        }`
      ),
    ]);

    setSelectedPreviewVariant(
      variants.length
    );

    setSelectedPreviewImage(0);
  }

  function removeColour(
    index: number
  ) {
    if (
      variants.length === 1
    ) {
      setMessage(
        "Product එකකට අවම වශයෙන් colour එකක් තිබිය යුතුයි."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "මේ colour variant එක remove කරන්නද?"
      );

    if (!confirmed) {
      return;
    }

    setVariants((current) =>
      current.filter(
        (_, variantIndex) =>
          variantIndex !== index
      )
    );

    setSelectedPreviewVariant(0);
    setSelectedPreviewImage(0);
  }

  function updateVariantName(
    index: number,
    value: string
  ) {
    setVariants((current) =>
      current.map(
        (
          variant,
          variantIndex
        ) =>
          variantIndex === index
            ? {
                ...variant,
                name: value,
              }
            : variant
      )
    );
  }

  function updateVariantHex(
    index: number,
    value: string
  ) {
    setVariants((current) =>
      current.map(
        (
          variant,
          variantIndex
        ) =>
          variantIndex === index
            ? {
                ...variant,
                hex: value,
              }
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
        (
          variant,
          currentVariantIndex
        ) => {
          if (
            currentVariantIndex !==
            variantIndex
          ) {
            return variant;
          }

          return {
            ...variant,

            images:
              variant.images.map(
                (
                  image,
                  currentImageIndex
                ) =>
                  currentImageIndex ===
                  imageIndex
                    ? value
                    : image
              ),
          };
        }
      )
    );

    setSelectedPreviewVariant(
      variantIndex
    );

    setSelectedPreviewImage(
      imageIndex
    );
  }

  function addPhotoInput(
    variantIndex: number
  ) {
    setVariants((current) =>
      current.map(
        (
          variant,
          currentVariantIndex
        ) =>
          currentVariantIndex ===
          variantIndex
            ? {
                ...variant,
                images: [
                  ...variant.images,
                  "",
                ],
              }
            : variant
      )
    );
  }

  function removePhotoInput(
    variantIndex: number,
    imageIndex: number
  ) {
    setVariants((current) =>
      current.map(
        (
          variant,
          currentVariantIndex
        ) => {
          if (
            currentVariantIndex !==
            variantIndex
          ) {
            return variant;
          }

          if (
            variant.images.length <= 1
          ) {
            return variant;
          }

          return {
            ...variant,

            images:
              variant.images.filter(
                (
                  _,
                  currentImageIndex
                ) =>
                  currentImageIndex !==
                  imageIndex
              ),
          };
        }
      )
    );

    setSelectedPreviewImage(0);
  }

  function updateVariantStock(
    variantIndex: number,
    size: ProductSize,
    value: string
  ) {
    const stockValue =
      Math.max(
        0,
        Math.floor(
          Number(value) || 0
        )
      );

    setVariants((current) =>
      current.map(
        (
          variant,
          currentVariantIndex
        ) =>
          currentVariantIndex ===
          variantIndex
            ? {
                ...variant,

                stock: {
                  ...variant.stock,

                  [size]:
                    stockValue,
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
      current.map(
        (
          feature,
          featureIndex
        ) =>
          featureIndex === index
            ? value
            : feature
      )
    );
  }

  function addFeature() {
    setFeatures((current) => [
      ...current,
      "",
    ]);
  }

  function removeFeature(
    index: number
  ) {
    if (
      features.length === 1
    ) {
      return;
    }

    setFeatures((current) =>
      current.filter(
        (_, featureIndex) =>
          featureIndex !== index
      )
    );
  }

  function updateTshirtMeasurement(
    size: ProductSize,
    field:
      | "chest"
      | "length"
      | "sleeve",
    value: string
  ) {
    const numberValue =
      Math.max(
        0,
        Number(value) || 0
      );

    setTshirtSizeGuide(
      (current) => ({
        ...current,

        [size]: {
          ...current[size],

          [field]:
            numberValue,
        },
      })
    );
  }

  function updatePantsMeasurement(
    size: ProductSize,
    field:
      | "waist"
      | "hip"
      | "length"
      | "thigh",
    value: string
  ) {
    const numberValue =
      Math.max(
        0,
        Number(value) || 0
      );

    setPantsSizeGuide(
      (current) => ({
        ...current,

        [size]: {
          ...current[size],

          [field]:
            numberValue,
        },
      })
    );
  }

  const variantsCode =
    variants
      .map(
        (
          variant,
          variantIndex
        ) => {
          const finalName =
            escapeText(
              variant.name
            ) ||
            `Colour ${
              variantIndex + 1
            }`;

          const variantSlug =
            createSlug(
              finalName
            ) ||
            `colour-${
              variantIndex + 1
            }`;

          const finalHex =
            variant.hex.trim() ||
            "#000000";

          const preparedImages =
            variant.images
              .map(
                createImagePath
              )
              .filter(Boolean);

          const finalImages =
            preparedImages.length >
            0
              ? preparedImages
              : [
                  "/images/product-image.jpg",
                ];

          const imagesCode =
            finalImages
              .map(
                (image) =>
                  `        "${image}",`
              )
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
        }
      )
      .join(",\n\n");

  const firstImagesCode =
    (
      firstVariantImages.length >
      0
        ? firstVariantImages
        : [
            "/images/product-image.jpg",
          ]
    )
      .map(
        (image) =>
          `    "${image}",`
      )
      .join("\n");

  const featureCode =
    features
      .filter(
        (feature) =>
          feature.trim() !== ""
      )
      .map(
        (feature) =>
          `    "${escapeText(
            feature
          )}",`
      )
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

  name: "${
    escapeText(name) ||
    "Product Name"
  }",

  shortName: "${
    escapeText(shortName) ||
    escapeText(name) ||
    "Short Name"
  }",

  productType: "${productType}",

  price: ${
    Number(price) || 0
  },

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
    "${escapeText(
      description
    )}",

  features: [
${featureCode}
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

  const deleteCode =
    originalProductSlug
      ? `// app/data/products.ts file එකේ products array එකෙන්
// slug "${originalProductSlug}" තියෙන සම්පූර්ණ product object එක delete කරන්න.

// JavaScript filter example:
const updatedProducts = products.filter(
  (product) =>
    product.slug !== "${originalProductSlug}"
);`
      : `// මුලින් EXISTING PRODUCT එකක් select කරන්න.
// ඊට පස්සේ delete instructions මෙතන පේනවා.`;

  function validateProduct() {
    if (!name.trim()) {
      setMessage(
        "Product name එක ඇතුළත් කරන්න."
      );

      return false;
    }

    if (!slug) {
      setMessage(
        "Product name එකෙන් valid slug එකක් හදන්න බැහැ."
      );

      return false;
    }

    if (
      Number(price) <= 0
    ) {
      setMessage(
        "හරි price එකක් ඇතුළත් කරන්න."
      );

      return false;
    }

    if (
      variants.length === 0
    ) {
      setMessage(
        "අවම වශයෙන් colour එකක් add කරන්න."
      );

      return false;
    }

    for (
      let index = 0;
      index < variants.length;
      index += 1
    ) {
      if (
        !variants[
          index
        ].name.trim()
      ) {
        setMessage(
          `Colour ${
            index + 1
          } name එක ඇතුළත් කරන්න.`
        );

        return false;
      }
    }

    setMessage("");

    return true;
  }

  async function copyGeneratedCode() {
    if (!validateProduct()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        generatedCode
      );

      setCopied(true);

      setMessage(
        adminMode === "edit"
          ? "Updated product code copy කළා."
          : "New product code copy කළා."
      );

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setMessage(
        "Code එක copy කරන්න බැරි වුණා."
      );
    }
  }

  async function copyDeleteCode() {
    if (
      !originalProductSlug
    ) {
      setMessage(
        "මුලින් existing product එකක් select කරන්න."
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        deleteCode
      );

      setDeleteCodeCopied(
        true
      );

      setMessage(
        "Delete instructions copy කළා."
      );

      window.setTimeout(() => {
        setDeleteCodeCopied(
          false
        );
      }, 2500);
    } catch {
      setMessage(
        "Delete code එක copy කරන්න බැරි වුණා."
      );
    }
  }

  const totalStock =
    variants.reduce(
      (
        productTotal,
        variant
      ) =>
        productTotal +
        productSizes.reduce(
          (
            variantTotal,
            size
          ) =>
            variantTotal +
            variant.stock[size],
          0
        ),
      0
    );

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
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

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-12 md:py-14">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
          DARKY T ADMIN
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          PRODUCT MANAGER
        </h1>

        <p className="mt-4 max-w-3xl leading-7 text-gray-600">
          New product එකක් create කරන්න හෝ existing
          product එකක් load කරලා edit කරන්න.
          Generated code එක තවමත්
          `app/data/products.ts` file එකට manually paste
          කරන්න ඕනේ.
        </p>

        {/* Admin Mode */}
        <div className="mt-8 grid gap-5 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
          <div>
            <label className="mb-2 block text-sm font-black">
              ADMIN MODE
            </label>

            <select
              value={adminMode}
              onChange={(event) => {
                const mode =
                  event.target
                    .value as AdminMode;

                if (
                  mode === "create"
                ) {
                  resetForm();
                } else {
                  setAdminMode(
                    "edit"
                  );
                }
              }}
              className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="create">
                CREATE NEW PRODUCT
              </option>

              <option value="edit">
                EDIT EXISTING PRODUCT
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black">
              EXISTING PRODUCT
            </label>

            <select
              value={
                selectedExistingSlug
              }
              disabled={
                adminMode !== "edit"
              }
              onChange={(event) =>
                loadExistingProduct(
                  event.target.value
                )
              }
              className="w-full border border-gray-300 bg-white px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                SELECT PRODUCT
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product.slug
                    }
                    value={
                      product.slug
                    }
                  >
                    {product.name} — Rs.{" "}
                    {product.price.toLocaleString()}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {message && (
          <div className="mt-5 border border-black bg-white px-5 py-4 text-sm font-bold">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Form */}
          <div className="space-y-8">
            {/* Product Details */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    PRODUCT DETAILS
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Mode:{" "}
                    <span className="font-black uppercase text-black">
                      {adminMode}
                    </span>
                  </p>
                </div>

                {originalProductSlug && (
                  <div className="bg-gray-100 px-4 py-3 text-sm">
                    Original slug:{" "}
                    <span className="font-black">
                      {
                        originalProductSlug
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    PRODUCT TYPE
                  </label>

                  <select
                    value={
                      productType
                    }
                    onChange={(event) =>
                      changeProductType(
                        event.target
                          .value as ProductType
                      )
                    }
                    className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
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
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Darky Essential Tee"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Generated slug:{" "}
                    <span className="font-bold text-black">
                      {slug ||
                        "product-slug"}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    SHORT NAME
                  </label>

                  <input
                    value={shortName}
                    onChange={(event) =>
                      setShortName(
                        event.target.value
                      )
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
                      setPrice(
                        event.target.value
                      )
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

            {/* Features */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-black">
                  PRODUCT FEATURES
                </h2>

                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-black px-4 py-3 text-sm font-black text-white"
                >
                  + ADD FEATURE
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {features.map(
                  (
                    feature,
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <input
                        value={
                          feature
                        }
                        onChange={(
                          event
                        ) =>
                          updateFeature(
                            index,
                            event.target
                              .value
                          )
                        }
                        placeholder={`Feature ${
                          index + 1
                        }`}
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeFeature(
                            index
                          )
                        }
                        className="border border-red-600 px-4 font-black text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        ×
                      </button>
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
                    Colours, photos සහ size stock manage කරන්න.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addNewColour
                  }
                  className="bg-black px-5 py-3 text-sm font-black text-white"
                >
                  + ADD COLOUR
                </button>
              </div>

              <div className="mt-7 space-y-8">
                {variants.map(
                  (
                    variant,
                    variantIndex
                  ) => (
                    <div
                      key={
                        variantIndex
                      }
                      className="border border-gray-300 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="h-10 w-10 rounded-full border border-gray-300"
                            style={{
                              backgroundColor:
                                variant.hex,
                            }}
                          />

                          <div>
                            <h3 className="text-xl font-black">
                              COLOUR{" "}
                              {variantIndex +
                                1}
                            </h3>

                            <p className="text-sm text-gray-500">
                              Stock:{" "}
                              {productSizes.reduce(
                                (
                                  total,
                                  size
                                ) =>
                                  total +
                                  variant
                                    .stock[
                                    size
                                  ],
                                0
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
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
                            className="border border-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"
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
                            className="border border-red-600 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-bold">
                            COLOUR NAME
                          </label>

                          <input
                            value={
                              variant.name
                            }
                            onChange={(
                              event
                            ) =>
                              updateVariantName(
                                variantIndex,
                                event.target
                                  .value
                              )
                            }
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold">
                            COLOUR
                          </label>

                          <div className="flex gap-3">
                            <input
                              type="color"
                              value={
                                variant.hex
                              }
                              onChange={(
                                event
                              ) =>
                                updateVariantHex(
                                  variantIndex,
                                  event.target
                                    .value
                                )
                              }
                              className="h-12 w-16 border border-gray-300"
                            />

                            <input
                              value={
                                variant.hex
                              }
                              onChange={(
                                event
                              ) =>
                                updateVariantHex(
                                  variantIndex,
                                  event.target
                                    .value
                                )
                              }
                              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                        <h4 className="font-black">
                          PHOTOS
                        </h4>

                        <button
                          type="button"
                          onClick={() =>
                            addPhotoInput(
                              variantIndex
                            )
                          }
                          className="border border-black px-4 py-2 text-sm font-bold"
                        >
                          + ADD PHOTO
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {variant.images.map(
                          (
                            image,
                            imageIndex
                          ) => (
                            <div
                              key={
                                imageIndex
                              }
                            >
                              <label className="mb-2 block text-sm font-bold">
                                PHOTO{" "}
                                {imageIndex +
                                  1}
                              </label>

                              <div className="flex gap-2">
                                <input
                                  value={
                                    image
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateVariantImage(
                                      variantIndex,
                                      imageIndex,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="image-name.jpg"
                                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removePhotoInput(
                                      variantIndex,
                                      imageIndex
                                    )
                                  }
                                  className="border border-red-600 px-3 font-black text-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <h4 className="mt-7 font-black">
                        STOCK BY SIZE
                      </h4>

                      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {productSizes.map(
                          (size) => (
                            <div
                              key={size}
                            >
                              <label className="mb-2 block text-sm font-bold">
                                {size}
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={
                                  variant
                                    .stock[
                                    size
                                  ]
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateVariantStock(
                                    variantIndex,
                                    size,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Size Guide */}
            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                {productType ===
                "tshirt"
                  ? "T-SHIRT SIZE GUIDE"
                  : "PANTS SIZE GUIDE"}
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Measurements inches වලින් දාන්න.
              </p>

              <div className="mt-6 space-y-5">
                {productSizes.map(
                  (size) => (
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
                          ).map(
                            (field) => (
                              <div
                                key={
                                  field
                                }
                              >
                                <label className="mb-2 block text-sm font-bold uppercase">
                                  {
                                    field
                                  }
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={
                                    tshirtSizeGuide[
                                      size
                                    ][
                                      field
                                    ]
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updateTshirtMeasurement(
                                      size,
                                      field,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                              </div>
                            )
                          )}
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
                          ).map(
                            (field) => (
                              <div
                                key={
                                  field
                                }
                              >
                                <label className="mb-2 block text-sm font-bold uppercase">
                                  {
                                    field
                                  }
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={
                                    pantsSizeGuide[
                                      size
                                    ][
                                      field
                                    ]
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    updatePantsMeasurement(
                                      size,
                                      field,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="w-full border border-black bg-white px-6 py-4 font-black hover:bg-black hover:text-white"
            >
              RESET FORM
            </button>
          </div>

          {/* Preview and Code */}
          <div className="space-y-8 lg:sticky lg:top-6 lg:h-fit">
            <div className="bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
                    PRODUCT PREVIEW
                  </p>

                  <p className="mt-2 text-sm font-bold">
                    Total stock:{" "}
                    {totalStock}
                  </p>
                </div>

                <span className="bg-black px-3 py-2 text-xs font-black text-white">
                  {productType ===
                  "tshirt"
                    ? "T-SHIRT"
                    : "PANTS"}
                </span>
              </div>

              <div className="relative mt-6 overflow-hidden bg-gray-100">
                <img
                  src={previewImage}
                  alt={
                    name ||
                    "Product preview"
                  }
                  className="aspect-square w-full object-cover"
                />

                {totalStock === 0 && (
                  <span className="absolute left-3 top-3 bg-red-600 px-3 py-2 text-xs font-black text-white">
                    SOLD OUT
                  </span>
                )}
              </div>

              {currentPreviewImages.length >
                1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {currentPreviewImages.map(
                    (
                      image,
                      imageIndex
                    ) => (
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
                            imageIndex +
                            1
                          }`}
                          className="aspect-square w-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>
              )}

              <h2 className="mt-6 text-3xl font-black uppercase">
                {name ||
                  "PRODUCT NAME"}
              </h2>

              <p className="mt-2 text-xl font-black">
                Rs.{" "}
                {(
                  Number(price) || 0
                ).toLocaleString()}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {variants.map(
                  (
                    variant,
                    index
                  ) => (
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
                      className={`h-11 w-11 rounded-full border-2 p-1 ${
                        selectedPreviewVariant ===
                        index
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full border"
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
                {features
                  .filter(Boolean)
                  .map(
                    (
                      feature,
                      index
                    ) => (
                      <p
                        key={index}
                      >
                        ✓{" "}
                        {
                          feature
                        }
                      </p>
                    )
                  )}
              </div>

              <p className="mt-6 break-all text-sm font-bold">
                /product/
                {slug ||
                  "product-slug"}
              </p>
            </div>

            {/* Generated Code */}
            <div className="bg-black p-6 text-white shadow-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    {adminMode ===
                    "edit"
                      ? "UPDATED PRODUCT CODE"
                      : "NEW PRODUCT CODE"}
                  </h2>

                  {adminMode ===
                    "edit" && (
                    <p className="mt-2 text-sm text-gray-400">
                      products.ts එකේ old object එක replace කරන්න.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    copyGeneratedCode
                  }
                  className="bg-white px-5 py-3 font-black text-black hover:bg-gray-200"
                >
                  {copied
                    ? "COPIED ✓"
                    : "COPY CODE"}
                </button>
              </div>

              <pre className="mt-6 max-h-[900px] overflow-auto whitespace-pre-wrap border border-white/20 bg-gray-950 p-5 text-sm leading-7 text-gray-200">
                <code>
                  {generatedCode}
                </code>
              </pre>
            </div>

            {/* Delete Product */}
            <div className="border border-red-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black text-red-600">
                DELETE PRODUCT
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                මේ Admin page එක database එකකට connect වෙලා නැති නිසා
                delete button එකෙන් products.ts file එක automatically
                වෙනස් කරන්න බැහැ. Existing product object එක
                `products` array එකෙන් manually remove කරන්න.
              </p>

              <pre className="mt-5 overflow-auto whitespace-pre-wrap border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700">
                <code>
                  {deleteCode}
                </code>
              </pre>

              <button
                type="button"
                disabled={
                  !originalProductSlug
                }
                onClick={
                  copyDeleteCode
                }
                className={`mt-5 w-full px-5 py-4 font-black ${
                  originalProductSlug
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                {deleteCodeCopied
                  ? "DELETE INSTRUCTIONS COPIED ✓"
                  : "COPY DELETE INSTRUCTIONS"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}