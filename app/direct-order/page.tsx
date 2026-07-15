"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { FaWhatsapp } from "react-icons/fa";

type DirectOrderItem = {
  id: string;
  name: string;
  image: string;

  color?: string;
  colorSlug?: string;

  size: string;
  price: number;
  quantity: number;

  maxStock?: number;
};

const districts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

export default function DirectOrderPage() {
  const [orderItem, setOrderItem] =
    useState<DirectOrderItem | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [orderId, setOrderId] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [primaryPhone, setPrimaryPhone] =
    useState("");

  const [
    alternativePhone,
    setAlternativePhone,
  ] = useState("");

  const [district, setDistrict] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [note, setNote] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  function generateOrderId(): string {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    return `DT-${year}${month}${day}-${randomNumber}`;
  }

  useEffect(() => {
    try {
      const savedOrder =
        localStorage.getItem(
          "darky-direct-order"
        );

      if (!savedOrder) {
        setOrderItem(null);
        return;
      }

      const parsedOrder: DirectOrderItem =
        JSON.parse(savedOrder);

      setOrderItem(parsedOrder);

      const savedOrderId =
        localStorage.getItem(
          "darky-direct-order-id"
        );

      if (savedOrderId) {
        setOrderId(savedOrderId);
      } else {
        const newOrderId =
          generateOrderId();

        localStorage.setItem(
          "darky-direct-order-id",
          newOrderId
        );

        setOrderId(newOrderId);
      }
    } catch {
      setOrderItem(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function cleanPhoneNumber(
    value: string
  ): string {
    return value.replace(/\D/g, "");
  }

  function formatSriLankanPhone(
    value: string
  ): string {
    const cleanedNumber =
      cleanPhoneNumber(value);

    if (
      cleanedNumber.startsWith("94")
    ) {
      return `+${cleanedNumber}`;
    }

    if (
      cleanedNumber.startsWith("0")
    ) {
      return `+94${cleanedNumber.slice(1)}`;
    }

    return `+94${cleanedNumber}`;
  }

  function isValidPhone(
    value: string
  ): boolean {
    const cleanedNumber =
      cleanPhoneNumber(value);

    if (
      cleanedNumber.startsWith("94")
    ) {
      return cleanedNumber.length === 11;
    }

    if (
      cleanedNumber.startsWith("0")
    ) {
      return cleanedNumber.length === 10;
    }

    return cleanedNumber.length === 9;
  }

  function validateForm(): boolean {
    if (!orderItem) {
      setErrorMessage(
        "Order product එක හොයාගන්න බැහැ."
      );

      return false;
    }

    const maxStock =
      Number(orderItem.maxStock);

    if (
      Number.isFinite(maxStock) &&
      maxStock > 0 &&
      orderItem.quantity > maxStock
    ) {
      setErrorMessage(
        `${orderItem.name} stock limit එක ${maxStock}යි.`
      );

      return false;
    }

    if (
      !Number.isFinite(
        Number(orderItem.quantity)
      ) ||
      orderItem.quantity < 1
    ) {
      setErrorMessage(
        "Order quantity එක invalid."
      );

      return false;
    }

    if (!customerName.trim()) {
      setErrorMessage(
        "Customer name එක ඇතුළත් කරන්න."
      );

      return false;
    }

    if (!primaryPhone.trim()) {
      setErrorMessage(
        "Primary phone number එක ඇතුළත් කරන්න."
      );

      return false;
    }

    if (!isValidPhone(primaryPhone)) {
      setErrorMessage(
        "හරි primary phone number එකක් ඇතුළත් කරන්න."
      );

      return false;
    }

    if (!alternativePhone.trim()) {
      setErrorMessage(
        "Alternative phone number එක ඇතුළත් කරන්න."
      );

      return false;
    }

    if (
      !isValidPhone(
        alternativePhone
      )
    ) {
      setErrorMessage(
        "හරි alternative phone number එකක් ඇතුළත් කරන්න."
      );

      return false;
    }

    if (
      cleanPhoneNumber(primaryPhone) ===
      cleanPhoneNumber(
        alternativePhone
      )
    ) {
      setErrorMessage(
        "Phone numbers දෙකට වෙනස් numbers දෙකක් ඇතුළත් කරන්න."
      );

      return false;
    }

    if (!district.trim()) {
      setErrorMessage(
        "District එක තෝරන්න."
      );

      return false;
    }

    if (!address.trim()) {
      setErrorMessage(
        "Delivery address එක ඇතුළත් කරන්න."
      );

      return false;
    }

    setErrorMessage("");

    return true;
  }

  function sendWhatsAppOrder(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!orderItem) {
      return;
    }

    const currentOrderItem =
      orderItem;

    const currentOrderId =
      orderId || generateOrderId();

    if (!orderId) {
      localStorage.setItem(
        "darky-direct-order-id",
        currentOrderId
      );

      setOrderId(currentOrderId);
    }

    const subtotal =
      currentOrderItem.price *
      currentOrderItem.quantity;

    const hasFixedDeliveryFee =
      currentOrderItem.quantity > 0 &&
      currentOrderItem.quantity <= 5;

    const deliveryFee =
      hasFixedDeliveryFee
        ? 350
        : 0;

    const finalTotal =
      subtotal + deliveryFee;

    const selectedColour =
      currentOrderItem.color?.trim() ||
      "Not selected";

    const formattedPrimaryPhone =
      formatSriLankanPhone(
        primaryPhone
      );

    const formattedAlternativePhone =
      formatSriLankanPhone(
        alternativePhone
      );

    const deliveryDetails =
      hasFixedDeliveryFee
        ? `• Delivery Fee: Rs. ${deliveryFee.toLocaleString()}
• *Final Total: Rs. ${finalTotal.toLocaleString()}*`
        : `• Delivery Fee: _To be confirmed through WhatsApp_
• Final Total: _To be confirmed after calculating the delivery fee_`;

    const whatsappMessage = `*DARKY T - NEW ORDER*

*Order ID: ${currentOrderId}*

Hello DARKY T,

I would like to place the following order.

--------------------------------
*ORDER DETAILS*
--------------------------------

• Product: *${currentOrderItem.name}*
• Colour: ${selectedColour}
• Size: ${currentOrderItem.size}
• Quantity: ${currentOrderItem.quantity}
• Unit Price: Rs. ${currentOrderItem.price.toLocaleString()}
• Subtotal: Rs. ${subtotal.toLocaleString()}
${deliveryDetails}

--------------------------------
*CUSTOMER DETAILS*
--------------------------------

• Name: ${customerName.trim()}
• Primary Phone: ${formattedPrimaryPhone}
• Alternative Phone: ${formattedAlternativePhone}
• District: ${district.trim()}
• Delivery Address: ${address.trim()}
• Note: ${note.trim() || "No special note"}

--------------------------------

*Please confirm my order.*

Thank you,
*DARKY T*`;

    const lastOrderData = {
      orderId: currentOrderId,
      orderType: "direct",

      customerName:
        customerName.trim(),

      primaryPhone:
        formattedPrimaryPhone,

      alternativePhone:
        formattedAlternativePhone,

      district:
        district.trim(),

      address:
        address.trim(),

      note:
        note.trim() ||
        "No special note",

      items: [
        {
          ...currentOrderItem,
          color: selectedColour,
        },
      ],

      totalQuantity:
        currentOrderItem.quantity,

      subtotal,

      deliveryFee:
        hasFixedDeliveryFee
          ? deliveryFee
          : null,

      finalTotal:
        hasFixedDeliveryFee
          ? finalTotal
          : null,

      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "darky-last-order",
      JSON.stringify(
        lastOrderData
      )
    );

    const whatsappNumber =
      "94788809678";

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    window.setTimeout(() => {
      window.location.href =
        "/order-success";
    }, 500);
  }

  function removeDirectOrder() {
    localStorage.removeItem(
      "darky-direct-order"
    );

    localStorage.removeItem(
      "darky-direct-order-id"
    );

    window.location.href =
      "/#shop";
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
        <p className="font-bold">
          Loading order...
        </p>
      </main>
    );
  }

  if (!orderItem) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <div>
          <h1 className="text-4xl font-black">
            ORDER NOT FOUND
          </h1>

          <p className="mt-4 text-gray-600">
            Order කරන්න product එකක් තෝරලා නැහැ.
          </p>

          <a
            href="/#shop"
            className="mt-8 inline-block bg-black px-8 py-4 font-bold text-white transition hover:bg-gray-800"
          >
            BACK TO SHOP
          </a>
        </div>
      </main>
    );
  }

  const currentOrderItem =
    orderItem;

  const subtotal =
    currentOrderItem.price *
    currentOrderItem.quantity;

  const hasFixedDeliveryFee =
    currentOrderItem.quantity > 0 &&
    currentOrderItem.quantity <= 5;

  const deliveryFee =
    hasFixedDeliveryFee
      ? 350
      : 0;

  const finalTotal =
    subtotal + deliveryFee;

  const selectedColour =
    currentOrderItem.color?.trim() ||
    "Not selected";

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <nav className="flex items-center justify-between bg-black px-5 py-5 text-white md:px-12">
        <a
          href="/"
          className="text-xl font-black tracking-[0.25em] sm:text-2xl"
        >
          DARKY T
        </a>

        <a
          href="/#shop"
          className="text-xs font-bold transition hover:text-gray-300 sm:text-sm"
        >
          BACK TO SHOP
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-12 md:py-14">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
          DARKY T CHECKOUT
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          DELIVERY DETAILS
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-gray-300 bg-white px-5 py-4">
          <span className="text-sm font-bold text-gray-500">
            ORDER ID
          </span>

          <span className="font-black tracking-wider">
            {orderId ||
              "Generating..."}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black">
              ORDER SUMMARY
            </h2>

            <div className="mt-7 flex flex-col gap-6 sm:flex-row">
              <div className="w-full overflow-hidden bg-gray-100 sm:w-44">
                <img
                  src={
                    currentOrderItem.image
                  }
                  alt={
                    currentOrderItem.name
                  }
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-black">
                  {
                    currentOrderItem.name
                  }
                </h3>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-5 border-b pb-3">
                    <span className="text-gray-500">
                      Colour
                    </span>

                    <span className="font-bold">
                      {selectedColour}
                    </span>
                  </div>

                  <div className="flex justify-between gap-5 border-b pb-3">
                    <span className="text-gray-500">
                      Size
                    </span>

                    <span className="font-bold">
                      {
                        currentOrderItem.size
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-5 border-b pb-3">
                    <span className="text-gray-500">
                      Quantity
                    </span>

                    <span className="font-bold">
                      {
                        currentOrderItem.quantity
                      }
                    </span>
                  </div>

                  <div className="flex justify-between gap-5 border-b pb-3">
                    <span className="text-gray-500">
                      Unit Price
                    </span>

                    <span className="font-bold">
                      Rs.{" "}
                      {currentOrderItem.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-5 border-b pb-3">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span className="font-bold">
                      Rs.{" "}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between gap-5 border-b pb-3">
                    <span className="text-gray-500">
                      Delivery Fee
                    </span>

                    <span className="text-right font-bold">
                      {hasFixedDeliveryFee
                        ? `Rs. ${deliveryFee.toLocaleString()}`
                        : "Confirm via WhatsApp"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-y py-5">
              <span className="text-lg font-bold">
                {hasFixedDeliveryFee
                  ? "FINAL TOTAL"
                  : "SUBTOTAL"}
              </span>

              <span className="text-2xl font-black">
                Rs.{" "}
                {(hasFixedDeliveryFee
                  ? finalTotal
                  : subtotal
                ).toLocaleString()}
              </span>
            </div>

            {!hasFixedDeliveryFee && (
              <div className="mt-5 border border-orange-200 bg-orange-50 p-4 text-sm font-semibold leading-6 text-orange-700">
                Products 5කට වැඩි නිසා delivery fee සහ final total එක WhatsApp එකෙන් confirm කරනවා.
              </div>
            )}

            <p className="mt-5 text-sm leading-6 text-gray-500">
              Products 1–5 සඳහා delivery fee එක Rs. 350යි.
            </p>

            <button
              type="button"
              onClick={
                removeDirectOrder
              }
              className="mt-6 w-full border border-red-600 px-5 py-3 font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              REMOVE THIS ORDER
            </button>
          </div>

          <form
            onSubmit={
              sendWhatsAppOrder
            }
            className="bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="text-2xl font-black">
              CUSTOMER DETAILS
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Phone numbers දෙකම අනිවාර්යයි.
            </p>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  FULL NAME *
                </label>

                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  placeholder="ඔයාගේ සම්පූර්ණ නම"
                  autoComplete="name"
                  className="w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  PRIMARY PHONE NUMBER *
                </label>

                <input
                  type="tel"
                  required
                  value={primaryPhone}
                  onChange={(event) =>
                    setPrimaryPhone(
                      event.target.value
                    )
                  }
                  placeholder="07XXXXXXXX"
                  autoComplete="tel"
                  className="w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  ALTERNATIVE PHONE NUMBER *
                </label>

                <input
                  type="tel"
                  required
                  value={
                    alternativePhone
                  }
                  onChange={(event) =>
                    setAlternativePhone(
                      event.target.value
                    )
                  }
                  placeholder="07XXXXXXXX"
                  className="w-full border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Primary number එකට වෙනස් contact number එකක් දාන්න.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  DISTRICT *
                </label>

                <select
                  required
                  value={district}
                  onChange={(event) =>
                    setDistrict(
                      event.target.value
                    )
                  }
                  className="w-full border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
                >
                  <option value="">
                    Select district
                  </option>

                  {districts.map(
                    (districtName) => (
                      <option
                        key={
                          districtName
                        }
                        value={
                          districtName
                        }
                      >
                        {
                          districtName
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  DELIVERY ADDRESS *
                </label>

                <textarea
                  required
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="ගෙදර අංකය, පාර, නගරය"
                  autoComplete="street-address"
                  className="w-full resize-none border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  SPECIAL NOTE — OPTIONAL
                </label>

                <textarea
                  value={note}
                  onChange={(event) =>
                    setNote(
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Order එක ගැන විශේෂ සටහනක් තිබේ නම්"
                  className="w-full resize-none border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {errorMessage && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 bg-green-600 px-6 py-4 font-black text-white transition hover:bg-green-700"
              >
                <FaWhatsapp className="text-2xl" />

                SEND ORDER VIA WHATSAPP
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Order ID, product, colour, size, delivery fee සහ customer details WhatsApp message එකට යනවා.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}