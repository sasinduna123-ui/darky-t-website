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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const whatsappNumber = "94788809678";

  useEffect(() => {
    const savedCart = localStorage.getItem("darky-cart");

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCartItems(updatedCart);
    localStorage.setItem("darky-cart", JSON.stringify(updatedCart));
  }

  function increaseQuantity(index: number) {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    saveCart(updatedCart);
  }

  function decreaseQuantity(index: number) {
    const updatedCart = [...cartItems];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      saveCart(updatedCart);
    }
  }

  function removeItem(index: number) {
    const updatedCart = cartItems.filter((_, itemIndex) => itemIndex !== index);
    saveCart(updatedCart);
  }

  function clearCart() {
    saveCart([]);
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderDetails = cartItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}
Size: ${item.size}
Quantity: ${item.quantity}
Price: Rs. ${(item.price * item.quantity).toLocaleString()}`
    )
    .join("\n\n");

  const whatsappMessage = encodeURIComponent(
    `Hello DARKY T,

I want to place this order:

${orderDetails}

Total: Rs. ${total.toLocaleString()}`
  );

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <nav className="flex items-center justify-between border-b bg-black px-6 py-5 text-white md:px-12">
        <a href="/" className="text-2xl font-black tracking-[0.3em]">
          DARKY T
        </a>

        <a href="/" className="text-sm font-semibold hover:text-gray-300">
          CONTINUE SHOPPING
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
              YOUR ORDER
            </p>

            <h1 className="mt-2 text-4xl font-black">
              SHOPPING CART
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="border border-red-500 px-5 py-2 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              CLEAR CART
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="mt-12 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black">
              YOUR CART IS EMPTY
            </h2>

            <p className="mt-3 text-gray-600">
              Add a product to your cart to continue.
            </p>

            <a
              href="/#shop"
              className="mt-8 inline-block bg-black px-8 py-4 font-bold text-white hover:bg-gray-800"
            >
              SHOP NOW
            </a>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${index}`}
                  className="grid gap-5 bg-white p-5 shadow-sm sm:grid-cols-[140px_1fr]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-black">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        Size: {item.size}
                      </p>

                      <p className="mt-1 font-bold">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => decreaseQuantity(index)}
                          className="h-11 w-11 text-xl hover:bg-gray-100"
                        >
                          −
                        </button>

                        <span className="flex h-11 w-12 items-center justify-center font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(index)}
                          className="h-11 w-11 text-xl hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(index)}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit bg-black p-7 text-white">
              <h2 className="text-2xl font-black">
                ORDER SUMMARY
              </h2>

              <div className="mt-7 flex justify-between border-b border-white/20 pb-5">
                <span>Items</span>
                <span>
                  {cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/20 py-5">
                <span>Delivery</span>
                <span>Calculated later</span>
              </div>

              <div className="flex justify-between py-6 text-xl font-black">
                <span>TOTAL</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white px-5 py-4 text-center font-black text-black transition hover:bg-gray-200"
              >
                CHECKOUT ON WHATSAPP
              </a>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}