"use client";

import {
  FormEvent,
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

type CartMessage = {
  type: "success" | "warning" | "error";
  text: string;
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

export default function CartPage() {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

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

  const [cartMessage, setCartMessage] =
    useState<CartMessage | null>(null);

  function generateOrderId(): string {
    const now = new Date();

    const year =
      now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    const randomNumber =
      Math.floor(
        1000 + Math.random() * 9000
      );

    return `DT-${year}${month}${day}-${randomNumber}`;
  }

  function showCartMessage(
    message: CartMessage
  ) {
    setCartMessage(message);

    window.setTimeout(() => {
      setCartMessage(null);
    }, 3500);
  }

  function getSafeMaxStock(
    item: CartItem
  ): number {
    const stock =
      Number(item.maxStock);

    if (
      !Number.isFinite(stock) ||
      stock <= 0
    ) {
      return Math.max(
        1,
        Number(item.quantity) || 1
      );
    }

    return Math.floor(stock);
  }

  function normalizeCart(
    items: CartItem[]
  ): CartItem[] {
    return items
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          Number(item.price) >= 0
      )
      .map((item) => {
        const maxStock =
          getSafeMaxStock(item);

        const safeQuantity =
          Math.min(
            maxStock,
            Math.max(
              1,
              Math.floor(
                Number(item.quantity) || 1
              )
            )
          );

        return {
          ...item,
          price:
            Number(item.price) || 0,
          quantity: safeQuantity,
          maxStock,
        };
      });
  }

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          "darky-cart"
        );

      if (!savedCart) {
        setCartItems([]);
      } else {
        const parsedCart =
          JSON.parse(savedCart);

        if (
          Array.isArray(parsedCart)
        ) {
          const normalizedCart =
            normalizeCart(parsedCart);

          setCartItems(
            normalizedCart
          );

          localStorage.setItem(
            "darky-cart",
            JSON.stringify(
              normalizedCart
            )
          );
        } else {
          setCartItems([]);
        }
      }

      const savedOrderId =
        localStorage.getItem(
          "darky-cart-order-id"
        );

      if (savedOrderId) {
        setOrderId(savedOrderId);
      } else {
        const newOrderId =
          generateOrderId();

        localStorage.setItem(
          "darky-cart-order-id",
          newOrderId
        );

        setOrderId(newOrderId);
      }
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function saveCart(
    updatedCart: CartItem[]
  ) {
    const normalizedCart =
      normalizeCart(updatedCart);

    setCartItems(normalizedCart);

    localStorage.setItem(
      "darky-cart",
      JSON.stringify(
        normalizedCart
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
      getSafeMaxStock(
        selectedItem
      );

    if (
      selectedItem.quantity >=
      maxStock
    ) {
      showCartMessage({
        type: "warning",
        text: `${selectedItem.name} - ${
          selectedItem.color ||
          "Selected colour"
        } - ${
          selectedItem.size
        } සඳහා maximum stock reached.`,
      });

      return;
    }

    const updatedCart =
      cartItems.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
      );

    saveCart(updatedCart);
    setErrorMessage("");
  }

  function decreaseQuantity(
    index: number
  ) {
    const updatedCart =
      cartItems.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                quantity:
                  Math.max(
                    1,
                    item.quantity - 1
                  ),
              }
            : item
      );

    saveCart(updatedCart);
    setErrorMessage("");
  }

  function removeItem(
    index: number
  ) {
    const removedItem =
      cartItems[index];

    const updatedCart =
      cartItems.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    saveCart(updatedCart);
    setErrorMessage("");

    if (removedItem) {
      showCartMessage({
        type: "success",
        text: `${removedItem.name} cart එකෙන් remove කළා.`,
      });
    }
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

    localStorage.removeItem(
      "darky-cart-order-id"
    );

    const newOrderId =
      generateOrderId();

    localStorage.setItem(
      "darky-cart-order-id",
      newOrderId
    );

    setOrderId(newOrderId);
    setErrorMessage("");

    showCartMessage({
      type: "success",
      text: "Cart එක clear කළා.",
    });
  }

  const subtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  const totalQuantity =
    cartItems.reduce(
      (total, item) =>
        total +
        item.quantity,
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
    subtotal + deliveryFee;

  function cleanPhoneNumber(
    value: string
  ): string {
    return value.replace(
      /\D/g,
      ""
    );
  }

  function formatSriLankanPhone(
    value: string
  ): string {
    const cleanedNumber =
      cleanPhoneNumber(value);

    if (
      cleanedNumber.startsWith(
        "94"
      )
    ) {
      return `+${cleanedNumber}`;
    }

    if (
      cleanedNumber.startsWith(
        "0"
      )
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
      cleanedNumber.startsWith(
        "94"
      )
    ) {
      return (
        cleanedNumber.length ===
        11
      );
    }

    if (
      cleanedNumber.startsWith(
        "0"
      )
    ) {
      return (
        cleanedNumber.length ===
        10
      );
    }

    return (
      cleanedNumber.length === 9
    );
  }

  function validateCartStock(): boolean {
    for (
      let index = 0;
      index < cartItems.length;
      index += 1
    ) {
      const item =
        cartItems[index];

      const maxStock =
        getSafeMaxStock(item);

      if (maxStock <= 0) {
        setErrorMessage(
          `${item.name} - ${
            item.color ||
            "Selected colour"
          } - ${
            item.size
          } දැනට out of stock.`
        );

        return false;
      }

      if (
        item.quantity >
        maxStock
      ) {
        setErrorMessage(
          `${item.name} - ${
            item.color ||
            "Selected colour"
          } - ${
            item.size
          } stock limit එක ${maxStock}යි.`
        );

        return false;
      }

      if (
        item.quantity < 1
      ) {
        setErrorMessage(
          `${item.name} quantity එක invalid.`
        );

        return false;
      }
    }

    return true;
  }

  function validateForm(): boolean {
    if (
      cartItems.length === 0
    ) {
      setErrorMessage(
        "Cart එකේ products කිසිවක් නැහැ."
      );

      return false;
    }

    if (
      !validateCartStock()
    ) {
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

    if (
      !district.trim()
    ) {
      setErrorMessage(
        "District එක තෝරන්න."
      );

      return false;
    }

    if (
      !address.trim()
    ) {
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

    const currentOrderId =
      orderId ||
      generateOrderId();

    if (!orderId) {
      localStorage.setItem(
        "darky-cart-order-id",
        currentOrderId
      );

      setOrderId(
        currentOrderId
      );
    }

    const formattedPrimaryPhone =
      formatSriLankanPhone(
        primaryPhone
      );

    const formattedAlternativePhone =
      formatSriLankanPhone(
        alternativePhone
      );

    const productDetails =
      cartItems
        .map(
          (item, index) => {
            const itemTotal =
              item.price *
              item.quantity;

            const selectedColour =
              item.color?.trim() ||
              "Not selected";

            return `*${index + 1}. ${item.name}*

• Colour: ${selectedColour}
• Size: ${item.size}
• Quantity: ${item.quantity}
• Unit Price: Rs. ${item.price.toLocaleString()}
• Item Total: *Rs. ${itemTotal.toLocaleString()}*`;
          }
        )
        .join(
          "\n\n--------------------------------\n\n"
        );

    const deliveryDetails =
      hasFixedDeliveryFee
        ? `• Delivery Fee: Rs. ${deliveryFee.toLocaleString()}
• *Final Total: Rs. ${finalTotal.toLocaleString()}*`
        : `• Delivery Fee: _To be confirmed through WhatsApp_
• Final Total: _To be confirmed after calculating the delivery fee_`;

    const whatsappMessage = `*DARKY T - NEW CART ORDER*

*Order ID: ${currentOrderId}*

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

    const lastOrderData = {
      orderId:
        currentOrderId,

      orderType:
        "cart",

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

      items:
        cartItems,

      totalQuantity,

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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
        <p className="font-bold">
          Loading cart...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      {cartMessage && (
        <div className="fixed left-1/2 top-5 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
          <div
            className={`border px-5 py-4 text-center text-sm font-bold shadow-xl ${
              cartMessage.type ===
              "success"
                ? "border-green-300 bg-green-50 text-green-700"
                : cartMessage.type ===
                    "warning"
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {cartMessage.text}
          </div>
        </div>
      )}

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

        {cartItems.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-gray-300 bg-white px-5 py-4">
            <span className="text-sm font-bold text-gray-500">
              ORDER ID
            </span>

            <span className="font-black tracking-wider">
              {orderId ||
                "Generating..."}
            </span>
          </div>
        )}

        {cartItems.length === 0 ? (
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
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">
                    CART ITEMS
                  </h2>

                  <button
                    type="button"
                    onClick={clearCart}
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
                        item.price *
                        item.quantity;

                      const selectedColour =
                        item.color?.trim() ||
                        "Not selected";

                      const maxStock =
                        getSafeMaxStock(
                          item
                        );

                      const isLowStock =
                        maxStock > 0 &&
                        maxStock <= 3;

                      const hasReachedStockLimit =
                        item.quantity >=
                        maxStock;

                      return (
                        <div
                          key={`${item.id}-${item.colorSlug || selectedColour}-${item.size}-${index}`}
                          className="border-b pb-6 last:border-b-0 last:pb-0"
                        >
                          <div className="flex flex-col gap-5 sm:flex-row">
                            <div className="relative w-full overflow-hidden bg-gray-100 sm:w-36">
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="aspect-square h-full w-full object-cover"
                              />

                              {isLowStock && (
                                <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[10px] font-black text-white">
                                  ONLY{" "}
                                  {
                                    maxStock
                                  }{" "}
                                  LEFT
                                </span>
                              )}
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
                                        {item.price.toLocaleString()}
                                      </span>
                                    </p>

                                    <p>
                                      Available Stock:{" "}
                                      <span
                                        className={`font-bold ${
                                          isLowStock
                                            ? "text-orange-600"
                                            : "text-black"
                                        }`}
                                      >
                                        {
                                          maxStock
                                        }
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <p className="text-xl font-black">
                                  Rs.{" "}
                                  {itemTotal.toLocaleString()}
                                </p>
                              </div>

                              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                <div>
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
                                      className={`h-11 w-11 text-xl ${
                                        item.quantity <=
                                        1
                                          ? "cursor-not-allowed text-gray-300"
                                          : "hover:bg-gray-100"
                                      }`}
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
                                        hasReachedStockLimit
                                      }
                                      className={`h-11 w-11 text-xl ${
                                        hasReachedStockLimit
                                          ? "cursor-not-allowed text-gray-300"
                                          : "hover:bg-gray-100"
                                      }`}
                                    >
                                      +
                                    </button>
                                  </div>

                                  {hasReachedStockLimit && (
                                    <p className="mt-2 text-xs font-bold text-orange-600">
                                      Maximum stock reached
                                    </p>
                                  )}
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
                      {(hasFixedDeliveryFee
                        ? finalTotal
                        : subtotal
                      ).toLocaleString()}
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
                    onChange={(
                      event
                    ) =>
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
                    value={
                      primaryPhone
                    }
                    onChange={(
                      event
                    ) =>
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
                    onChange={(
                      event
                    ) =>
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
                    onChange={(
                      event
                    ) =>
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
                    onChange={(
                      event
                    ) =>
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
                    onChange={(
                      event
                    ) =>
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

                  SEND CART ORDER VIA WHATSAPP
                </button>

                <p className="text-center text-xs leading-5 text-gray-500">
                  Order ID, cart products, colours, sizes, delivery fee සහ customer details WhatsApp message එකට යනවා.
                </p>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}