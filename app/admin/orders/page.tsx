"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { jsPDF } from "jspdf";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type OrderItem = {
  id: string;
  order_id: string;

  product_id: string;
  variant_id: string;

  product_name: string;
  colour_name: string;
  size: string;

  quantity: number;
  unit_price: number;
  item_total: number;

  image_url: string;

  created_at: string;
};

type Order = {
  id: string;

  order_number: string;
  order_type: "cart" | "direct";

  customer_name: string;
  primary_phone: string;
  alternative_phone: string;

  district: string;
  delivery_address: string;
  note: string;

  total_quantity: number;
  subtotal: number;
  delivery_fee: number;
  final_total: number;

  status: OrderStatus;

  created_at: string;
  updated_at: string;

  order_items: OrderItem[];
};

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function formatMoney(
  value: number
) {
  return `Rs. ${Number(
    value || 0
  ).toLocaleString()}`;
}

function formatDate(
  value: string
) {
  if (!value) {
    return "—";
  }

  return new Date(
    value
  ).toLocaleString(
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

function getStatusClasses(
  status: OrderStatus
) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";

    case "confirmed":
      return "bg-blue-100 text-blue-800";

    case "processing":
      return "bg-purple-100 text-purple-800";

    case "shipped":
      return "bg-orange-100 text-orange-800";

    case "delivered":
      return "bg-green-100 text-green-800";

    case "cancelled":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
}
async function loadImageAsDataUrl(
  imagePath: string
) {
  const response = await fetch(
    imagePath
  );

  if (!response.ok) {
    throw new Error(
      "Image එක load කරන්න බැරි වුණා."
    );
  }

  const blob =
    await response.blob();

  return await new Promise<string>(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onloadend = () =>
        resolve(
          reader.result as string
        );

      reader.onerror = reject;

      reader.readAsDataURL(
        blob
      );
    }
  );
}

async function downloadDeliveryPdf(
  order: Order
) {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
    });

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    const margin = 10;
    const contentWidth =
      pageWidth - margin * 2;

    const logoDataUrl =
      await loadImageAsDataUrl(
        "/darky-logo.png"
      );

    pdf.setFillColor(0, 0, 0);
    pdf.rect(
      0,
      0,
      pageWidth,
      31,
      "F"
    );

    pdf.addImage(
      logoDataUrl,
      "PNG",
      9,
      6,
      20,
      20
    );

    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(21);

    pdf.text(
      "DARKY T",
      pageWidth / 2 + 5,
      14,
      {
        align: "center",
      }
    );

    pdf.setFontSize(8);

    pdf.text(
      "DELIVERY INFORMATION",
      pageWidth / 2 + 5,
      22,
      {
        align: "center",
      }
    );

    let y = 39;

    pdf.setTextColor(
      0,
      0,
      0
    );

    pdf.setFillColor(
      245,
      245,
      245
    );

    pdf.roundedRect(
      margin,
      y,
      contentWidth,
      15,
      2,
      2,
      "F"
    );

    pdf.setFontSize(7);
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "ORDER NUMBER",
      margin + 5,
      y + 5
    );

    pdf.setFontSize(12);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      order.order_number,
      margin + 5,
      y + 11
    );

    y += 22;

    pdf.setFontSize(8);
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "CUSTOMER NAME",
      margin,
      y
    );

    y += 7;

    pdf.setFontSize(18);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    const nameLines =
      pdf.splitTextToSize(
        order.customer_name ||
          "—",
        contentWidth
      );

    pdf.text(
      nameLines,
      margin,
      y
    );

    y +=
      nameLines.length * 7 +
      7;

    const addressLines =
      pdf.splitTextToSize(
        order.delivery_address ||
          "—",
        contentWidth - 10
      );

    const addressBoxHeight =
      18 +
      addressLines.length * 6;

    pdf.setFillColor(
      248,
      248,
      248
    );

    pdf.roundedRect(
      margin,
      y,
      contentWidth,
      addressBoxHeight,
      2,
      2,
      "F"
    );

    pdf.setFontSize(8);
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "DELIVERY ADDRESS",
      margin + 5,
      y + 6
    );

    pdf.setFontSize(14);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      addressLines,
      margin + 5,
      y + 14
    );

    y +=
      addressBoxHeight + 8;

    const gap = 5;
    const phoneBoxWidth =
      (contentWidth - gap) / 2;

    pdf.setFillColor(
      245,
      245,
      245
    );

    pdf.roundedRect(
      margin,
      y,
      phoneBoxWidth,
      23,
      2,
      2,
      "F"
    );

    pdf.roundedRect(
      margin +
        phoneBoxWidth +
        gap,
      y,
      phoneBoxWidth,
      23,
      2,
      2,
      "F"
    );

    pdf.setFontSize(7);
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "PRIMARY PHONE",
      margin + 4,
      y + 6
    );

    pdf.text(
      "WHATSAPP NUMBER",
      margin +
        phoneBoxWidth +
        gap +
        4,
      y + 6
    );

    pdf.setFontSize(11);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      order.primary_phone ||
        "—",
      margin + 4,
      y + 15
    );

    pdf.text(
      order.alternative_phone ||
        "—",
      margin +
        phoneBoxWidth +
        gap +
        4,
      y + 15
    );

    y += 31;

    pdf.setFontSize(8);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "ORDER ITEMS",
      margin,
      y
    );

    y += 7;

    for (
      const item of
      order.order_items ?? []
    ) {
      let productImageDataUrl =
        "";

      try {
        if (item.image_url) {
          productImageDataUrl =
            await loadImageAsDataUrl(
              item.image_url
            );
        }
      } catch {
        productImageDataUrl =
          "";
      }

      const itemBoxHeight = 31;

      pdf.setFillColor(
        248,
        248,
        248
      );

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        itemBoxHeight,
        2,
        2,
        "F"
      );

      if (
        productImageDataUrl
      ) {
        pdf.addImage(
          productImageDataUrl,
          "JPEG",
          margin + 4,
          y + 4,
          23,
          23
        );
      }

      const textX =
        margin + 31;

      pdf.setFontSize(10);
      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        item.product_name ||
          "Product",
        textX,
        y + 8
      );

      pdf.setFontSize(8);
      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.text(
        `Colour: ${
          item.colour_name ||
          "—"
        }`,
        textX,
        y + 15
      );

      pdf.text(
        `Size: ${
          item.size || "—"
        }`,
        textX,
        y + 21
      );

      pdf.text(
        `Qty: ${
          item.quantity || 0
        }`,
        textX + 38,
        y + 21
      );

      y +=
        itemBoxHeight + 4;
    }

    pdf.setDrawColor(
      210,
      210,
      210
    );

    pdf.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 7;

    pdf.setFontSize(9);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      `DISTRICT: ${
        order.district || "—"
      }`,
      margin,
      y
    );

    y += 7;

    pdf.text(
      `QUANTITY: ${
        order.total_quantity ||
        0
      }`,
      margin,
      y
    );

    y += 7;

    pdf.text(
      `FINAL TOTAL: Rs. ${Number(
        order.final_total || 0
      ).toLocaleString()}`,
      margin,
      y
    );

    pdf.setFillColor(
      0,
      0,
      0
    );

    pdf.rect(
      0,
      pageHeight - 31,
      pageWidth,
      31,
      "F"
    );

    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.setFontSize(8);
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "DARKY T CONTACT DETAILS",
      pageWidth / 2,
      pageHeight - 23,
      {
        align: "center",
      }
    );

    pdf.setFontSize(7);
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "Phone / WhatsApp: 0788809678",
      pageWidth / 2,
      pageHeight - 17,
      {
        align: "center",
      }
    );

    pdf.text(
      "Email: sasinduna123@gmail.com",
      pageWidth / 2,
      pageHeight - 12,
      {
        align: "center",
      }
    );

    pdf.text(
      "Kandagaha Junction, Thanbaddegama, Ethkandura",
      pageWidth / 2,
      pageHeight - 7,
      {
        align: "center",
      }
    );

    pdf.save(
      `${order.order_number}-delivery.pdf`
    );
  } catch (error) {
    console.error(
      "PDF creation error:",
      error
    );

    alert(
      "PDF එක හදන්න බැරි වුණා. Logo file එක public/darky-logo.png ලෙස තියෙනවද බලන්න."
    );
  }
}
export default function AdminOrdersPage() {
  const [
    adminPassword,
    setAdminPassword,
  ] = useState("");

  const [
    isLoggedIn,
    setIsLoggedIn,
  ] = useState(false);

  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "all" | OrderStatus
  >("all");

  const [
    orderTypeFilter,
    setOrderTypeFilter,
  ] = useState<
    "all" | "cart" | "direct"
  >("all");

  const [
    expandedOrderId,
    setExpandedOrderId,
  ] = useState<
    string | null
  >(null);

  const [
    updatingOrderId,
    setUpdatingOrderId,
  ] = useState<
    string | null
  >(null);

  const [
    deletingOrderId,
    setDeletingOrderId,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    const savedPassword =
      sessionStorage.getItem(
        "darky-admin-password"
      );

    if (!savedPassword) {
      return;
    }

    setAdminPassword(
      savedPassword
    );

    loadOrders(
      savedPassword
    );
  }, []);

  async function loadOrders(
    password =
      adminPassword
  ) {
    if (!password.trim()) {
      setErrorMessage(
        "Admin password එක ඇතුළත් කරන්න."
      );

      return;
    }

    setIsLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/orders",
          {
            method: "GET",

            headers: {
              "x-darky-admin-password":
                password,
            },

            cache:
              "no-store",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Orders load කරන්න බැරි වුණා."
        );
      }

      const loadedOrders =
        Array.isArray(
          result.orders
        )
          ? result.orders
          : [];

      setOrders(
        loadedOrders
      );

      setIsLoggedIn(true);

      sessionStorage.setItem(
        "darky-admin-password",
        password
      );

      setMessage(
        `${loadedOrders.length} orders load කළා.`
      );
    } catch (error) {
      setIsLoggedIn(false);

      sessionStorage.removeItem(
        "darky-admin-password"
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Orders load කරන්න බැරි වුණා."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function login() {
    await loadOrders(
      adminPassword
    );
  }

  function logout() {
    sessionStorage.removeItem(
      "darky-admin-password"
    );

    setAdminPassword("");
    setOrders([]);
    setIsLoggedIn(false);
    setMessage("");
    setErrorMessage("");
  }

  async function updateStatus(
    orderId: string,
    status: OrderStatus
  ) {
    setUpdatingOrderId(
      orderId
    );

    setMessage("");
    setErrorMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/orders",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              "x-darky-admin-password":
                adminPassword,
            },

            body:
              JSON.stringify({
                orderId,
                status,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Status update කරන්න බැරි වුණා."
        );
      }

      setOrders(
        (
          currentOrders
        ) =>
          currentOrders.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    status,
                    updated_at:
                      result.order
                        ?.updated_at ||
                      new Date().toISOString(),
                  }
                : order
          )
      );

      setMessage(
        "Order status එක update කළා."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Status update කරන්න බැරි වුණා."
      );
    } finally {
      setUpdatingOrderId(
        null
      );
    }
  }

  async function deleteOrder(
    order: Order
  ) {
    const confirmed =
      window.confirm(
        `${order.order_number} order එක delete කරන්නද?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingOrderId(
      order.id
    );

    setMessage("");
    setErrorMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/orders",
          {
            method:
              "DELETE",

            headers: {
              "Content-Type":
                "application/json",

              "x-darky-admin-password":
                adminPassword,
            },

            body:
              JSON.stringify({
                orderId:
                  order.id,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Order delete කරන්න බැරි වුණා."
        );
      }

      setOrders(
        (
          currentOrders
        ) =>
          currentOrders.filter(
            (
              currentOrder
            ) =>
              currentOrder.id !==
              order.id
          )
      );

      setMessage(
        `${order.order_number} order එක delete කළා.`
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Order delete කරන්න බැරි වුණා."
      );
    } finally {
      setDeletingOrderId(
        null
      );
    }
  }

  const filteredOrders =
    useMemo(() => {
      const normalizedSearch =
        searchText
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesStatus =
            statusFilter ===
              "all" ||
            order.status ===
              statusFilter;

          const matchesType =
            orderTypeFilter ===
              "all" ||
            order.order_type ===
              orderTypeFilter;

          const searchableText = [
            order.order_number,
            order.customer_name,
            order.primary_phone,
            order.alternative_phone,
            order.district,
            order.delivery_address,
            order.status,
            order.order_type,
          ]
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            searchableText.includes(
              normalizedSearch
            );

          return (
            matchesStatus &&
            matchesType &&
            matchesSearch
          );
        }
      );
    }, [
      orders,
      searchText,
      statusFilter,
      orderTypeFilter,
    ]);

  const dashboard =
    useMemo(() => {
      const now = new Date();

      const startOfToday =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

      const startOfMonth =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

      const validOrders =
        orders.filter(
          (order) =>
            order.status !==
            "cancelled"
        );

      const todayOrders =
        orders.filter(
          (order) =>
            new Date(
              order.created_at
            ) >= startOfToday
        );

      const monthOrders =
        validOrders.filter(
          (order) =>
            new Date(
              order.created_at
            ) >= startOfMonth
        );

      const revenue =
        validOrders.reduce(
          (
            total,
            order
          ) =>
            total +
            Number(
              order.final_total ||
                0
            ),
          0
        );

      const monthRevenue =
        monthOrders.reduce(
          (
            total,
            order
          ) =>
            total +
            Number(
              order.final_total ||
                0
            ),
          0
        );

      const totalItems =
        validOrders.reduce(
          (
            total,
            order
          ) =>
            total +
            Number(
              order.total_quantity ||
                0
            ),
          0
        );

      const productMap =
        new Map<
          string,
          {
            name: string;
            quantity: number;
            revenue: number;
          }
        >();

      validOrders.forEach(
        (order) => {
          (
            order.order_items ??
            []
          ).forEach(
            (item) => {
              const key =
                item.product_id ||
                item.product_name;

              const current =
                productMap.get(
                  key
                ) || {
                  name:
                    item.product_name ||
                    "Product",
                  quantity: 0,
                  revenue: 0,
                };

              current.quantity +=
                Number(
                  item.quantity ||
                    0
                );

              current.revenue +=
                Number(
                  item.item_total ||
                    0
                );

              productMap.set(
                key,
                current
              );
            }
          );
        }
      );

      const bestSellingProducts =
        Array.from(
          productMap.values()
        )
          .sort(
            (a, b) =>
              b.quantity -
              a.quantity
          )
          .slice(0, 5);

      const recentOrders =
        [...orders]
          .sort(
            (a, b) =>
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
          )
          .slice(0, 5);

      const statusCounts =
        statuses.map(
          (status) => ({
            status,
            count:
              orders.filter(
                (order) =>
                  order.status ===
                  status
              ).length,
          })
        );

      return {
        total:
          orders.length,

        today:
          todayOrders.length,

        pending:
          orders.filter(
            (order) =>
              order.status ===
              "pending"
          ).length,

        confirmed:
          orders.filter(
            (order) =>
              order.status ===
              "confirmed"
          ).length,

        delivered:
          orders.filter(
            (order) =>
              order.status ===
              "delivered"
          ).length,

        cancelled:
          orders.filter(
            (order) =>
              order.status ===
              "cancelled"
          ).length,

        revenue,
        monthRevenue,
        totalItems,

        averageOrder:
          validOrders.length > 0
            ? revenue /
              validOrders.length
            : 0,

        bestSellingProducts,
        recentOrders,
        statusCounts,
      };
    }, [orders]);

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5 text-black">
        <div className="w-full max-w-md bg-white p-7 shadow-lg md:p-10">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
            DARKY T ADMIN
          </p>

          <h1 className="mt-3 text-4xl font-black">
            ORDERS LOGIN
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Product admin page එකට භාවිතා කරන password එකම ඇතුළත් කරන්න.
          </p>

          <div className="mt-7">
            <label className="mb-2 block text-sm font-black">
              ADMIN PASSWORD
            </label>

            <input
              type="password"
              value={
                adminPassword
              }
              onChange={(event) =>
                setAdminPassword(
                  event.target
                    .value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  login();
                }
              }}
              placeholder="Enter admin password"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {errorMessage && (
            <div className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={login}
            disabled={
              isLoading
            }
            className={`mt-6 w-full px-6 py-4 font-black text-white ${
              isLoading
                ? "cursor-not-allowed bg-gray-500"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isLoading
              ? "LOADING..."
              : "LOGIN TO ORDERS"}
          </button>

          <a
            href="/admin"
            className="mt-5 block text-center text-sm font-bold underline underline-offset-4"
          >
            GO TO PRODUCT ADMIN
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <nav className="bg-black px-5 py-5 text-white md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <a
            href="/"
            className="text-xl font-black tracking-[0.25em] sm:text-2xl"
          >
            DARKY T
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/admin"
              className="border border-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black"
            >
              PRODUCTS
            </a>

            <button
              type="button"
              onClick={() =>
                loadOrders()
              }
              disabled={
                isLoading
              }
              className="border border-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black disabled:opacity-50"
            >
              REFRESH
            </button>

            <button
              type="button"
              onClick={logout}
              className="bg-red-600 px-4 py-2 text-sm font-bold hover:bg-red-700"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-12 md:py-14">
        <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
          DARKY T ADMIN
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">
              ORDER MANAGER
            </h1>

            <p className="mt-4 text-gray-600">
              Cart සහ direct orders manage කරන්න.
            </p>
          </div>

          <p className="font-bold text-gray-600">
            Showing{" "}
            {
              filteredOrders.length
            }{" "}
            of {orders.length}
          </p>
        </div>

        {message && (
          <div className="mt-6 border border-green-200 bg-green-50 p-4 font-bold text-green-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 font-bold text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              TOTAL ORDERS
            </p>
            <p className="mt-3 text-4xl font-black">
              {dashboard.total}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              TODAY ORDERS
            </p>
            <p className="mt-3 text-4xl font-black text-purple-600">
              {dashboard.today}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              TOTAL ITEMS SOLD
            </p>
            <p className="mt-3 text-4xl font-black text-blue-600">
              {dashboard.totalItems}
            </p>
          </div>

          <div className="bg-black p-6 text-white shadow-sm">
            <p className="text-sm font-bold text-gray-300">
              TOTAL REVENUE
            </p>
            <p className="mt-3 text-2xl font-black">
              {formatMoney(
                dashboard.revenue
              )}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              THIS MONTH REVENUE
            </p>
            <p className="mt-3 text-2xl font-black text-green-600">
              {formatMoney(
                dashboard.monthRevenue
              )}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              AVERAGE ORDER VALUE
            </p>
            <p className="mt-3 text-2xl font-black">
              {formatMoney(
                dashboard.averageOrder
              )}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              PENDING ORDERS
            </p>
            <p className="mt-3 text-4xl font-black text-yellow-600">
              {dashboard.pending}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              CANCELLED ORDERS
            </p>
            <p className="mt-3 text-4xl font-black text-red-600">
              {dashboard.cancelled}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-gray-500">
                  SALES
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  BEST SELLING PRODUCTS
                </h2>
              </div>
            </div>

            {dashboard.bestSellingProducts.length ===
            0 ? (
              <p className="mt-6 text-gray-500">
                Product sales data නැහැ.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {dashboard.bestSellingProducts.map(
                  (
                    product,
                    index
                  ) => (
                    <div
                      key={`${product.name}-${index}`}
                      className="flex items-center justify-between gap-5 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-black font-black text-white">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-black">
                            {product.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.quantity} items sold
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 font-black">
                        {formatMoney(
                          product.revenue
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-500">
              OVERVIEW
            </p>
            <h2 className="mt-2 text-2xl font-black">
              ORDER STATUS SUMMARY
            </h2>

            <div className="mt-6 space-y-4">
              {dashboard.statusCounts.map(
                (item) => {
                  const percentage =
                    dashboard.total > 0
                      ? Math.round(
                          (item.count /
                            dashboard.total) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={
                        item.status
                      }
                    >
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <span className="font-black uppercase">
                          {item.status}
                        </span>
                        <span className="text-sm font-bold text-gray-500">
                          {item.count} ({percentage}%)
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden bg-gray-200">
                        <div
                          className="h-full bg-black"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-gray-500">
                LATEST ACTIVITY
              </p>
              <h2 className="mt-2 text-2xl font-black">
                RECENT ORDERS
              </h2>
            </div>

            <p className="text-sm font-bold text-gray-500">
              Latest 5 orders
            </p>
          </div>

          {dashboard.recentOrders.length ===
          0 ? (
            <p className="mt-6 text-gray-500">
              Orders නැහැ.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-4 py-3">
                      Order
                    </th>
                    <th className="px-4 py-3">
                      Customer
                    </th>
                    <th className="px-4 py-3">
                      Status
                    </th>
                    <th className="px-4 py-3">
                      Items
                    </th>
                    <th className="px-4 py-3">
                      Total
                    </th>
                    <th className="px-4 py-3">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentOrders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b"
                      >
                        <td className="px-4 py-4 font-black">
                          {order.order_number}
                        </td>
                        <td className="px-4 py-4">
                          {order.customer_name}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-black uppercase ${getStatusClasses(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {order.total_quantity}
                        </td>
                        <td className="px-4 py-4 font-black">
                          {formatMoney(
                            order.final_total
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {formatDate(
                            order.created_at
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-5 bg-white p-6 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-black">
              SEARCH
            </label>

            <input
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target
                    .value
                )
              }
              placeholder="Order no, customer, phone..."
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black">
              STATUS
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as
                    | "all"
                    | OrderStatus
                )
              }
              className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="all">
                All statuses
              </option>

              {statuses.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.toUpperCase()}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-black">
              ORDER TYPE
            </label>

            <select
              value={
                orderTypeFilter
              }
              onChange={(event) =>
                setOrderTypeFilter(
                  event.target
                    .value as
                    | "all"
                    | "cart"
                    | "direct"
                )
              }
              className="w-full border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="all">
                All order types
              </option>

              <option value="cart">
                CART
              </option>

              <option value="direct">
                DIRECT
              </option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 bg-white p-12 text-center shadow-sm">
            <p className="font-black">
              LOADING ORDERS...
            </p>
          </div>
        ) : filteredOrders.length ===
          0 ? (
          <div className="mt-8 bg-white p-12 text-center shadow-sm">
            <h2 className="text-3xl font-black">
              NO ORDERS FOUND
            </h2>

            <p className="mt-3 text-gray-600">
              Filters වෙනස් කරලා නැවත බලන්න.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {filteredOrders.map(
              (order) => {
                const isExpanded =
                  expandedOrderId ===
                  order.id;

                return (
                  <article
                    key={order.id}
                    className="overflow-hidden bg-white shadow-sm"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col justify-between gap-6 xl:flex-row">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl font-black">
                              {
                                order.order_number
                              }
                            </h2>

                            <span
                              className={`px-3 py-1 text-xs font-black uppercase ${getStatusClasses(
                                order.status
                              )}`}
                            >
                              {
                                order.status
                              }
                            </span>

                            <span className="bg-black px-3 py-1 text-xs font-black uppercase text-white">
                              {
                                order.order_type
                              }
                            </span>
                          </div>

                          <p className="mt-3 text-sm text-gray-500">
                            Created:{" "}
                            {formatDate(
                              order.created_at
                            )}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Updated:{" "}
                            {formatDate(
                              order.updated_at
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
                          <div>
                            <label className="mb-2 block text-xs font-black text-gray-500">
                              CHANGE STATUS
                            </label>

                            <select
                              value={
                                order.status
                              }
                              disabled={
                                updatingOrderId ===
                                order.id
                              }
                              onChange={(event) =>
                                updateStatus(
                                  order.id,
                                  event.target
                                    .value as OrderStatus
                                )
                              }
                              className="border border-gray-300 bg-white px-4 py-3 font-bold outline-none focus:border-black disabled:opacity-50"
                            >
                              {statuses.map(
                                (
                                  status
                                ) => (
                                  <option
                                    key={
                                      status
                                    }
                                    value={
                                      status
                                    }
                                  >
                                    {status.toUpperCase()}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
<button
  type="button"
  onClick={() =>
    downloadDeliveryPdf(order)
  }
  className="bg-green-600 px-5 py-3 font-black text-white hover:bg-green-700"
>
  DOWNLOAD DELIVERY PDF
</button>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrderId(
                                isExpanded
                                  ? null
                                  : order.id
                              )
                            }
                            className="bg-black px-5 py-3 font-black text-white hover:bg-gray-800"
                          >
                            {isExpanded
                              ? "HIDE DETAILS"
                              : "VIEW DETAILS"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingOrderId ===
                              order.id
                            }
                            onClick={() =>
                              deleteOrder(
                                order
                              )
                            }
                            className="bg-red-600 px-5 py-3 font-black text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingOrderId ===
                            order.id
                              ? "DELETING..."
                              : "DELETE"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="border p-4">
                          <p className="text-xs font-bold text-gray-500">
                            CUSTOMER
                          </p>

                          <p className="mt-2 font-black">
                            {
                              order.customer_name
                            }
                          </p>
                        </div>

                        <div className="border p-4">
                          <p className="text-xs font-bold text-gray-500">
                            PHONE
                          </p>

                          <a
                            href={`tel:${order.primary_phone}`}
                            className="mt-2 block font-black hover:underline"
                          >
                            {
                              order.primary_phone
                            }
                          </a>
                        </div>

                        <div className="border p-4">
                          <p className="text-xs font-bold text-gray-500">
                            QUANTITY
                          </p>

                          <p className="mt-2 font-black">
                            {
                              order.total_quantity
                            }
                          </p>
                        </div>

                        <div className="border p-4">
                          <p className="text-xs font-bold text-gray-500">
                            FINAL TOTAL
                          </p>

                          <p className="mt-2 font-black">
                            {formatMoney(
                              order.final_total
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t bg-gray-50 p-6 md:p-8">
                        <div className="grid gap-8 lg:grid-cols-2">
                          <div>
                            <h3 className="text-xl font-black">
                              CUSTOMER DETAILS
                            </h3>

                            <div className="mt-5 space-y-3 text-sm">
                              <p>
                                <strong>
                                  Name:
                                </strong>{" "}
                                {
                                  order.customer_name
                                }
                              </p>

                              <p>
                                <strong>
                                  Primary phone:
                                </strong>{" "}
                                <a
                                  href={`tel:${order.primary_phone}`}
                                  className="underline"
                                >
                                  {
                                    order.primary_phone
                                  }
                                </a>
                              </p>

                              <p>
                                <strong>
  WhatsApp number:
</strong>{" "}
<a
  href={`https://wa.me/${order.alternative_phone.replace(/\D/g, "")}`}
  target="_blank"
  rel="noopener noreferrer"
  className="underline"
>
  {order.alternative_phone}
</a>
                              </p>

                              <p>
                                <strong>
                                  District:
                                </strong>{" "}
                                {
                                  order.district
                                }
                              </p>

                              <p>
                                <strong>
                                  Address:
                                </strong>{" "}
                                {
                                  order.delivery_address
                                }
                              </p>

                              <p>
                                <strong>
                                  Note:
                                </strong>{" "}
                                {order.note ||
                                  "No special note"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-black">
                              PAYMENT SUMMARY
                            </h3>

                            <div className="mt-5 space-y-4">
                              <div className="flex justify-between border-b pb-3">
                                <span>
                                  Subtotal
                                </span>

                                <strong>
                                  {formatMoney(
                                    order.subtotal
                                  )}
                                </strong>
                              </div>

                              <div className="flex justify-between border-b pb-3">
                                <span>
                                  Delivery fee
                                </span>

                                <strong>
                                  {formatMoney(
                                    order.delivery_fee
                                  )}
                                </strong>
                              </div>

                              <div className="flex justify-between text-lg font-black">
                                <span>
                                  Final total
                                </span>

                                <span>
                                  {formatMoney(
                                    order.final_total
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-9">
                          <h3 className="text-xl font-black">
                            ORDER ITEMS
                          </h3>

                          <div className="mt-5 overflow-x-auto">
                            <table className="min-w-full border-collapse bg-white text-left">
                              <thead>
                                <tr className="bg-black text-white">
                                  <th className="px-4 py-3">
                                    Product
                                  </th>

                                  <th className="px-4 py-3">
                                    Colour
                                  </th>

                                  <th className="px-4 py-3">
                                    Size
                                  </th>

                                  <th className="px-4 py-3">
                                    Qty
                                  </th>

                                  <th className="px-4 py-3">
                                    Unit price
                                  </th>

                                  <th className="px-4 py-3">
                                    Total
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {order.order_items?.map(
                                  (
                                    item
                                  ) => (
                                    <tr
                                      key={
                                        item.id
                                      }
                                      className="border-b"
                                    >
                                      <td className="px-4 py-4 font-black">
                                        {
                                          item.product_name
                                        }
                                      </td>

                                      <td className="px-4 py-4">
                                        {
                                          item.colour_name
                                        }
                                      </td>

                                      <td className="px-4 py-4">
                                        {
                                          item.size
                                        }
                                      </td>

                                      <td className="px-4 py-4">
                                        {
                                          item.quantity
                                        }
                                      </td>

                                      <td className="px-4 py-4">
                                        {formatMoney(
                                          item.unit_price
                                        )}
                                      </td>

                                      <td className="px-4 py-4 font-black">
                                        {formatMoney(
                                          item.item_total
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}