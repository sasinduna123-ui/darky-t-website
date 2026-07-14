export const productSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;

export type ProductSize = (typeof productSizes)[number];

export type ProductType = "tshirt" | "pants";

export type ProductStock = Record<ProductSize, number>;

export type TshirtMeasurement = {
  chest: number;
  length: number;
  sleeve: number;
};

export type PantsMeasurement = {
  waist: number;
  hip: number;
  length: number;
  thigh: number;
};

export type TshirtSizeGuide = Record<
  ProductSize,
  TshirtMeasurement
>;

export type PantsSizeGuide = Record<
  ProductSize,
  PantsMeasurement
>;

type ProductBase = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  price: number;
  image: string;
  description: string;
  stock: ProductStock;
  features: string[];
};

export type TshirtProduct = ProductBase & {
  productType: "tshirt";
  sizeGuide: TshirtSizeGuide;
};

export type PantsProduct = ProductBase & {
  productType: "pants";
  sizeGuide: PantsSizeGuide;
};

export type Product = TshirtProduct | PantsProduct;

export const defaultTshirtSizeGuide: TshirtSizeGuide = {
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

export const defaultPantsSizeGuide: PantsSizeGuide = {
  XS: {
    waist: 26,
    hip: 36,
    length: 38,
    thigh: 20,
  },
  S: {
    waist: 28,
    hip: 38,
    length: 39,
    thigh: 21,
  },
  M: {
    waist: 30,
    hip: 40,
    length: 40,
    thigh: 22,
  },
  L: {
    waist: 32,
    hip: 42,
    length: 41,
    thigh: 23,
  },
  XL: {
    waist: 34,
    hip: 44,
    length: 42,
    thigh: 24,
  },
  XXL: {
    waist: 36,
    hip: 46,
    length: 43,
    thigh: 25,
  },
};

export const products: Product[] = [
  {
    id: "black-tee",
    slug: "black-tee",
    name: "Essential Black Tee",
    shortName: "Black Tee",
    productType: "tshirt",
    price: 3650,
    image: "/images/TSHIRT1.jpg",
    description:
      "Premium oversized black T-shirt made with 240 GSM heavy cotton. Designed for comfort, durability and a bold streetwear look.",
    stock: {
      XS: 2,
      S: 4,
      M: 6,
      L: 3,
      XL: 1,
      XXL: 0,
    },
    features: [
      "240 GSM heavy cotton",
      "Premium oversized fit",
      "High-quality print and finishing",
      "Islandwide delivery",
    ],
    sizeGuide: defaultTshirtSizeGuide,
  },

  {
    id: "white-tee",
    slug: "white-tee",
    name: "Heavy Cotton White Tee",
    shortName: "White Tee",
    productType: "tshirt",
    price: 3650,
    image: "/images/TSHIRT2.jpg",
    description:
      "Premium oversized white T-shirt made with 240 GSM heavy cotton. Designed for comfort, durability and a clean streetwear look.",
    stock: {
      XS: 3,
      S: 5,
      M: 7,
      L: 4,
      XL: 2,
      XXL: 0,
    },
    features: [
      "240 GSM heavy cotton",
      "Premium oversized fit",
      "High-quality print and finishing",
      "Islandwide delivery",
    ],
    sizeGuide: defaultTshirtSizeGuide,
  },

  {
    id: "grey-tee",
    slug: "grey-tee",
    name: "Dark Grey Oversized Tee",
    shortName: "Grey Tee",
    productType: "tshirt",
    price: 3650,
    image: "/images/TSHIRT3.jpg",
    description:
      "Premium oversized dark grey T-shirt made with 240 GSM heavy cotton. Designed for comfort, durability and a bold streetwear look.",
    stock: {
      XS: 2,
      S: 4,
      M: 6,
      L: 5,
      XL: 2,
      XXL: 0,
    },
    features: [
      "240 GSM heavy cotton",
      "Premium oversized fit",
      "High-quality print and finishing",
      "Islandwide delivery",
    ],
    sizeGuide: defaultTshirtSizeGuide,
  },

  {
    id: "red-tee",
    slug: "red-tee",
    name: "Red Oversized Tee",
    shortName: "Red Tee",
    productType: "tshirt",
    price: 3650,
    image: "/images/red-tee.jpg",
    description:
      "Premium oversized red T-shirt made with 240 GSM heavy cotton. Designed for comfort, durability and a bold streetwear look.",
    stock: {
      XS: 2,
      S: 4,
      M: 6,
      L: 3,
      XL: 2,
      XXL: 0,
    },
    features: [
      "240 GSM heavy cotton",
      "Premium oversized fit",
      "High-quality print and finishing",
      "Islandwide delivery",
    ],
    sizeGuide: defaultTshirtSizeGuide,
  },

  // Sample pants product
  {
    id: "black-cargo-pants",
    slug: "black-cargo-pants",
    name: "Black Cargo Pants",
    shortName: "Cargo Pants",
    productType: "pants",
    price: 4950,
    image: "/images/Mens Bottom.jpg",
    description:
      "Premium black cargo pants designed for comfort, durability and a modern streetwear look.",
    stock: {
      XS: 2,
      S: 4,
      M: 5,
      L: 4,
      XL: 2,
      XXL: 1,
    },
    features: [
      "Premium durable fabric",
      "Relaxed streetwear fit",
      "Multiple utility pockets",
      "Islandwide delivery",
    ],
    sizeGuide: defaultPantsSizeGuide,
  },
];

export function getProductBySlug(
  slug: string
): Product | undefined {
  return products.find(
    (product) => product.slug === slug
  );
}