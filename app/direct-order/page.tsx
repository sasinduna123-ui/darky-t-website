"use client";

import { useEffect, useState } from "react";

type DirectOrder = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

export default function DirectOrderPage() {
  const [order, setOrder] = useState<DirectOrder | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  const whatsappNumber = "94788809678";

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("darky-direct-order");

      if (savedOrder) {
        const parsedOrder: DirectOrder = JSON.parse(savedOrder);
        setOrder(parsedOrder);
      }
    } catch {
      setOrder(null);
    }
  }, []);

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-100 text-black">
        <nav className="flex items-center justify-between bg-black px-4 py-5 text-white sm:px-6 md:px-12">
          <a
            href="/"
            className="text-xl font-black tracking-[0.2em] sm:text-2xl"
          >
            DARKY T
          </a>

          <a
            href="/"
            className="whitespace-nowrap text-xs font-semibold hover:text-gray-300 sm:text-sm"
          >
            BACK TO HOME
          </a>
        </nav>

        <section className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="bg-white p-10 shadow-sm">
            <h1 className="text-3xl font-black">
              NO PRODUCT SELECTED
            </h1>

            <p className="mt-4 text-gray-600">
              Select a product before opening the direct order page.
            </p>

            <a
              href="/#shop"
              className="mt-8 inline-block bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
            >
              SHOP NOW
            </a>
          </div>
        </section>
      </main>
    );
  }

  const subtotal = order.price * order.quantity;
  const hasFixedDeliveryFee = order.quantity >= 1 && order.quantity <= 5;
  const deliveryFee = hasFixedDeliveryFee ? 350 : 0;
  const finalTotal = subtotal + deliveryFee;

  const formComplete =
    customerName.trim() !== "" &&
    primaryPhone.trim() !== "" &&
    district.trim() !== "" &&
    address.trim() !== "";

  const deliveryMessage = hasFixedDeliveryFee
    ? `Delivery Fee: Rs. ${deliveryFee.toLocaleString()}`
    : "Delivery Fee: Please confirm through WhatsApp chat";

  const totalMessage = hasFixedDeliveryFee
    ? `Final Total: Rs. ${finalTotal.toLocaleString()}`
    : `Subtotal: Rs. ${subtotal.toLocaleString()}
Final total will be confirmed after the delivery fee is calculated.`;

  const whatsappMessage = encodeURIComponent(
    `Hello DARKY T,

I want to place a direct order:

CUSTOMER DETAILS

Name: ${customerName}
Primary Phone: ${primaryPhone}
Alternative Phone: ${
      alternativePhone.trim() !== ""
        ? alternativePhone
        : "Not provided"
    }
District: ${district}
Address: ${address}

ORDER DETAILS

Product: ${order.name}
Size: ${order.size}
Quantity: ${order.quantity}
Unit Price: Rs. ${order.price.toLocaleString()}
Subtotal: Rs. ${subtotal.toLocaleString()}

${deliveryMessage}
${totalMessage}`
  );

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-black px-4 py-5 text-white sm:px-6 md:px-12">
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
          BACK TO HOME
        </a>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-12">
        <div>
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            DIRECT ORDER
          </p>

          <h1 className="mt-2 text-4xl font-black">
            DELIVERY DETAILS
          </h1>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {/* Selected Product */}
            <div className="grid gap-5 bg-white p-5 shadow-sm sm:grid-cols-[180px_1fr]">
              <img
                src={order.image}
                alt={order.name}
                className="aspect-square w-full object-cover"
              />

              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold tracking-[0.2em] text-gray-500">
                  SELECTED PRODUCT
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {order.name}
                </h2>

                <p className="mt-4 text-gray-600">
                  Size:{" "}
                  <span className="font-bold text-black">
                    {order.size}
                  </span>
                </p>

                <p className="mt-2 text-gray-600">
                  Quantity:{" "}
                  <span className="font-bold text-black">
                    {order.quantity}
                  </span>
                </p>

                <p className="mt-2 text-xl font-black">
                  Rs. {subtotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
                CUSTOMER INFORMATION
              </p>

              <h2 className="mt-2 text-2xl font-black">
                ENTER DELIVERY DETAILS
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
              <span>Quantity</span>
              <span>{order.quantity}</span>
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

              {!hasFixedDeliveryFee && (
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Orders above 5 T-shirts have a custom delivery fee.
                  Confirm it through WhatsApp chat.
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
                delivery address before checkout.
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
                    "Please fill in your name, primary phone number, district and delivery address."
                  );
                }
              }}
              className={`block w-full px-5 py-4 text-center font-black transition ${
                formComplete
                  ? "bg-white text-black hover:bg-gray-200"
                  : "cursor-not-allowed bg-gray-600 text-gray-300"
              }`}
            >
              ORDER ON WHATSAPP
            </a>

            <a
              href="/#shop"
              className="mt-4 block w-full border border-white px-5 py-4 text-center font-black transition hover:bg-white hover:text-black"
            >
              CHANGE PRODUCT
            </a>
          </aside>
        </div>
      </section>
    </main>
  );
}