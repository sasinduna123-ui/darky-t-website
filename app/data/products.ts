export const productSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;

export type ProductSize =
  (typeof productSizes)[number];

/*
  productType කියන්නේ size guide වර්ගයයි.

  tshirt = T-Shirt, Shirt, Hoodie, Jacket වගේ
  උඩ කොටසේ ඇඳුම්

  pants = Pants, Jeans, Shorts වගේ
  යට කොටසේ ඇඳුම්
*/
export type ProductType =
  | "tshirt"
  | "pants";

/*
  category එකට ඕනෑම ඇඳුම් වර්ගයක නමක්
  දාන්න පුළුවන්.

  උදාහරණ:
  T-Shirt
  Oversized T-Shirt
  Shirt
  Hoodie
  Jacket
  Pants
  Jeans
  Shorts
*/
export type ProductCategory = string;

export type ProductStock = Record<
  ProductSize,
  number
>;

export type ColorVariant = {
  name: string;
  slug: string;
  hex: string;
  images: string[];
  stock: ProductStock;
};

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

  /*
    Website එකේ පෙන්වන ඇඳුම් category එක
  */
  category: ProductCategory;

  price: number;

  /*
    Homepage සහ cart එකේ පෙන්වන
    main photo එක
  */
  image: string;

  /*
    පළමු colour එකේ gallery photos
  */
  images: string[];

  /*
    පළමු colour එකේ stock
  */
  stock: ProductStock;

  description: string;
  features: string[];

  /*
    Product එකේ සියලු colours
  */
  variants: ColorVariant[];
};

export type TshirtProduct =
  ProductBase & {
    productType: "tshirt";
    sizeGuide: TshirtSizeGuide;
  };

export type PantsProduct =
  ProductBase & {
    productType: "pants";
    sizeGuide: PantsSizeGuide;
  };

export type Product =
  | TshirtProduct
  | PantsProduct;

/* ==================================================
   DEFAULT T-SHIRT SIZE GUIDE
================================================== */

export const defaultTshirtSizeGuide: TshirtSizeGuide =
  {
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

/* ==================================================
   DEFAULT PANTS SIZE GUIDE
================================================== */

export const defaultPantsSizeGuide: PantsSizeGuide =
  {
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

/* ==================================================
   PRODUCTS LIST
================================================== */

export const products: Product[] = [
  {
    id: "monster",
    slug: "monster",

    name: "MONSTER",

    shortName: "MONSTER",

    /*
      Size guide type එක
    */
    productType: "tshirt",

    /*
      Website category එක
    */
    category: "Oversized T-Shirt",

    price: 3490,

    image:
      "/images/tshirt-white-1.jpg",

    images: [
      "/images/tshirt-white-1.jpg",
      "/images/tshirt-white-2.jpg",
      "/images/tshirt-white-3.jpg",
      "/images/tshirt-white-4.jpg",
    ],

    stock: {
      XS: 1,
      S: 3,
      M: 10,
      L: 8,
      XL: 2,
      XXL: 1,
    },

    description: "",

    features: [
      "240 GSM heavy cotton",
      "Premium oversized fit",
      "Available in multiple colours",
      "Islandwide delivery",
    ],

    variants: [
      {
        name: "White",
        slug: "white",
        hex: "#ffffff",

        images: [
          "/images/tshirt-white-1.jpg",
          "/images/tshirt-white-2.jpg",
          "/images/tshirt-white-3.jpg",
          "/images/tshirt-white-4.jpg",
        ],

        stock: {
          XS: 1,
          S: 3,
          M: 10,
          L: 8,
          XL: 2,
          XXL: 1,
        },
      },
    ],

    sizeGuide: {
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
    },
  },
];

/* ==================================================
   PRODUCT FIND FUNCTION
================================================== */

export function getProductBySlug(
  slug: string
): Product | undefined {
  return products.find(
    (product) =>
      product.slug === slug
  );
}