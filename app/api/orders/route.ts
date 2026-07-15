import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/utils/supabase/admin";

type OrderItemInput = {
  productId: string;
  productName: string;

  colourName: string;
  colourSlug: string;

  size: string;
  quantity: number;
  unitPrice: number;
};

type CreateOrderInput = {
  orderNumber: string;

  orderType:
    | "cart"
    | "direct";

  customerName: string;
  primaryPhone: string;
  alternativePhone: string;

  district: string;
  deliveryAddress: string;
  note: string;

  items: OrderItemInput[];
};

type PreparedOrderItem = {
  productId: string;
  variantId: string;
  productName: string;
  colourName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
};

async function sendWhatsAppOrderNotification({
  order,
  preparedItems,
  totalQuantity,
  subtotal,
  deliveryFee,
  finalTotal,
}: {
  order: CreateOrderInput;
  preparedItems: PreparedOrderItem[];
  totalQuantity: number;
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
}) {
  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN?.trim();

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  const adminNumber =
    process.env.WHATSAPP_ADMIN_NUMBER?.replace(
      /\D/g,
      ""
    );

  const graphApiVersion =
    process.env.WHATSAPP_GRAPH_API_VERSION?.trim() ||
    "v25.0";

  const templateName =
    process.env.WHATSAPP_TEMPLATE_NAME?.trim() ||
    "hello_world";

  const templateLanguage =
    process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() ||
    "en_US";

  if (
    !accessToken ||
    !phoneNumberId ||
    !adminNumber
  ) {
    return {
      sent: false,
      skipped: true,
      error:
        "WhatsApp environment variables are not configured.",
    };
  }

  const itemSummary = preparedItems
    .map(
      (item) =>
        `${item.productName} | ${item.colourName} | ${item.size} x ${item.quantity}`
    )
    .join(", ");

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: adminNumber,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: templateLanguage,
      },
    },
  };

  if (
    templateName ===
    "darky_t_new_order"
  ) {
    payload.template = {
      name: templateName,
      language: {
        code: templateLanguage,
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: cleanText(
                order.orderNumber
              ),
            },
            {
              type: "text",
              text: cleanText(
                order.customerName
              ),
            },
            {
              type: "text",
              text: cleanText(
                order.primaryPhone
              ),
            },
            {
              type: "text",
              text: cleanText(
                order.district
              ),
            },
            {
              type: "text",
              text: itemSummary.slice(
                0,
                900
              ),
            },
            {
              type: "text",
              text: String(
                totalQuantity
              ),
            },
            {
              type: "text",
              text: String(
                subtotal
              ),
            },
            {
              type: "text",
              text: String(
                deliveryFee
              ),
            },
            {
              type: "text",
              text: String(
                finalTotal
              ),
            },
          ],
        },
      ],
    };
  }

  const response = await fetch(
    `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${accessToken}`,

        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify(
          payload
        ),

      cache: "no-store",
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    const apiError =
      result?.error?.message ||
      "WhatsApp notification failed.";

    throw new Error(
      apiError
    );
  }

  return {
    sent: true,
    skipped: false,
    messageId:
      result?.messages?.[0]?.id ||
      null,
  };
}

function cleanText(
  value: unknown
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function cleanPositiveNumber(
  value: unknown
): number {
  const numberValue =
    Number(value);

  if (
    !Number.isFinite(
      numberValue
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    numberValue
  );
}

function validateOrder(
  order: CreateOrderInput
): string {
  if (
    !cleanText(
      order.orderNumber
    )
  ) {
    return "Order number එක අවශ්‍යයි.";
  }

  if (
    order.orderType !==
      "cart" &&
    order.orderType !==
      "direct"
  ) {
    return "Order type එක වැරදියි.";
  }

  if (
    !cleanText(
      order.customerName
    )
  ) {
    return "Customer name එක අවශ්‍යයි.";
  }

  if (
    !cleanText(
      order.primaryPhone
    )
  ) {
    return "Primary phone number එක අවශ්‍යයි.";
  }

  if (
    !cleanText(
      order.alternativePhone
    )
  ) {
    return "Alternative phone number එක අවශ්‍යයි.";
  }

  if (
    !cleanText(
      order.district
    )
  ) {
    return "District එක අවශ්‍යයි.";
  }

  if (
    !cleanText(
      order.deliveryAddress
    )
  ) {
    return "Delivery address එක අවශ්‍යයි.";
  }

  if (
    !Array.isArray(
      order.items
    ) ||
    order.items.length ===
      0
  ) {
    return "Order items අවශ්‍යයි.";
  }

  for (
    let index = 0;
    index <
    order.items.length;
    index += 1
  ) {
    const item =
      order.items[index];

    if (
      !cleanText(
        item.productId
      )
    ) {
      return `Item ${
        index + 1
      } product ID එක නැහැ.`;
    }

    if (
      !cleanText(
        item.productName
      )
    ) {
      return `Item ${
        index + 1
      } product name එක නැහැ.`;
    }

    if (
      !cleanText(
        item.colourSlug
      )
    ) {
      return `Item ${
        index + 1
      } colour එක නැහැ.`;
    }

    if (
      !cleanText(
        item.size
      )
    ) {
      return `Item ${
        index + 1
      } size එක නැහැ.`;
    }

    if (
      cleanPositiveNumber(
        item.quantity
      ) < 1
    ) {
      return `Item ${
        index + 1
      } quantity එක වැරදියි.`;
    }

    if (
      cleanPositiveNumber(
        item.unitPrice
      ) <= 0
    ) {
      return `Item ${
        index + 1
      } price එක වැරදියි.`;
    }
  }

  return "";
}

async function findVariant(
  productId: string,
  colourSlug: string
) {
  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from(
      "product_variants"
    )
    .select(`
      id,
      name,
      slug,
      product_stock (
        id,
        size,
        quantity
      )
    `)
    .eq(
      "product_id",
      productId
    )
    .eq(
      "slug",
      colourSlug
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}

export async function POST(
  request: NextRequest
) {
  const supabase =
    createAdminClient();

  let createdOrderId:
    | string
    | null = null;

  try {
    const body =
      (await request.json()) as {
        order:
          CreateOrderInput;
      };

    const order =
      body.order;

    const validationError =
      validateOrder(order);

    if (validationError) {
      return NextResponse.json(
        {
          error:
            validationError,
        },
        {
          status: 400,
        }
      );
    }

    const {
      data:
        existingOrder,
      error:
        existingOrderError,
    } = await supabase
      .from("orders")
      .select("id")
      .eq(
        "order_number",
        cleanText(
          order.orderNumber
        )
      )
      .maybeSingle();

    if (
      existingOrderError
    ) {
      throw new Error(
        existingOrderError.message
      );
    }

    if (existingOrder) {
      return NextResponse.json(
        {
          error:
            "මේ order number එක දැනටමත් database එකේ තියෙනවා.",
        },
        {
          status: 409,
        }
      );
    }

    const preparedItems:
      PreparedOrderItem[] = [];

    for (
      const item of
      order.items
    ) {
      const variant =
        await findVariant(
          cleanText(
            item.productId
          ),
          cleanText(
            item.colourSlug
          )
        );

      if (!variant) {
        return NextResponse.json(
          {
            error:
              `${item.productName} product එකේ selected colour එක හොයාගන්න බැහැ.`,
          },
          {
            status: 404,
          }
        );
      }

      const stockRows =
        Array.isArray(
          variant.product_stock
        )
          ? variant.product_stock
          : [];

      const selectedStock =
        stockRows.find(
          (stockRow) =>
            stockRow.size ===
            cleanText(
              item.size
            )
        );

      const availableQuantity =
        Number(
          selectedStock
            ?.quantity ?? 0
        );

      const requestedQuantity =
        Math.floor(
          cleanPositiveNumber(
            item.quantity
          )
        );

      if (
        availableQuantity <
        requestedQuantity
      ) {
        return NextResponse.json(
          {
            error:
              `${item.productName} - ${variant.name} - ${item.size} stock ප්‍රමාණවත් නැහැ. Available stock: ${availableQuantity}`,
          },
          {
            status: 409,
          }
        );
      }

      const unitPrice =
        cleanPositiveNumber(
          item.unitPrice
        );

      preparedItems.push({
        productId:
          cleanText(
            item.productId
          ),

        variantId:
          variant.id,

        productName:
          cleanText(
            item.productName
          ),

        colourName:
          variant.name,

        size:
          cleanText(
            item.size
          ),

        quantity:
          requestedQuantity,

        unitPrice,

        itemTotal:
          unitPrice *
          requestedQuantity,
      });
    }

    const totalQuantity =
      preparedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,
        0
      );

    const subtotal =
      preparedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          item.itemTotal,
        0
      );

    const deliveryFee =
      totalQuantity <= 5
        ? 350
        : 0;

    const finalTotal =
      totalQuantity <= 5
        ? subtotal +
          deliveryFee
        : subtotal;

    const {
      data:
        createdOrder,
      error:
        orderError,
    } = await supabase
      .from("orders")
      .insert({
        order_number:
          cleanText(
            order.orderNumber
          ),

        order_type:
          order.orderType,

        customer_name:
          cleanText(
            order.customerName
          ),

        primary_phone:
          cleanText(
            order.primaryPhone
          ),

        alternative_phone:
          cleanText(
            order.alternativePhone
          ),

        district:
          cleanText(
            order.district
          ),

        delivery_address:
          cleanText(
            order.deliveryAddress
          ),

        note:
          cleanText(
            order.note
          ),

        total_quantity:
          totalQuantity,

        subtotal,

        delivery_fee:
          deliveryFee,

        final_total:
          finalTotal,

        status:
          "pending",
      })
      .select(`
        id,
        order_number
      `)
      .single();

    if (
      orderError ||
      !createdOrder
    ) {
      throw new Error(
        orderError
          ?.message ||
          "Order save failed."
      );
    }

    createdOrderId =
      createdOrder.id;

    const orderItemRows =
      preparedItems.map(
        (item) => ({
          order_id:
            createdOrder.id,

          product_id:
            item.productId,

          variant_id:
            item.variantId,

          product_name:
            item.productName,

          colour_name:
            item.colourName,

          size:
            item.size,

          quantity:
            item.quantity,

          unit_price:
            item.unitPrice,

          item_total:
            item.itemTotal,
        })
      );

    const {
      error:
        orderItemsError,
    } = await supabase
      .from("order_items")
      .insert(
        orderItemRows
      );

    if (orderItemsError) {
      throw new Error(
        orderItemsError.message
      );
    }

    let whatsappNotification = {
      sent: false,
      skipped: false,
      error: "",
    };

    try {
      const notificationResult =
        await sendWhatsAppOrderNotification({
          order,
          preparedItems,
          totalQuantity,
          subtotal,
          deliveryFee,
          finalTotal,
        });

      whatsappNotification = {
        sent:
          notificationResult.sent,

        skipped:
          notificationResult.skipped,

        error:
          notificationResult.error ||
          "",
      };
    } catch (notificationError) {
      whatsappNotification = {
        sent: false,
        skipped: false,

        error:
          notificationError instanceof
          Error
            ? notificationError.message
            : "WhatsApp notification failed.",
      };

      console.error(
        "WhatsApp order notification error:",
        notificationError
      );
    }

    return NextResponse.json({
      success: true,

      orderId:
        createdOrder.id,

      orderNumber:
        createdOrder.order_number,

      totalQuantity,
      subtotal,
      deliveryFee,
      finalTotal,

      whatsappNotification,

      message:
        whatsappNotification.sent
          ? "Order එක save කරලා WhatsApp notification එකත් යැව්වා."
          : "Order එක save කළා. WhatsApp notification එක යවන්න බැරි වුණා.",
    });
  } catch (error) {
    if (createdOrderId) {
      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          createdOrderId
        );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Order save කරන්න බැරි වුණා.";

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