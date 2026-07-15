import { createClient } from "@/utils/supabase/client";

import type {
  ColorVariant,
  PantsSizeGuide,
  Product,
  ProductSize,
  ProductStock,
  TshirtSizeGuide,
} from "@/app/data/products";

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
  product_type:
    | "tshirt"
    | "pants";
  price: number;
  image: string;
  images: unknown;
  description: string;
  features: unknown;
  size_guide: unknown;
  product_variants:
    | DatabaseVariantRow[]
    | null;
};

const productSizes: ProductSize[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
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
  stockRows:
    | DatabaseStockRow[]
    | null
): ProductStock {
  const stock =
    createEmptyStock();

  if (!stockRows) {
    return stock;
  }

  stockRows.forEach((row) => {
    if (
      productSizes.includes(
        row.size
      )
    ) {
      stock[row.size] =
        Math.max(
          0,
          Number(row.quantity) || 0
        );
    }
  });

  return stock;
}

function convertVariant(
  variant: DatabaseVariantRow
): ColorVariant {
  return {
    name: variant.name,
    slug: variant.slug,
    hex:
      variant.hex ||
      "#000000",

    images:
      convertImages(
        variant.images
      ),

    stock:
      convertStock(
        variant.product_stock
      ),
  };
}

function convertProduct(
  row: DatabaseProductRow
): Product {
  const variants =
    (
      row.product_variants || []
    ).map(convertVariant);

  const firstVariant =
    variants[0];

  const fallbackStock =
    createEmptyStock();

  const productImages =
    convertImages(row.images);

  const mainImage =
    row.image ||
    productImages[0] ||
    firstVariant?.images[0] ||
    "/images/product-image.jpg";

  const commonProduct = {
    id: row.id,
    slug: row.slug,
    name: row.name,

    shortName:
      row.short_name ||
      row.name,

    price:
      Number(row.price) || 0,

    image: mainImage,

    images:
      productImages.length > 0
        ? productImages
        : firstVariant?.images ||
          [mainImage],

    stock:
      firstVariant?.stock ||
      fallbackStock,

    description:
      row.description || "",

    features:
      convertFeatures(
        row.features
      ),

    variants,
  };

  if (
    row.product_type ===
    "pants"
  ) {
    return {
      ...commonProduct,

      productType: "pants",

      sizeGuide:
        row.size_guide as PantsSizeGuide,
    };
  }

  return {
    ...commonProduct,

    productType: "tshirt",

    sizeGuide:
      row.size_guide as TshirtSizeGuide,
  };
}

export async function fetchProductsFromSupabase(): Promise<
  Product[]
> {
  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      short_name,
      product_type,
      price,
      image,
      images,
      description,
      features,
      size_guide,
      product_variants (
        id,
        name,
        slug,
        hex,
        images,
        product_stock (
          size,
          quantity
        )
      )
    `)
    .eq("is_active", true)
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    console.error(
      "Supabase product load error:",
      error.message
    );

    throw new Error(
      error.message
    );
  }

  return (
    (data as DatabaseProductRow[] | null) ||
    []
  ).map(convertProduct);
}