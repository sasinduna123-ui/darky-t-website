"use client";

import {
  type FormEvent,
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

type SavedOrder = {
  orderNumber: string;
  orderType: "direct";

  customerName: string;
  primaryPhone: string;
  alternativePhone: string;

  district: string;
  deliveryAddress: string;
  note: string;

  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;

  deliveryPending: boolean;
  createdAt: string;

  items: DirectOrderItem[];
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

function cleanPhoneNumber(
  value: string
) {
  return value.replace(/\D/g, "");
}

function formatSriLankanPhone(
  value: string
) {
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
    return `+94${cleanedNumber.slice(
      1
    )}`;
  }

  return `+94${cleanedNumber}`;
}

function isValidPhone(
  value: string
) {
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

function createOrderNumber() {
  const now = new Date();

  const year = now
    .getFullYear()
    .toString()
    .slice(-2);

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const timePart = Date.now()
    .toString()
    .slice(-6);

  const randomPart = Math.floor(
    100 + Math.random() * 900
  );

  return `DT-D-${year}${month}${day}-${timePart}${randomPart}`;
}

export default function DirectOrderPage() {
  const [
    orderItem,
    setOrderItem,
  ] =
    useState<DirectOrderItem | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [
    primaryPhone,
    setPrimaryPhone,
  ] = useState("");

  const [
    alternativePhone,
    setAlternativePhone,
  ] = useState("");

  const [
    district,
    setDistrict,
  ] = useState("");

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    note,
    setNote,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

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

      const parsedOrder =
        JSON.parse(savedOrder);

      if (
        !parsedOrder ||
        typeof parsedOrder !==
          "object"
      ) {
        setOrderItem(null);
        return;
      }

      const preparedItem:
        DirectOrderItem = {
        ...parsedOrder,

        quantity: Math.max(
          1,
          Number(
            parsedOrder.quantity
          ) || 1
        ),

        maxStock:
          Number(
            parsedOrder.maxStock
          ) || undefined,
      };

      setOrderItem(
        preparedItem
      );
    } catch {
      setOrderItem(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subtotal =
    orderItem
      ? Number(orderItem.price) *
        Number(
          orderItem.quantity
        )
      : 0;

  const totalQuantity =
    orderItem
      ? Number(
          orderItem.quantity
        )
      : 0;

  const hasFixedDeliveryFee =
    totalQuantity > 0 &&
    totalQuantity <= 5;

  const deliveryFee =
    hasFixedDeliveryFee
      ? 350
      : 0;

  const finalTotal =
    hasFixedDeliveryFee
      ? subtotal +
        deliveryFee
      : subtotal;

  function updateQuantity(
    nextQuantity: number
  ) {
    if (!orderItem) {
      return;
    }

    const maxStock =
      Number(
        orderItem.maxStock
      ) || 999999;

    const safeQuantity =
      Math.min(
        maxStock,
        Math.max(
          1,
          nextQuantity
        )
      );

    const updatedItem = {
      ...orderItem,
      quantity:
        safeQuantity,
    };

    setOrderItem(
      updatedItem
    );

    localStorage.setItem(
      "darky-direct-order",
      JSON.stringify(
        updatedItem
      )
    );

    if (
      nextQuantity > maxStock
    ) {
      setErrorMessage(
        `Available stock එක ${maxStock}යි.`
      );
    } else {
      setErrorMessage("");
    }
  }

  function validateForm() {
    if (!orderItem) {
      setErrorMessage(
        "Direct order product එක හොයාගන්න බැහැ."
      );

      return false;
    }

    if (
      !orderItem.id?.trim()
    ) {
      setErrorMessage(
        "Product ID එක missing. Product page එකෙන් නැවත ORDER NOW කරන්න."
      );

      return false;
    }

    if (
      !orderItem.colorSlug?.trim()
    ) {
      setErrorMessage(
        "Product colour data එක missing. Product page එකෙන් නැවත ORDER NOW කරන්න."
      );

      return false;
    }

    if (
      !orderItem.size?.trim()
    ) {
      setErrorMessage(
        "Product size එක missing."
      );

      return false;
    }

    if (
      !customerName.trim()
    ) {
      setErrorMessage(
        "Customer name එක ඇතුළත් කරන්න."
      );

      return false;
    }

    if (
      !primaryPhone.trim() ||
      !isValidPhone(
        primaryPhone
      )
    ) {
      setErrorMessage(
        "හරි primary phone number එකක් ඇතුළත් කරන්න."
      );

      return false;
    }

    if (
      !alternativePhone.trim() ||
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
      cleanPhoneNumber(
        primaryPhone
      ) ===
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

  async function placeDirectOrder(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      isSubmitting ||
      !validateForm() ||
      !orderItem
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const whatsappWindow =
      window.open(
        "",
        "_blank"
      );

    const orderNumber =
      createOrderNumber();

    const formattedPrimaryPhone =
      formatSriLankanPhone(
        primaryPhone
      );

    const formattedAlternativePhone =
      formatSriLankanPhone(
        alternativePhone
      );

    try {
      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                order: {
                  orderNumber,

                  orderType:
                    "direct",

                  customerName:
                    customerName.trim(),

                  primaryPhone:
                    formattedPrimaryPhone,

                  alternativePhone:
                    formattedAlternativePhone,

                  district:
                    district.trim(),

                  deliveryAddress:
                    address.trim(),

                  note:
                    note.trim(),

                  items: [
                    {
                      productId:
                        orderItem.id,

                      productName:
                        orderItem.name,

                      colourName:
                        orderItem.color?.trim() ||
                        "Not selected",

                      colourSlug:
                        orderItem.colorSlug?.trim() ||
                        "",

                      size:
                        orderItem.size,

                      quantity:
                        Number(
                          orderItem.quantity
                        ),

                      unitPrice:
                        Number(
                          orderItem.price
                        ),
                    },
                  ],
                },
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Order එක database එකට save කරන්න බැරි වුණා."
        );
      }

      const savedOrderNumber =
        result.orderNumber ||
        orderNumber;

      const databaseDeliveryFee =
        Number(
          result.deliveryFee
        ) || 0;

      const databaseFinalTotal =
        Number(
          result.finalTotal
        ) || subtotal;

      const selectedColour =
        orderItem.color?.trim() ||
        "Not selected";

      const whatsappMessage = `*DARKY T - NEW DIRECT ORDER*

*Order Number: ${savedOrderNumber}*

Hello DARKY T,

I would like to place the following direct order.

--------------------------------
*PRODUCT DETAILS*
--------------------------------

• Product: ${orderItem.name}
• Colour: ${selectedColour}
• Size: ${orderItem.size}
• Quantity: ${orderItem.quantity}
• Unit Price: Rs. ${Number(
        orderItem.price
      ).toLocaleString()}
• Subtotal: Rs. ${subtotal.toLocaleString()}
• Delivery Fee: ${
        hasFixedDeliveryFee
          ? `Rs. ${databaseDeliveryFee.toLocaleString()}`
          : "To be confirmed"
      }
• Final Total: ${
        hasFixedDeliveryFee
          ? `Rs. ${databaseFinalTotal.toLocaleString()}`
          : "To be confirmed"
      }

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

      const whatsappNumber =
        "94788809678";

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          whatsappMessage
        )}`;

      const lastOrder:
        SavedOrder = {
        orderNumber:
          savedOrderNumber,

        orderType:
          "direct",

        customerName:
          customerName.trim(),

        primaryPhone:
          formattedPrimaryPhone,

        alternativePhone:
          formattedAlternativePhone,

        district:
          district.trim(),

        deliveryAddress:
          address.trim(),

        note:
          note.trim(),

        totalQuantity,

        subtotal,

        deliveryFee:
          databaseDeliveryFee,

        finalTotal:
          databaseFinalTotal,

        deliveryPending:
          !hasFixedDeliveryFee,

        createdAt:
          new Date().toISOString(),

        items: [
          orderItem,
        ],
      };

      localStorage.setItem(
        "darky-last-order",
        JSON.stringify(
          lastOrder
        )
      );

      localStorage.setItem(
        "darky-last-order-number",
        savedOrderNumber
      );

      localStorage.removeItem(
        "darky-direct-order"
      );

      setSuccessMessage(
        `${savedOrderNumber} direct order එක database එකට save කළා.`
      );

      if (whatsappWindow) {
        whatsappWindow.location.href =
          whatsappUrl;
      } else {
        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }

      window.setTimeout(() => {
        window.location.href =
          "/order-success";
      }, 1000);
    } catch (error) {
      if (whatsappWindow) {
        whatsappWindow.close();
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Order එක save කරන්න බැරි වුණා."
      );

      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
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
            NO DIRECT ORDER
          </h1>

          <p className="mt-4 text-gray-600">
            Product page එකෙන් product එකක් select කරලා ORDER NOW කරන්න.
          </p>

          <a
            href="/#shop"
            className="mt-8 inline-block bg-black px-8 py-4 font-bold text-white"
          >
            BACK TO SHOP
          </a>
        </div>
      </main>
    );
  }

  const maxStock =
    Number(
      orderItem.maxStock
    ) || null;

  const selectedColour =
    orderItem.color?.trim() ||
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
          href={`/product`}
          onClick={(event) => {
            event.preventDefault();
            window.history.back();
          }}
          className="text-sm font-bold hover:text-gray-300"
        >
          BACK
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-12 md:py-14">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
          DARKY T DIRECT CHECKOUT
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          ORDER NOW
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="h-fit bg-white p-6 shadow-sm md:p-8">
            <div className="overflow-hidden bg-gray-100">
              <img
                src={
                  orderItem.image
                }
                alt={
                  orderItem.name
                }
                className="aspect-square w-full object-cover"
              />
            </div>

            <h2 className="mt-6 text-3xl font-black uppercase">
              {orderItem.name}
            </h2>

            <div className="mt-5 space-y-3 text-gray-600">
              <p>
                Colour:{" "}
                <strong className="text-black">
                  {selectedColour}
                </strong>
              </p>

              <p>
                Size:{" "}
                <strong className="text-black">
                  {orderItem.size}
                </strong>
              </p>

              <p>
                Unit price:{" "}
                <strong className="text-black">
                  Rs.{" "}
                  {Number(
                    orderItem.price
                  ).toLocaleString()}
                </strong>
              </p>

              {maxStock !==
                null && (
                <p>
                  Available stock:{" "}
                  <strong className="text-black">
                    {maxStock}
                  </strong>
                </p>
              )}
            </div>

            <div className="mt-7">
              <p className="mb-3 font-black">
                QUANTITY
              </p>

              <div className="flex w-fit items-center border">
                <button
                  type="button"
                  disabled={
                    orderItem.quantity <=
                    1
                  }
                  onClick={() =>
                    updateQuantity(
                      orderItem.quantity -
                        1
                    )
                  }
                  className="h-12 w-12 text-xl disabled:text-gray-300"
                >
                  −
                </button>

                <span className="flex h-12 w-14 items-center justify-center font-black">
                  {orderItem.quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    maxStock !==
                      null &&
                    orderItem.quantity >=
                      maxStock
                  }
                  onClick={() =>
                    updateQuantity(
                      orderItem.quantity +
                        1
                    )
                  }
                  className="h-12 w-12 text-xl disabled:text-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-7 space-y-4 border-t pt-6">
              <div className="flex justify-between">
                <span>
                  Subtotal
                </span>

                <strong>
                  Rs.{" "}
                  {subtotal.toLocaleString()}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>
                  Delivery
                </span>

                <strong>
                  {hasFixedDeliveryFee
                    ? `Rs. ${deliveryFee.toLocaleString()}`
                    : "Confirm via WhatsApp"}
                </strong>
              </div>

              <div className="flex justify-between border-t pt-4 text-xl font-black">
                <span>
                  {hasFixedDeliveryFee
                    ? "TOTAL"
                    : "SUBTOTAL"}
                </span>

                <span>
                  Rs.{" "}
                  {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <form
            onSubmit={
              placeDirectOrder
            }
            className="h-fit bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="text-2xl font-black">
              DELIVERY DETAILS
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
                  required
                  value={
                    customerName
                  }
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  PRIMARY PHONE *
                </label>

                <input
                  type="tel"
                  required
                  value={
                    primaryPhone
                  }
                  onChange={(event) =>
                    setPrimaryPhone(
                      event.target.value
                    )
                  }
                  placeholder="07XXXXXXXX"
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  ALTERNATIVE PHONE *
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
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
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
                  className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                >
                  <option value="">
                    Select district
                  </option>

                  {districts.map(
                    (
                      districtName
                    ) => (
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
                  rows={4}
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  SPECIAL NOTE
                </label>

                <textarea
                  rows={3}
                  value={note}
                  onChange={(event) =>
                    setNote(
                      event.target.value
                    )
                  }
                  className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {errorMessage && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className={`flex w-full items-center justify-center gap-3 px-6 py-4 font-black text-white ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-500"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <FaWhatsapp className="text-2xl" />

                {isSubmitting
                  ? "SAVING ORDER..."
                  : "PLACE DIRECT ORDER"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Direct order එක database එකට save වුණාට පස්සේ WhatsApp open වෙනවා.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}