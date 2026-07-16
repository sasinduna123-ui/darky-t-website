"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  const stats =
    useMemo(() => {
      return {
        total:
          orders.length,

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

        revenue:
          orders
            .filter(
              (order) =>
                order.status !==
                "cancelled"
            )
            .reduce(
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
            ),
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

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              TOTAL ORDERS
            </p>

            <p className="mt-3 text-4xl font-black">
              {stats.total}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              PENDING
            </p>

            <p className="mt-3 text-4xl font-black text-yellow-600">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              CONFIRMED
            </p>

            <p className="mt-3 text-4xl font-black text-blue-600">
              {stats.confirmed}
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-gray-500">
              DELIVERED
            </p>

            <p className="mt-3 text-4xl font-black text-green-600">
              {stats.delivered}
            </p>
          </div>

          <div className="bg-black p-6 text-white shadow-sm">
            <p className="text-sm font-bold text-gray-300">
              TOTAL VALUE
            </p>

            <p className="mt-3 text-2xl font-black">
              {formatMoney(
                stats.revenue
              )}
            </p>
          </div>
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