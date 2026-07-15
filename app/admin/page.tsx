"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  defaultPantsSizeGuide,
  defaultTshirtSizeGuide,
  productSizes,
  type PantsSizeGuide,
  type ProductSize,
  type ProductStock,
  type ProductType,
  type TshirtSizeGuide,
} from "@/app/data/products";

type AdminMode =
  | "create"
  | "edit";

type ColourVariantForm = {
  name: string;
  hex: string;
  images: string[];
  stock: ProductStock;
};

type DatabaseStockRow = {
  size: ProductSize;
  quantity: number;
};

type DatabaseVariantRow = {
  id: string;
  name: string;
  slug: string;
  hex: string;
  images: unknown;
  product_stock:
    | DatabaseStockRow[]
    | null;
};

type DatabaseProductRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  product_type: ProductType;
  price: number;
  image: string;
  images: unknown;
  description: string;
  features: unknown;
  size_guide: unknown;
  is_active: boolean;
  product_variants:
    | DatabaseVariantRow[]
    | null;
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
    images: [
      "",
      "",
      "",
      "",
    ],
    stock:
      createEmptyStock(),
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

function createSlug(
  value: string
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createImagePath(
  value: string
) {
  const cleanValue =
    value.trim();

  if (!cleanValue) {
    return "";
  }

  if (
    cleanValue.startsWith(
      "/images/"
    ) ||
    cleanValue.startsWith(
      "http://"
    ) ||
    cleanValue.startsWith(
      "https://"
    )
  ) {
    return cleanValue;
  }

  return `/images/${cleanValue}`;
}

function convertImages(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function convertFeatures(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string"
  );
}

function convertStock(
  rows:
    | DatabaseStockRow[]
    | null
): ProductStock {
  const stock =
    createEmptyStock();

  if (!rows) {
    return stock;
  }

  rows.forEach((row) => {
    if (
      productSizes.includes(
        row.size
      )
    ) {
      stock[row.size] =
        Math.max(
          0,
          Number(
            row.quantity
          ) || 0
        );
    }
  });

  return stock;
}

export default function AdminPage() {
  const [
    adminPassword,
    setAdminPassword,
  ] = useState("");

  const [
    isLoggedIn,
    setIsLoggedIn,
  ] = useState(false);

  const [
    loginLoading,
    setLoginLoading,
  ] = useState(false);

  const [
    products,
    setProducts,
  ] =
    useState<DatabaseProductRow[]>(
      []
    );

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error"
  >("success");

  const [
    adminMode,
    setAdminMode,
  ] =
    useState<AdminMode>(
      "create"
    );

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
    useState<ProductType>(
      "tshirt"
    );

  const [
    name,
    setName,
  ] = useState("");

  const [
    shortName,
    setShortName,
  ] = useState("");

  const [
    price,
    setPrice,
  ] = useState("3490");

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
  ] =
    useState<TshirtSizeGuide>(
      cloneTshirtSizeGuide(
        defaultTshirtSizeGuide
      )
    );

  const [
    pantsSizeGuide,
    setPantsSizeGuide,
  ] =
    useState<PantsSizeGuide>(
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
            Number(
              variant.stock[
                size
              ] || 0
            ),
          0
        ),
      0
    );

  function showMessage(
    text: string,
    type:
      | "success"
      | "error" =
      "success"
  ) {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => {
      setMessage("");
    }, 5000);
  }

  function resetForm() {
    setAdminMode("create");
    setSelectedExistingSlug("");
    setOriginalProductSlug("");

    setProductType(
      "tshirt"
    );

    setName("");
    setShortName("");
    setPrice("3490");
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

    setSelectedPreviewVariant(
      0
    );

    setSelectedPreviewImage(
      0
    );
  }

  function changeProductType(
    type: ProductType
  ) {
    setProductType(type);

    if (type === "tshirt") {
      setPrice("3490");

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

  async function loadProducts(
    password = adminPassword
  ) {
    setProductsLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/products",
          {
            method: "GET",

            headers: {
              "x-darky-admin-password":
                password,
            },

            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Products load කරන්න බැරි වුණා."
        );
      }

      setProducts(
        result.products || []
      );

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Products load කරන්න බැරි වුණා.";

      showMessage(
        errorMessage,
        "error"
      );

      return false;
    } finally {
      setProductsLoading(false);
    }
  }

  async function loginAdmin() {
    if (
      !adminPassword.trim()
    ) {
      showMessage(
        "Admin password එක ඇතුළත් කරන්න.",
        "error"
      );

      return;
    }

    setLoginLoading(true);

    const success =
      await loadProducts(
        adminPassword
      );

    setLoginLoading(false);

    if (!success) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    sessionStorage.setItem(
      "darky-admin-password",
      adminPassword
    );

    showMessage(
      "Admin login successful."
    );
  }

  function logoutAdmin() {
    sessionStorage.removeItem(
      "darky-admin-password"
    );

    setAdminPassword("");
    setIsLoggedIn(false);
    setProducts([]);
    resetForm();
  }

  useEffect(() => {
    const savedPassword =
      sessionStorage.getItem(
        "darky-admin-password"
      );

    if (!savedPassword) {
      return;
    }

    setAdminPassword(
      savedPassword
    );

    async function restoreLogin() {
      setLoginLoading(true);

      const success = await loadProducts(
  savedPassword ?? ""
);

      setLoginLoading(false);

      if (success) {
        setIsLoggedIn(true);
      } else {
        sessionStorage.removeItem(
          "darky-admin-password"
        );
      }
    }

    restoreLogin();
  }, []);

  function loadExistingProduct(
    productSlug: string
  ) {
    setSelectedExistingSlug(
      productSlug
    );

    if (!productSlug) {
      resetForm();
      setAdminMode("edit");
      return;
    }

    const product =
      products.find(
        (currentProduct) =>
          currentProduct.slug ===
          productSlug
      );

    if (!product) {
      showMessage(
        "Product එක හොයාගන්න බැහැ.",
        "error"
      );

      return;
    }

    setAdminMode("edit");

    setOriginalProductSlug(
      product.slug
    );

    setProductType(
      product.product_type
    );

    setName(product.name);

    setShortName(
      product.short_name ||
        product.name
    );

    setPrice(
      String(product.price)
    );

    setDescription(
      product.description || ""
    );

    const loadedFeatures =
      convertFeatures(
        product.features
      );

    setFeatures(
      loadedFeatures.length > 0
        ? loadedFeatures
        : [""]
    );

    const loadedVariants =
      (
        product.product_variants ||
        []
      ).map(
        (variant) => {
          const images =
            convertImages(
              variant.images
            );

          return {
            name:
              variant.name,

            hex:
              variant.hex ||
              "#000000",

            images:
              images.length > 0
                ? images
                : [""],

            stock:
              convertStock(
                variant.product_stock
              ),
          };
        }
      );

    setVariants(
      loadedVariants.length > 0
        ? loadedVariants
        : [
            createEmptyVariant(),
          ]
    );

    if (
      product.product_type ===
      "tshirt"
    ) {
      setTshirtSizeGuide(
        cloneTshirtSizeGuide(
          product.size_guide as TshirtSizeGuide
        )
      );
    } else {
      setPantsSizeGuide(
        clonePantsSizeGuide(
          product.size_guide as PantsSizeGuide
        )
      );
    }

    setSelectedPreviewVariant(
      0
    );

    setSelectedPreviewImage(
      0
    );

    showMessage(
      `${product.name} edit කරන්න load කළා.`
    );
  }

  function addNewColour() {
    setVariants(
      (current) => [
        ...current,
        createEmptyVariant(
          `Colour ${
            current.length + 1
          }`
        ),
      ]
    );

    setSelectedPreviewVariant(
      variants.length
    );

    setSelectedPreviewImage(
      0
    );
  }

  function removeColour(
    index: number
  ) {
    if (
      variants.length <= 1
    ) {
      showMessage(
        "අවම වශයෙන් colour එකක් තිබිය යුතුයි.",
        "error"
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

    setVariants(
      (current) =>
        current.filter(
          (
            _,
            variantIndex
          ) =>
            variantIndex !==
            index
        )
    );

    setSelectedPreviewVariant(
      0
    );

    setSelectedPreviewImage(
      0
    );
  }

  function updateVariantName(
    index: number,
    value: string
  ) {
    setVariants(
      (current) =>
        current.map(
          (
            variant,
            variantIndex
          ) =>
            variantIndex ===
            index
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
    setVariants(
      (current) =>
        current.map(
          (
            variant,
            variantIndex
          ) =>
            variantIndex ===
            index
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
    setVariants(
      (current) =>
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
    setVariants(
      (current) =>
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
    setVariants(
      (current) =>
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
              variant.images
                .length <= 1
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

    setSelectedPreviewImage(
      0
    );
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

    setVariants(
      (current) =>
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
    setFeatures(
      (current) =>
        current.map(
          (
            feature,
            featureIndex
          ) =>
            featureIndex ===
            index
              ? value
              : feature
        )
    );
  }

  function addFeature() {
    setFeatures(
      (current) => [
        ...current,
        "",
      ]
    );
  }

  function removeFeature(
    index: number
  ) {
    if (
      features.length <= 1
    ) {
      return;
    }

    setFeatures(
      (current) =>
        current.filter(
          (
            _,
            featureIndex
          ) =>
            featureIndex !==
            index
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

  function validateProduct() {
    if (!name.trim()) {
      showMessage(
        "Product name එක ඇතුළත් කරන්න.",
        "error"
      );

      return false;
    }

    if (!slug) {
      showMessage(
        "Valid product slug එකක් හදන්න බැහැ.",
        "error"
      );

      return false;
    }

    if (
      Number(price) <= 0
    ) {
      showMessage(
        "හරි price එකක් ඇතුළත් කරන්න.",
        "error"
      );

      return false;
    }

    if (
      variants.length === 0
    ) {
      showMessage(
        "අවම වශයෙන් colour එකක් add කරන්න.",
        "error"
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
        showMessage(
          `Colour ${
            index + 1
          } name එක ඇතුළත් කරන්න.`,
          "error"
        );

        return false;
      }
    }

    return true;
  }

  function buildProductPayload() {
    const preparedVariants =
      variants.map(
        (
          variant,
          index
        ) => {
          const preparedImages =
            variant.images
              .map(
                createImagePath
              )
              .filter(Boolean);

          return {
            name:
              variant.name.trim(),

            slug:
              createSlug(
                variant.name
              ) ||
              `colour-${
                index + 1
              }`,

            hex:
              variant.hex.trim() ||
              "#000000",

            images:
              preparedImages.length >
              0
                ? preparedImages
                : [
                    "/images/product-image.jpg",
                  ],

            stock:
              variant.stock,
          };
        }
      );

    const firstImages =
      preparedVariants[0]
        ?.images || [
        "/images/product-image.jpg",
      ];

    return {
      originalSlug:
        originalProductSlug ||
        undefined,

      slug,

      name:
        name.trim(),

      shortName:
        shortName.trim() ||
        name.trim(),

      productType,

      price:
        Number(price),

      image:
        firstImages[0],

      images:
        firstImages,

      description:
        description.trim(),

      features:
        features
          .map(
            (feature) =>
              feature.trim()
          )
          .filter(Boolean),

      sizeGuide:
        productType ===
        "tshirt"
          ? tshirtSizeGuide
          : pantsSizeGuide,

      variants:
        preparedVariants,
    };
  }

  async function saveProduct() {
    if (!validateProduct()) {
      return;
    }

    if (
      adminMode === "edit" &&
      !originalProductSlug
    ) {
      showMessage(
        "මුලින් existing product එකක් select කරන්න.",
        "error"
      );

      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/admin/products",
          {
            method:
              adminMode ===
              "edit"
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",

              "x-darky-admin-password":
                adminPassword,
            },

            body:
              JSON.stringify({
                product:
                  buildProductPayload(),
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Product save කරන්න බැරි වුණා."
        );
      }

      showMessage(
        result.message ||
          "Product save කළා."
      );

      await loadProducts();

      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Product save කරන්න බැරි වුණා.";

      showMessage(
        errorMessage,
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct() {
    if (
      !originalProductSlug
    ) {
      showMessage(
        "Delete කරන්න product එකක් select කරන්න.",
        "error"
      );

      return;
    }

    const confirmed =
      window.confirm(
        `${name} product එක සම්පූර්ණයෙන් delete කරන්නද?`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response =
        await fetch(
          "/api/admin/products",
          {
            method:
              "DELETE",

            headers: {
              "Content-Type":
                "application/json",

              "x-darky-admin-password":
                adminPassword,
            },

            body:
              JSON.stringify({
                slug:
                  originalProductSlug,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Product delete කරන්න බැරි වුණා."
        );
      }

      showMessage(
        result.message ||
          "Product delete කළා."
      );

      await loadProducts();

      resetForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Product delete කරන්න බැරි වුණා.";

      showMessage(
        errorMessage,
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
        <div className="w-full max-w-md border border-white/20 bg-white p-7 text-black shadow-2xl sm:p-10">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
            DARKY T
          </p>

          <h1 className="mt-3 text-4xl font-black">
            ADMIN LOGIN
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            Product manager එක open කරන්න admin password එක ඇතුළත් කරන්න.
          </p>

          {message && (
            <div
              className={`mt-5 border px-4 py-3 text-sm font-bold ${
                messageType ===
                "error"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-green-300 bg-green-50 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              loginAdmin();
            }}
            className="mt-7"
          >
            <label className="mb-2 block text-sm font-black">
              ADMIN PASSWORD
            </label>

            <input
              type="password"
              value={
                adminPassword
              }
              onChange={(event) =>
                setAdminPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
              placeholder="Enter admin password"
              className="w-full border border-gray-300 px-4 py-4 outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={
                loginLoading
              }
              className={`mt-5 w-full px-6 py-4 font-black text-white ${
                loginLoading
                  ? "cursor-not-allowed bg-gray-500"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loginLoading
                ? "CHECKING..."
                : "LOGIN"}
            </button>
          </form>

          <a
            href="/"
            className="mt-6 block text-center text-sm font-bold underline underline-offset-4"
          >
            BACK TO HOME
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <nav className="flex flex-wrap items-center justify-between gap-4 bg-black px-5 py-5 text-white md:px-12">
        <a
          href="/"
          className="text-xl font-black tracking-[0.25em] sm:text-2xl"
        >
          DARKY T
        </a>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-sm font-bold hover:text-gray-300"
          >
            HOME
          </a>

          <button
            type="button"
            onClick={
              logoutAdmin
            }
            className="border border-white px-4 py-2 text-sm font-black hover:bg-white hover:text-black"
          >
            LOGOUT
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-12 md:py-14">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
          DARKY T ADMIN
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">
              PRODUCT MANAGER
            </h1>

            <p className="mt-4 max-w-3xl leading-7 text-gray-600">
              Products Supabase database එකට automatically add, update සහ delete කරන්න.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadProducts()
            }
            disabled={
              productsLoading
            }
            className="bg-black px-6 py-4 font-black text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {productsLoading
              ? "LOADING..."
              : "REFRESH PRODUCTS"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-6 border px-5 py-4 text-sm font-bold ${
              messageType ===
              "error"
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-green-300 bg-green-50 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

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
                  mode ===
                  "create"
                ) {
                  resetForm();
                } else {
                  resetForm();
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
              className="w-full border border-gray-300 bg-white px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                SELECT PRODUCT
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product.id
                    }
                    value={
                      product.slug
                    }
                  >
                    {product.name} — Rs.{" "}
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
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
                      PANTS
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
                        event.target
                          .value
                      )
                    }
                    placeholder="Example: Monster"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Product URL:{" "}
                    <strong>
                      /product/
                      {slug ||
                        "product-slug"}
                    </strong>
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    SHORT NAME
                  </label>

                  <input
                    value={
                      shortName
                    }
                    onChange={(event) =>
                      setShortName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Example: Monster"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    PRICE
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target
                          .value
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
                    value={
                      description
                    }
                    onChange={(event) =>
                      setDescription(
                        event.target
                          .value
                      )
                    }
                    rows={5}
                    className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

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
                        onChange={(event) =>
                          updateFeature(
                            index,
                            event.target
                              .value
                          )
                        }
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeFeature(
                            index
                          )
                        }
                        className="border border-red-600 px-4 font-black text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    COLOUR VARIANTS
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Colours, images සහ stock manage කරන්න.
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
                            className="h-10 w-10 rounded-full border"
                            style={{
                              backgroundColor:
                                variant.hex,
                            }}
                          />

                          <h3 className="text-xl font-black">
                            COLOUR{" "}
                            {variantIndex +
                              1}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeColour(
                              variantIndex
                            )
                          }
                          className="border border-red-600 px-4 py-2 text-sm font-bold text-red-600"
                        >
                          REMOVE
                        </button>
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
                            onChange={(event) =>
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
                              onChange={(event) =>
                                updateVariantHex(
                                  variantIndex,
                                  event.target
                                    .value
                                )
                              }
                              className="h-12 w-16 border"
                            />

                            <input
                              value={
                                variant.hex
                              }
                              onChange={(event) =>
                                updateVariantHex(
                                  variantIndex,
                                  event.target
                                    .value
                                )
                              }
                              className="w-full border border-gray-300 px-4 py-3"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-7 flex items-center justify-between gap-4">
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
                                  onChange={(event) =>
                                    updateVariantImage(
                                      variantIndex,
                                      imageIndex,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  placeholder="tshirt-white-1.jpg"
                                  className="w-full border border-gray-300 px-4 py-3"
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
                                onChange={(event) =>
                                  updateVariantStock(
                                    variantIndex,
                                    size,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className="w-full border border-gray-300 px-4 py-3"
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

            <div className="bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                {productType ===
                "tshirt"
                  ? "T-SHIRT SIZE GUIDE"
                  : "PANTS SIZE GUIDE"}
              </h2>

              <div className="mt-6 space-y-5">
                {productSizes.map(
                  (size) => (
                    <div
                      key={size}
                      className="border border-gray-200 p-5"
                    >
                      <h3 className="font-black">
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
                                  {field}
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
                                  onChange={(event) =>
                                    updateTshirtMeasurement(
                                      size,
                                      field,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-3"
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
                                  {field}
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
                                  onChange={(event) =>
                                    updatePantsMeasurement(
                                      size,
                                      field,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  className="w-full border border-gray-300 px-4 py-3"
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

                {totalStock ===
                  0 && (
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
                          alt="Preview"
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
                  Number(price) ||
                  0
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
                      <p key={index}>
                        ✓ {feature}
                      </p>
                    )
                  )}
              </div>
            </div>

            <div className="bg-black p-6 text-white shadow-sm md:p-8">
              <h2 className="text-2xl font-black">
                {adminMode ===
                "edit"
                  ? "UPDATE PRODUCT"
                  : "SAVE NEW PRODUCT"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Button එක click කළාම product data Supabase database එකට automatically save වෙනවා.
              </p>

              <button
                type="button"
                onClick={
                  saveProduct
                }
                disabled={saving}
                className={`mt-6 w-full px-6 py-4 font-black ${
                  saving
                    ? "cursor-not-allowed bg-gray-500"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {saving
                  ? "SAVING..."
                  : adminMode ===
                      "edit"
                    ? "UPDATE PRODUCT"
                    : "SAVE PRODUCT"}
              </button>
            </div>

            {adminMode ===
              "edit" && (
              <div className="border border-red-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-black text-red-600">
                  DELETE PRODUCT
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  මේකෙන් product එක, colours සහ stock data සියල්ල database එකෙන් delete වෙනවා.
                </p>

                <button
                  type="button"
                  onClick={
                    deleteProduct
                  }
                  disabled={
                    deleting ||
                    !originalProductSlug
                  }
                  className={`mt-6 w-full px-6 py-4 font-black ${
                    deleting ||
                    !originalProductSlug
                      ? "cursor-not-allowed bg-gray-300 text-gray-500"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {deleting
                    ? "DELETING..."
                    : "DELETE PRODUCT"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}