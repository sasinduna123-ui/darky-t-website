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
  const [customerName, setCustomerName] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");

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
    const updatedCart = cartItems.filter(
      (_, itemIndex) => itemIndex !== index
    );

    saveCart(updatedCart);
  }

  function clearCart() {
    saveCart([]);
  }

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasFixedDeliveryFee = totalItems > 0 && totalItems <= 5;
  const deliveryFee = hasFixedDeliveryFee ? 350 : 0;
  const finalTotal = subtotal + deliveryFee;

  const orderDetails = cartItems
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}
Size: ${item.size}
Quantity: ${item.quantity}
Price: Rs. ${(item.price * item.quantity).toLocaleString()}`
    )
    .join("\n\n");

  const deliveryMessage =
    totalItems <= 5
      ? `Delivery Fee: Rs. ${deliveryFee.toLocaleString()}`
      : "Delivery Fee: Please confirm through WhatsApp chat";

  const totalMessage =
    totalItems <= 5
      ? `Final Total: Rs. ${finalTotal.toLocaleString()}`
      : `Subtotal: Rs. ${subtotal.toLocaleString()}
Final total will be confirmed after delivery fee is calculated.`;

  const whatsappMessage = encodeURIComponent(
    `Hello DARKY T,

I want to place this order:

CUSTOMER DETAILS

Name: ${customerName}
Primary Phone: ${primaryPhone}
Alternative Phone: ${
      alternativePhone.trim() !== ""
        ? alternativePhone
        : "Not provided"
    }
Address: ${address}
District: ${district}

ORDER DETAILS

${orderDetails}

Total Items: ${totalItems}
Subtotal: Rs. ${subtotal.toLocaleString()}
${deliveryMessage}
${totalMessage}`
  );

  const formComplete =
    customerName.trim() !== "" &&
    primaryPhone.trim() !== "" &&
    address.trim() !== "" &&
    district.trim() !== "";

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b bg-black px-4 py-5 text-white sm:px-6 md:px-12">
        <a
          href="/"
          className="text-xl font-black tracking-[0.2em] sm:text-2xl sm:tracking-[0.3em]"
        >
          DARKY T
        </a>

        <a
          href="/"
          className="whitespace-nowrap text-xs font-semibold hover:text-gray-300 sm:text-sm"
        >
          CONTINUE SHOPPING
        </a>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-12">
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
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              {/* Cart Items */}
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

              {/* Customer Form */}
              <div className="bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
                  DELIVERY DETAILS
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  CUSTOMER INFORMATION
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold">
                      FULL NAME
                    </label>

                    <input
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      PRIMARY PHONE NUMBER
                    </label>

                    <input
                      type="tel"
                      value={primaryPhone}
                      onChange={(event) =>
                        setPrimaryPhone(event.target.value)
                      }
                      placeholder="07XXXXXXXX"
                      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      ALTERNATIVE PHONE NUMBER
                    </label>

                    <input
                      type="tel"
                      value={alternativePhone}
                      onChange={(event) =>
                        setAlternativePhone(event.target.value)
                      }
                      placeholder="07XXXXXXXX (Optional)"
                      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      DISTRICT
                    </label>

                    <input
                      type="text"
                      value={district}
                      onChange={(event) =>
                        setDistrict(event.target.value)
                      }
                      placeholder="Example: Galle"
                      className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-bold">
                      DELIVERY ADDRESS
                    </label>

                    <textarea
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      placeholder="Enter your full delivery address"
                      rows={4}
                      className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="h-fit bg-black p-7 text-white">
              <h2 className="text-2xl font-black">
                ORDER SUMMARY
              </h2>

              <div className="mt-7 flex justify-between border-b border-white/20 pb-5">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between border-b border-white/20 py-5">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="border-b border-white/20 py-5">
                <div className="flex justify-between gap-4">
                  <span>Delivery</span>

                  <span className="text-right">
                    {hasFixedDeliveryFee
                      ? `Rs. ${deliveryFee.toLocaleString()}`
                      : "Confirm via WhatsApp"}
                  </span>
                </div>

                {totalItems > 5 && (
                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    Orders above 5 T-shirts have a custom delivery fee.
                    Please confirm it through WhatsApp chat.
                  </p>
                )}
              </div>

              <div className="flex justify-between py-6 text-xl font-black">
                <span>
                  {hasFixedDeliveryFee ? "FINAL TOTAL" : "SUBTOTAL"}
                </span>

                <span>
                  Rs.{" "}
                  {(hasFixedDeliveryFee
                    ? finalTotal
                    : subtotal
                  ).toLocaleString()}
                </span>
              </div>

              {!formComplete && (
                <p className="mb-4 text-sm leading-6 text-yellow-300">
                  Fill in your name, primary phone number, district and
                  address before checkout.
                </p>
              )}

              <a
                href={
                  formComplete
                    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
                    : "#"
                }
                target={formComplete ? "_blank" : undefined}
                rel={formComplete ? "noopener noreferrer" : undefined}
                onClick={(event) => {
                  if (!formComplete) {
                    event.preventDefault();
                    alert(
                      "Please fill in your name, primary phone number, district and address."
                    );
                  }
                }}
                className={`block w-full px-5 py-4 text-center font-black transition ${
                  formComplete
                    ? "bg-white text-black hover:bg-gray-200"
                    : "cursor-not-allowed bg-gray-600 text-gray-300"
                }`}
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