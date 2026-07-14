"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

export default function CartCount() {
  const [cartCount, setCartCount] = useState(0);

  function updateCartCount() {
    try {
      const savedCart = localStorage.getItem("darky-cart");

      if (!savedCart) {
        setCartCount(0);
        return;
      }

      const cart: CartItem[] = JSON.parse(savedCart);

      const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(totalQuantity);
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("darky-cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener(
        "darky-cart-updated",
        updateCartCount
      );
    };
  }, []);

  return (
    <a
      href="/cart"
      className="text-xs font-semibold hover:text-gray-500 sm:text-sm"
    >
      CART {cartCount > 0 && `(${cartCount})`}
    </a>
  );
}