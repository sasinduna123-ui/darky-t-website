"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import { FaWhatsapp } from "react-icons/fa";

type CartItem = {
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
  orderType: "cart";

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

  items: CartItem[];
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
    return `+94${cleanedNumber.slice(
      1
    )}`;
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

  return `DT-${year}${month}${day}-${timePart}${randomPart}`;
}

export default function CartPage() {
  const [
    cartItems,
    setCartItems,
  ] = useState<CartItem[]>([]);

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
      const savedCart =
        localStorage.getItem(
          "darky-cart"
        );

      if (!savedCart) {
        setCartItems([]);
        return;
      }

      const parsedCart =
        JSON.parse(savedCart);

      if (
        !Array.isArray(parsedCart)
      ) {
        setCartItems([]);
        return;
      }

      const preparedCart:
        CartItem[] =
        parsedCart.map(
          (item: CartItem) => ({
            ...item,

            quantity: Math.max(
              1,
              Number(
                item.quantity
              ) || 1
            ),

            maxStock:
              Number(
                item.maxStock
              ) || undefined,
          })
        );

      setCartItems(
        preparedCart
      );
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function saveCart(
    updatedCart: CartItem[]
  ) {
    setCartItems(updatedCart);

    localStorage.setItem(
      "darky-cart",
      JSON.stringify(
        updatedCart
      )
    );

    window.dispatchEvent(
      new Event(
        "darky-cart-updated"
      )
    );
  }

  function increaseQuantity(
    index: number
  ) {
    const selectedItem =
      cartItems[index];

    if (!selectedItem) {
      return;
    }

    const maxStock =
      Number(
        selectedItem.maxStock
      ) || 999999;

    if (
      selectedItem.quantity >=
      maxStock
    ) {
      setErrorMessage(
        `${selectedItem.name} සඳහා available stock එක ${maxStock}යි.`
      );

      return;
    }

    setErrorMessage("");

    const updatedCart =
      cartItems.map(
        (
          item,
          itemIndex
        ) =>
          itemIndex === index
            ? {
                ...item,

                quantity:
                  Math.min(
                    maxStock,
                    item.quantity +
                      1
                  ),
              }
            : item
      );

    saveCart(updatedCart);
  }

  function decreaseQuantity(
    index: number
  ) {
    setErrorMessage("");

    const updatedCart =
      cartItems.map(
        (
          item,
          itemIndex
        ) =>
          itemIndex === index
            ? {
                ...item,

                quantity:
                  Math.max(
                    1,
                    item.quantity -
                      1
                  ),
              }
            : item
      );

    saveCart(updatedCart);
  }

  function removeItem(
    index: number
  ) {
    const updatedCart =
      cartItems.filter(
        (
          _,
          itemIndex
        ) =>
          itemIndex !== index
      );

    saveCart(updatedCart);
    setErrorMessage("");
  }

  function clearCart() {
    const confirmed =
      window.confirm(
        "Cart එකේ products සියල්ල remove කරන්නද?"
      );

    if (!confirmed) {
      return;
    }

    saveCart([]);
    setErrorMessage("");
  }

  const subtotal =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(item.price) *
          Number(
            item.quantity
          ),
      0
    );

  const totalQuantity =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity
        ),
      0
    );

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

  function validateForm() {
    if (
      cartItems.length === 0
    ) {
      setErrorMessage(
        "Cart එකේ products කිසිවක් නැහැ."
      );

      return false;
    }

    for (
      const item of cartItems
    ) {
      if (
        !item.id?.trim()
      ) {
        setErrorMessage(
          `${item.name} product ID එක missing. Product එක cart එකෙන් remove කරලා නැවත add කරන්න.`
        );

        return false;
      }

      if (
        !item.colorSlug?.trim()
      ) {
        setErrorMessage(
          `${item.name} colour data එක missing. Product එක cart එකෙන් remove කරලා නැවත add කරන්න.`
        );

        return false;
      }

      if (
        !item.size?.trim()
      ) {
        setErrorMessage(
          `${item.name} size එක missing.`
        );

        return false;
      }

      if (
        Number(
          item.quantity
        ) < 1
      ) {
        setErrorMessage(
          `${item.name} quantity එක වැරදියි.`
        );

        return false;
      }
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
      !primaryPhone.trim()
    ) {
      setErrorMessage(
        "Primary phone number එක ඇතුළත් කරන්න."
      );

      return false;
    }

    if (
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
      !alternativePhone.trim()
    ) {
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

  async function sendWhatsAppOrder(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      isSubmitting ||
      !validateForm()
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    /*
      Fetch එක අවසන් වන තුරු WhatsApp popup එක
      browser එකෙන් block නොවෙන්න empty tab එකක්
      කලින් open කරනවා.
    */
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
      const orderPayload = {
        orderNumber,

        orderType:
          "cart" as const,

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

        items:
          cartItems.map(
            (item) => ({
              productId:
                item.id,

              productName:
                item.name,

              colourName:
                item.color?.trim() ||
                "Not selected",

              colourSlug:
                item.colorSlug?.trim() ||
                "",

              size:
                item.size,

              quantity:
                Number(
                  item.quantity
                ),

              unitPrice:
                Number(
                  item.price
                ),
            })
          ),
      };

      const response =
        await fetch(
          "/api/orders",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                order:
                  orderPayload,
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

      const productDetails =
        cartItems
          .map(
            (
              item,
              index
            ) => {
              const itemTotal =
                Number(
                  item.price
                ) *
                Number(
                  item.quantity
                );

              const selectedColour =
                item.color?.trim() ||
                "Not selected";

              return `*${index + 1}. ${item.name}*

• Colour: ${selectedColour}
• Size: ${item.size}
• Quantity: ${item.quantity}
• Unit Price: Rs. ${Number(
                item.price
              ).toLocaleString()}
• Item Total: *Rs. ${itemTotal.toLocaleString()}*`;
            }
          )
          .join(
            "\n\n--------------------------------\n\n"
          );

      const deliveryDetails =
        hasFixedDeliveryFee
          ? `• Delivery Fee: Rs. ${databaseDeliveryFee.toLocaleString()}
• *Final Total: Rs. ${databaseFinalTotal.toLocaleString()}*`
          : `• Delivery Fee: _To be confirmed through WhatsApp_
• Final Total: _To be confirmed after calculating the delivery fee_`;

      const whatsappMessage = `*DARKY T - NEW CART ORDER*

*Order Number: ${savedOrderNumber}*

Hello DARKY T,

I would like to place the following order.

--------------------------------
*ORDER ITEMS*
--------------------------------

${productDetails}

--------------------------------
*ORDER SUMMARY*
--------------------------------

• Total Quantity: ${totalQuantity}
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

        orderType: "cart",

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

        items:
          cartItems,
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

      /*
        Order එක database එකට save වුණාට පස්සේ
        cart එක clear කරනවා.
      */
      saveCart([]);

      setSuccessMessage(
        `${savedOrderNumber} order එක database එකට save කළා. WhatsApp open කරනවා...`
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

      const message =
        error instanceof Error
          ? error.message
          : "Order එක save කරන්න බැරි වුණා.";

      setErrorMessage(
        message
      );

      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <p className="mt-5 font-bold">
            Loading cart...
          </p>
        </div>
      </main>
    );
  }

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
          className="text-sm font-bold transition hover:text-gray-300"
        >
          CONTINUE SHOPPING
        </a>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-12 md:py-14">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
          DARKY T CHECKOUT
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          YOUR CART
        </h1>

        {cartItems.length ===
        0 ? (
          <div className="mt-10 bg-white p-10 text-center shadow-sm">
            <h2 className="text-3xl font-black">
              YOUR CART IS EMPTY
            </h2>

            <p className="mt-4 text-gray-600">
              Cart එකට තවම product එකක් add කරලා නැහැ.
            </p>

            <a
              href="/#shop"
              className="mt-8 inline-block bg-black px-8 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              GO TO SHOP
            </a>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              {/* Cart items */}
              <div className="bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">
                    CART ITEMS
                  </h2>

                  <button
                    type="button"
                    onClick={
                      clearCart
                    }
                    className="border border-red-600 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                  >
                    CLEAR CART
                  </button>
                </div>

                <div className="mt-7 space-y-6">
                  {cartItems.map(
                    (
                      item,
                      index
                    ) => {
                      const itemTotal =
                        Number(
                          item.price
                        ) *
                        Number(
                          item.quantity
                        );

                      const selectedColour =
                        item.color?.trim() ||
                        "Not selected";

                      const maxStock =
                        Number(
                          item.maxStock
                        ) || null;

                      return (
                        <div
                          key={`${item.id}-${item.colorSlug || selectedColour}-${item.size}-${index}`}
                          className="border-b pb-6 last:border-b-0 last:pb-0"
                        >
                          <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="w-full overflow-hidden bg-gray-100 sm:w-36">
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="aspect-square h-full w-full object-cover"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                <div>
                                  <h3 className="text-xl font-black">
                                    {
                                      item.name
                                    }
                                  </h3>

                                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                                    <p>
                                      Colour:{" "}
                                      <span className="font-bold text-black">
                                        {
                                          selectedColour
                                        }
                                      </span>
                                    </p>

                                    <p>
                                      Size:{" "}
                                      <span className="font-bold text-black">
                                        {
                                          item.size
                                        }
                                      </span>
                                    </p>

                                    <p>
                                      Unit Price:{" "}
                                      <span className="font-bold text-black">
                                        Rs.{" "}
                                        {Number(
                                          item.price
                                        ).toLocaleString()}
                                      </span>
                                    </p>

                                    {maxStock !==
                                      null && (
                                      <p>
                                        Available:{" "}
                                        <span className="font-bold text-black">
                                          {
                                            maxStock
                                          }
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xl font-black">
                                  Rs.{" "}
                                  {itemTotal.toLocaleString()}
                                </p>
                              </div>

                              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center border border-gray-300">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      decreaseQuantity(
                                        index
                                      )
                                    }
                                    disabled={
                                      item.quantity <=
                                      1
                                    }
                                    className="h-11 w-11 text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                                  >
                                    −
                                  </button>

                                  <span className="flex h-11 min-w-12 items-center justify-center font-bold">
                                    {
                                      item.quantity
                                    }
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      increaseQuantity(
                                        index
                                      )
                                    }
                                    disabled={
                                      maxStock !==
                                        null &&
                                      item.quantity >=
                                        maxStock
                                    }
                                    className="h-11 w-11 text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(
                                      index
                                    )
                                  }
                                  className="text-sm font-bold text-red-600 underline underline-offset-4"
                                >
                                  REMOVE
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-black">
                  ORDER SUMMARY
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">
                      Total Quantity
                    </span>

                    <span className="font-bold">
                      {
                        totalQuantity
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">
                      Subtotal
                    </span>

                    <span className="font-bold">
                      Rs.{" "}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">
                      Delivery Fee
                    </span>

                    <span className="text-right font-bold">
                      {hasFixedDeliveryFee
                        ? `Rs. ${deliveryFee.toLocaleString()}`
                        : "Confirm via WhatsApp"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-black">
                      {hasFixedDeliveryFee
                        ? "FINAL TOTAL"
                        : "SUBTOTAL"}
                    </span>

                    <span className="text-2xl font-black">
                      Rs.{" "}
                      {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {!hasFixedDeliveryFee && (
                  <div className="mt-6 border border-orange-200 bg-orange-50 p-4 text-sm font-semibold leading-6 text-orange-700">
                    මුළු quantity එක 5ට වැඩි නිසා delivery fee සහ final total එක WhatsApp එකෙන් confirm කරනවා.
                  </div>
                )}

                <p className="mt-5 text-sm text-gray-500">
                  Products 1–5 සඳහා delivery fee එක Rs. 350යි.
                </p>
              </div>
            </div>

            {/* Customer form */}
            <form
              onSubmit={
                sendWhatsAppOrder
              }
              className="h-fit bg-white p-6 shadow-sm md:p-8"
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
                    value={
                      customerName
                    }
                    onChange={(event) =>
                      setCustomerName(
                        event.target
                          .value
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
                    value={
                      primaryPhone
                    }
                    onChange={(event) =>
                      setPrimaryPhone(
                        event.target
                          .value
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
                        event.target
                          .value
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
                    value={
                      district
                    }
                    onChange={(event) =>
                      setDistrict(
                        event.target
                          .value
                      )
                    }
                    className="w-full border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black"
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
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target
                          .value
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
                        event.target
                          .value
                      )
                    }
                    rows={3}
                    placeholder="Order එක ගැන විශේෂ සටහනක් තිබේ නම්"
                    className="w-full resize-none border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                  />
                </div>

                {errorMessage && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-600">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold leading-6 text-green-700">
                    {
                      successMessage
                    }
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className={`flex w-full items-center justify-center gap-3 px-6 py-4 font-black text-white transition ${
                    isSubmitting
                      ? "cursor-not-allowed bg-gray-500"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  <FaWhatsapp className="text-2xl" />

                  {isSubmitting
                    ? "SAVING ORDER..."
                    : "PLACE ORDER & OPEN WHATSAPP"}
                </button>

                                <p className="text-center text-xs leading-5 text-gray-500">
                  මුලින් order එක database එකට save වෙනවා. ඊට පස්සේ WhatsApp message එක open වෙනවා.
                </p>

                <div className="border-t border-gray-200 pt-5">
                  <p className="mb-4 text-xs font-black tracking-[0.18em] text-gray-500">
                    NEED HELP?
                  </p>

                  <div className="flex flex-col gap-3 text-sm font-semibold text-gray-600">
                    <a
                      href="/delivery"
                      className="transition hover:text-black"
                    >
                      DELIVERY INFORMATION
                    </a>

                    <a
                      href="/returns"
                      className="transition hover:text-black"
                    >
                      EXCHANGE & RETURN POLICY
                    </a>

                    <a
                      href="/contact"
                      className="transition hover:text-black"
                    >
                      CONTACT US
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}