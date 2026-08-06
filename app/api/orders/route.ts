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
  promoCode?: string;

  items: OrderItemInput[];
};


type PromoCodeRow = {
  id: string;
  code: string;
  discount_type:
    | "percentage"
    | "fixed";
  discount_value: number;
  minimum_order: number | null;
  usage_limit: number | null;
  used_count: number | null;
  expires_at: string | null;
  is_active: boolean;
};

type ValidatedPromo = {
  id: string;
  code: string;
  discountAmount: number;
};

async function validatePromoCode(
  promoCode: string,
  subtotal: number
): Promise<ValidatedPromo | null> {
  const cleanCode =
    cleanText(promoCode)
      .toUpperCase();

  if (!cleanCode) {
    return null;
  }

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from("promo_codes")
    .select(`
      id,
      code,
      discount_type,
      discount_value,
      minimum_order,
      usage_limit,
      used_count,
      expires_at,
      is_active
    `)
    .eq("code", cleanCode)
    .maybeSingle<PromoCodeRow>();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!data) {
    throw new Error(
      "Promo code එක වැරදියි."
    );
  }

  if (!data.is_active) {
    throw new Error(
      "මේ promo code එක inactive."
    );
  }

  if (
    data.expires_at &&
    new Date(
      data.expires_at
    ).getTime() <= Date.now()
  ) {
    throw new Error(
      "මේ promo code එක expire වෙලා."
    );
  }

  const usageLimit =
    data.usage_limit === null
      ? null
      : Number(
          data.usage_limit
        );

  const usedCount =
    Number(
      data.used_count || 0
    );

  if (
    usageLimit !== null &&
    usedCount >= usageLimit
  ) {
    throw new Error(
      "මේ promo code එකේ usage limit එක අවසන්."
    );
  }

  const minimumOrder =
    Math.max(
      0,
      Number(
        data.minimum_order || 0
      )
    );

  if (
    subtotal < minimumOrder
  ) {
    throw new Error(
      `මේ promo code එකට අවම order amount එක Rs. ${minimumOrder.toLocaleString()}යි.`
    );
  }

  const discountValue =
    Number(
      data.discount_value
    );

  if (
    !Number.isFinite(
      discountValue
    ) ||
    discountValue <= 0
  ) {
    throw new Error(
      "Promo discount value එක invalid."
    );
  }

  let discountAmount = 0;

  if (
    data.discount_type ===
    "percentage"
  ) {
    discountAmount =
      subtotal *
      (
        Math.min(
          100,
          discountValue
        ) / 100
      );
  } else if (
    data.discount_type ===
    "fixed"
  ) {
    discountAmount =
      discountValue;
  } else {
    throw new Error(
      "Promo discount type එක invalid."
    );
  }

  return {
    id: data.id,
    code: data.code,
    discountAmount:
      Math.min(
        subtotal,
        Math.max(
          0,
          Math.round(
            discountAmount
          )
        )
      ),
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

    const preparedItems = [];

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

    const validatedPromo =
      await validatePromoCode(
        order.promoCode || "",
        subtotal
      );

    const discountAmount =
      validatedPromo
        ?.discountAmount || 0;

    const discountedSubtotal =
      Math.max(
        0,
        subtotal -
          discountAmount
      );

    const deliveryFee =
      totalQuantity <= 5
        ? 350
        : 0;

    const finalTotal =
      totalQuantity <= 5
        ? discountedSubtotal +
          deliveryFee
        : discountedSubtotal;

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

        promo_code:
          validatedPromo?.code ||
          null,

        discount_amount:
          discountAmount,

        discounted_subtotal:
          discountedSubtotal,

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

    if (validatedPromo) {
      const {
        data: currentPromo,
        error:
          currentPromoError,
      } = await supabase
        .from("promo_codes")
        .select(`
          used_count,
          usage_limit
        `)
        .eq(
          "id",
          validatedPromo.id
        )
        .single();

      if (currentPromoError) {
        throw new Error(
          currentPromoError.message
        );
      }

      const currentUsedCount =
        Number(
          currentPromo.used_count ||
            0
        );

      const currentUsageLimit =
        currentPromo.usage_limit ===
        null
          ? null
          : Number(
              currentPromo.usage_limit
            );

      if (
        currentUsageLimit !== null &&
        currentUsedCount >=
          currentUsageLimit
      ) {
        throw new Error(
          "මේ promo code එකේ usage limit එක අවසන්."
        );
      }

      const {
        error:
          promoUpdateError,
      } = await supabase
        .from("promo_codes")
        .update({
          used_count:
            currentUsedCount + 1,
        })
        .eq(
          "id",
          validatedPromo.id
        );

      if (promoUpdateError) {
        throw new Error(
          promoUpdateError.message
        );
      }
    }

    return NextResponse.json({
      success: true,

      orderId:
        createdOrder.id,

      orderNumber:
        createdOrder.order_number,

      totalQuantity,
      subtotal,
      promoCode:
        validatedPromo?.code || null,
      discountAmount,
      discountedSubtotal,
      deliveryFee,
      finalTotal,

      message:
        "Order එක Supabase database එකට save කළා.",
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