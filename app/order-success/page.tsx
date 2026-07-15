"use client";

import {
  useEffect,
  useState,
} from "react";

type OrderItem = {
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

type LastOrder = {
  orderId: string;
  orderType: "direct" | "cart";

  customerName: string;
  primaryPhone: string;
  alternativePhone: string;

  district: string;
  address: string;
  note: string;

  items: OrderItem[];

  totalQuantity: number;
  subtotal: number;

  deliveryFee: number | null;
  finalTotal: number | null;

  createdAt: string;
};

export default function OrderSuccessPage() {
  const [order, setOrder] =
    useState<LastOrder | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    try {
      const savedOrder =
        localStorage.getItem(
          "darky-last-order"
        );

      if (!savedOrder) {
        setOrder(null);
        return;
      }

      const parsedOrder: LastOrder =
        JSON.parse(savedOrder);

      setOrder(parsedOrder);
    } catch {
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function formatOrderDate(
    value: string
  ): string {
    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "Not available";
    }

    return date.toLocaleString(
      "en-LK",
      {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function clearCompletedOrder() {
    if (!order) {
      window.location.href =
        "/#shop";

      return;
    }

    if (
      order.orderType === "direct"
    ) {
      localStorage.removeItem(
        "darky-direct-order"
      );

      localStorage.removeItem(
        "darky-direct-order-id"
      );
    }

    if (
      order.orderType === "cart"
    ) {
      localStorage.removeItem(
        "darky-cart"
      );

      localStorage.removeItem(
        "darky-cart-order-id"
      );

      window.dispatchEvent(
        new Event(
          "darky-cart-updated"
        )
      );
    }

    window.location.href =
      "/#shop";
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 text-black">
        <p className="font-bold">
          Loading order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 text-center text-black">
        <div className="w-full max-w-xl bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
            DARKY T
          </p>

          <h1 className="mt-4 text-4xl font-black">
            ORDER NOT FOUND
          </h1>

          <p className="mt-5 leading-7 text-gray-600">
            Completed order details හොයාගන්න බැහැ.
          </p>

          <a
            href="/#shop"
            className="mt-8 inline-block bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
          >
            GO TO SHOP
          </a>
        </div>
      </main>
    );
  }

  const hasConfirmedFinalTotal =
    order.finalTotal !== null;

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
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

      <section className="mx-auto max-w-4xl px-5 py-10 md:px-12 md:py-16">
        {/* Success Header */}
        <div className="bg-white p-7 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl font-black text-green-700">
            ✓
          </div>

          <p className="mt-7 text-sm font-bold tracking-[0.3em] text-gray-500">
            ORDER CREATED
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            THANK YOU
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-600">
            WhatsApp order message එක open කරලා තියෙනවා.
            Message එක send කළාට පස්සේ DARKY T team එක
            order එක confirm කරනවා.
          </p>

          <div className="mx-auto mt-8 max-w-md border-y py-5">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-500">
              ORDER ID
            </p>

            <p className="mt-2 text-2xl font-black tracking-wider">
              {order.orderId}
            </p>
          </div>
        </div>

        {/* Order Information */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black">
              ORDER INFORMATION
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-5 border-b pb-4">
                <span className="text-gray-500">
                  Order Type
                </span>

                <span className="font-bold uppercase">
                  {order.orderType}
                </span>
              </div>

              <div className="flex justify-between gap-5 border-b pb-4">
                <span className="text-gray-500">
                  Customer
                </span>

                <span className="text-right font-bold">
                  {order.customerName}
                </span>
              </div>

              <div className="flex justify-between gap-5 border-b pb-4">
                <span className="text-gray-500">
                  District
                </span>

                <span className="font-bold">
                  {order.district}
                </span>
              </div>

              <div className="flex justify-between gap-5 border-b pb-4">
                <span className="text-gray-500">
                  Total Quantity
                </span>

                <span className="font-bold">
                  {order.totalQuantity}
                </span>
              </div>

              <div className="flex justify-between gap-5">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="text-right font-bold">
                  {formatOrderDate(
                    order.createdAt
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black">
              PAYMENT SUMMARY
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-5 border-b pb-4">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-bold">
                  Rs.{" "}
                  {order.subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-5 border-b pb-4">
                <span className="text-gray-500">
                  Delivery Fee
                </span>

                <span className="text-right font-bold">
                  {order.deliveryFee !==
                  null
                    ? `Rs. ${order.deliveryFee.toLocaleString()}`
                    : "Confirm via WhatsApp"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 pt-2">
                <span className="text-lg font-black">
                  {hasConfirmedFinalTotal
                    ? "FINAL TOTAL"
                    : "SUBTOTAL"}
                </span>

                <span className="text-2xl font-black">
                  Rs.{" "}
                  {(order.finalTotal ??
                    order.subtotal
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            {!hasConfirmedFinalTotal && (
              <div className="mt-6 border border-orange-200 bg-orange-50 p-4 text-sm font-semibold leading-6 text-orange-700">
                Delivery fee සහ final total එක WhatsApp
                chat එකෙන් confirm කරනවා.
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items */}
        <div className="mt-8 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            ORDERED ITEMS
          </h2>

          <div className="mt-7 space-y-6">
            {order.items.map(
              (item, index) => {
                const itemTotal =
                  item.price *
                  item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.colorSlug || item.color}-${item.size}-${index}`}
                    className="flex flex-col gap-5 border-b pb-6 last:border-b-0 last:pb-0 sm:flex-row"
                  >
                    <div className="w-full overflow-hidden bg-gray-100 sm:w-32">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <h3 className="text-xl font-black">
                            {item.name}
                          </h3>

                          <p className="mt-2 text-sm text-gray-600">
                            Colour:{" "}
                            <span className="font-bold text-black">
                              {item.color ||
                                "Not selected"}
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Size:{" "}
                            <span className="font-bold text-black">
                              {item.size}
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Quantity:{" "}
                            <span className="font-bold text-black">
                              {item.quantity}
                            </span>
                          </p>
                        </div>

                        <p className="text-xl font-black">
                          Rs.{" "}
                          {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 border border-gray-300 bg-white p-6 text-center shadow-sm md:p-8">
          <h2 className="text-xl font-black">
            IMPORTANT
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            WhatsApp page එක open වුණාට message එක
            automatically send වෙන්නේ නැහැ. WhatsApp එකේ
            <span className="font-bold text-black">
              {" "}
              Send{" "}
            </span>
            button එක press කරන්න.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {order.orderType ===
            "cart" && (
            <a
              href="/cart"
              className="border border-black px-6 py-4 text-center font-black transition hover:bg-gray-100"
            >
              VIEW CART
            </a>
          )}

          <button
            type="button"
            onClick={
              clearCompletedOrder
            }
            className={`bg-black px-6 py-4 text-center font-black text-white transition hover:bg-gray-800 ${
              order.orderType ===
              "direct"
                ? "sm:col-span-2"
                : ""
            }`}
          >
            COMPLETE & CONTINUE SHOPPING
          </button>
        </div>
      </section>
    </main>
  );
}