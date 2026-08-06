import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/utils/supabase/admin";

type PromoRequestBody = {
  code?: string;
  subtotal?: number;
};

type PromoCodeRow = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order: number | null;
  usage_limit: number | null;
  used_count: number | null;
  expires_at: string | null;
  is_active: boolean;
};

function errorResponse(error: string, status = 400) {
  return NextResponse.json(
    { valid: false, error },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body =
      (await request.json()) as PromoRequestBody;

    const code =
      body.code?.trim().toUpperCase();

    const subtotal =
      Number(body.subtotal);

    if (!code) {
      return errorResponse(
        "Promo code එක ඇතුළත් කරන්න."
      );
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      return errorResponse(
        "Order subtotal එක invalid."
      );
    }

    const supabase =
      createAdminClient();

    const { data, error } =
      await supabase
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
        .eq("code", code)
        .maybeSingle<PromoCodeRow>();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return errorResponse(
        "Promo code එක වැරදියි."
      );
    }

    if (!data.is_active) {
      return errorResponse(
        "මේ promo code එක inactive."
      );
    }

    if (
      data.expires_at &&
      new Date(data.expires_at).getTime() <=
        Date.now()
    ) {
      return errorResponse(
        "මේ promo code එක expire වෙලා."
      );
    }

    const usageLimit =
      data.usage_limit === null
        ? null
        : Number(data.usage_limit);

    const usedCount =
      Number(data.used_count || 0);

    if (
      usageLimit !== null &&
      usedCount >= usageLimit
    ) {
      return errorResponse(
        "මේ promo code එකේ usage limit එක අවසන්."
      );
    }

    const minimumOrder =
      Math.max(
        0,
        Number(data.minimum_order || 0)
      );

    if (subtotal < minimumOrder) {
      return errorResponse(
        `මේ promo code එකට අවම order amount එක Rs. ${minimumOrder.toLocaleString()}යි.`
      );
    }

    const discountValue =
      Number(data.discount_value);

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      throw new Error(
        "Promo discount value එක invalid."
      );
    }

    let discountAmount = 0;

    if (
      data.discount_type === "percentage"
    ) {
      discountAmount =
        subtotal *
        (Math.min(100, discountValue) /
          100);
    } else if (
      data.discount_type === "fixed"
    ) {
      discountAmount = discountValue;
    } else {
      throw new Error(
        "Promo discount type එක invalid."
      );
    }

    discountAmount =
      Math.min(
        subtotal,
        Math.max(
          0,
          Math.round(discountAmount)
        )
      );

    const total =
      Math.max(
        0,
        subtotal - discountAmount
      );

    return NextResponse.json({
      valid: true,
      promo: {
        id: data.id,
        code: data.code,
        discountType:
          data.discount_type,
        discountValue,
      },
      subtotal,
      discountAmount,
      total,
      message:
        `${data.code} promo code එක apply කළා.`,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Promo code validate කරන්න බැරි වුණා.";

    return NextResponse.json(
      {
        valid: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}