import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/utils/supabase/admin";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus =
  (typeof allowedStatuses)[number];

type RelatedProduct = {
  image?: string | null;
  images?: string[] | null;
};

type RelatedVariant = {
  images?: string[] | null;
};

type RawOrderItem = {
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

  products?:
    | RelatedProduct
    | RelatedProduct[]
    | null;

  product_variants?:
    | RelatedVariant
    | RelatedVariant[]
    | null;
};

type RawOrder = {
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
  order_items?: RawOrderItem[];
};

function isAdmin(
  request: NextRequest
) {
  const receivedPassword =
    request.headers.get(
      "x-darky-admin-password"
    );

  const correctPassword =
    process.env
      .DARKY_ADMIN_PASSWORD;

  if (!correctPassword) {
    return false;
  }

  return (
    receivedPassword ===
    correctPassword
  );
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error:
        "Admin password එක වැරදියි.",
    },
    {
      status: 401,
    }
  );
}

function firstArrayImage(
  images: unknown
) {
  if (!Array.isArray(images)) {
    return "";
  }

  const image =
    images.find(
      (value) =>
        typeof value ===
          "string" &&
        value.trim() !== ""
    );

  return typeof image ===
    "string"
    ? image.trim()
    : "";
}

function getSingleRelation<T>(
  relation:
    | T
    | T[]
    | null
    | undefined
): T | null {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

function getOrderItemImage(
  item: RawOrderItem
) {
  const variant =
    getSingleRelation(
      item.product_variants
    );

  const product =
    getSingleRelation(
      item.products
    );

  const variantImage =
    firstArrayImage(
      variant?.images
    );

  if (variantImage) {
    return variantImage;
  }

  const productMainImage =
    typeof product?.image ===
      "string"
      ? product.image.trim()
      : "";

  if (productMainImage) {
    return productMainImage;
  }

  const productGalleryImage =
    firstArrayImage(
      product?.images
    );

  if (productGalleryImage) {
    return productGalleryImage;
  }

  return "/images/product-image.jpg";
}

/*
  සියලු orders සහ
  ඒවායේ order items ලබාගන්නවා.
*/
export async function GET(
  request: NextRequest
) {
  if (!isAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const supabase =
      createAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        order_type,
        customer_name,
        primary_phone,
        alternative_phone,
        district,
        delivery_address,
        note,
        total_quantity,
        subtotal,
        delivery_fee,
        final_total,
        status,
        created_at,
        updated_at,
        order_items (
          id,
          order_id,
          product_id,
          variant_id,
          product_name,
          colour_name,
          size,
          quantity,
          unit_price,
          item_total,
          created_at,
          products (
            image,
            images
          ),
          product_variants (
            images
          )
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      throw new Error(
        error.message
      );
    }

    const rawOrders =
      (data ?? []) as RawOrder[];

    const orders =
      rawOrders.map(
        (order) => ({
          ...order,

          order_items:
            (
              order.order_items ??
              []
            ).map(
              (item) => ({
                id:
                  item.id,

                order_id:
                  item.order_id,

                product_id:
                  item.product_id,

                variant_id:
                  item.variant_id,

                product_name:
                  item.product_name,

                colour_name:
                  item.colour_name,

                size:
                  item.size,

                quantity:
                  item.quantity,

                unit_price:
                  item.unit_price,

                item_total:
                  item.item_total,

                created_at:
                  item.created_at,

                image_url:
                  getOrderItemImage(
                    item
                  ),
              })
            ),
        })
      );

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Orders load කරන්න බැරි වුණා.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}

/*
  Order status එක වෙනස් කරනවා.

  pending/cancelled සිට
  confirmed/processing/shipped/delivered
  status එකකට ගියොත් stock අඩු කරනවා.

  confirmed/processing/shipped/delivered සිට
  pending/cancelled status එකකට ගියොත්
  stock නැවත එකතු කරනවා.
*/
export async function PATCH(
  request: NextRequest
) {
  if (!isAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const body =
      await request.json();

    const orderId =
      typeof body.orderId ===
        "string"
        ? body.orderId.trim()
        : "";

    const status =
      typeof body.status ===
        "string"
        ? body.status.trim()
        : "";

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order ID එක අවශ්‍යයි.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedStatuses.includes(
        status as OrderStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Order status එක වැරදියි.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      createAdminClient();

    const {
      data: stockResult,
      error: stockError,
    } = await supabase.rpc(
      "update_order_status_with_stock",
      {
        p_order_id:
          orderId,

        p_new_status:
          status,
      }
    );

    if (stockError) {
      throw new Error(
        stockError.message
      );
    }

    const {
      data: updatedOrder,
      error: orderLoadError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        updated_at
      `)
      .eq(
        "id",
        orderId
      )
      .single();

    if (orderLoadError) {
      throw new Error(
        orderLoadError.message
      );
    }

    return NextResponse.json({
      success: true,

      order:
        updatedOrder,

      stockResult,

      message:
        "Order status සහ stock update කළා.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Order status update කරන්න බැරි වුණා.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}

/*
  Order එක සහ ඒකට අදාළ
  order items delete කරනවා.
*/
export async function DELETE(
  request: NextRequest
) {
  if (!isAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const body =
      await request.json();

    const orderId =
      typeof body.orderId ===
        "string"
        ? body.orderId.trim()
        : "";

    if (!orderId) {
      return NextResponse.json(
        {
          error:
            "Order ID එක අවශ්‍යයි.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      createAdminClient();

    const {
      data: existingOrder,
      error:
        existingOrderError,
    } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status
      `)
      .eq(
        "id",
        orderId
      )
      .single();

    if (existingOrderError) {
      throw new Error(
        existingOrderError.message
      );
    }

    const stockDeductedStatuses = [
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];

    if (
      stockDeductedStatuses.includes(
        existingOrder.status
      )
    ) {
      const {
        error:
          restoreStockError,
      } = await supabase.rpc(
        "update_order_status_with_stock",
        {
          p_order_id:
            orderId,

          p_new_status:
            "cancelled",
        }
      );

      if (restoreStockError) {
        throw new Error(
          restoreStockError.message
        );
      }
    }

    const {
      error:
        orderItemsDeleteError,
    } = await supabase
      .from("order_items")
      .delete()
      .eq(
        "order_id",
        orderId
      );

    if (
      orderItemsDeleteError
    ) {
      throw new Error(
        orderItemsDeleteError.message
      );
    }

    const {
      data:
        deletedOrder,
      error:
        orderDeleteError,
    } = await supabase
      .from("orders")
      .delete()
      .eq(
        "id",
        orderId
      )
      .select(`
        id,
        order_number
      `)
      .single();

    if (orderDeleteError) {
      throw new Error(
        orderDeleteError.message
      );
    }

    return NextResponse.json({
      success: true,

      deletedOrder,

      message:
        "Order එක delete කළා.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Order එක delete කරන්න බැරි වුණා.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}