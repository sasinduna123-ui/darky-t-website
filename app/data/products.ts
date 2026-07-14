export type ProductStock = {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  price: number;
  image: string;
  description: string;
  stock: ProductStock;
};

export const products: Product[] = [
  {
    id: "black-tee",
    slug: "black-tee",
    name: "Essential Black Tee",
    shortName: "Black Tee",
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
  },

  {
    id: "white-tee",
    slug: "white-tee",
    name: "Heavy Cotton White Tee",
    shortName: "White Tee",
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
  },

  {
    id: "grey-tee",
    slug: "grey-tee",
    name: "Dark Grey Oversized Tee",
    shortName: "Grey Tee",
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
  },
{
  id: "red-tee",
  slug: "red-tee",
  name: "Red Oversized Tee",
  shortName: "Red Tee",
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
},
{
  id: "mens-bottom",
  slug: "mens-bottom",
  name: "Mens Bottom",
  shortName: "Mens Bottom",
  price: 2560,
  image: "/images/Mens Bottom.jpg",
  description:
    "Casual Mens Bottom",
  stock: {
    XS: 2,
    S: 2,
    M: 5,
    L: 3,
    XL: 1,
    XXL: 0,
  },
},
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}