import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/utils/supabase/admin";

type DiscountType =
  | "percentage"
  | "fixed";

type PromoInput = {
  id?: string;
  code?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minimumOrder?: number;
  usageLimit?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
};

function isAdminRequest(
  request: NextRequest
) {
  const suppliedPassword =
    request.headers.get(
      "x-darky-admin-password"
    );

  const savedPassword =
    process.env
      .DARKY_ADMIN_PASSWORD;

  return (
    Boolean(savedPassword) &&
    suppliedPassword ===
      savedPassword
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

function validatePromo(
  promo: PromoInput
) {
  const code =
    promo.code
      ?.trim()
      .toUpperCase();

  if (!code) {
    return "Promo code එක අවශ්‍යයි.";
  }

  if (
    promo.discountType !==
      "percentage" &&
    promo.discountType !==
      "fixed"
  ) {
    return "Discount type එක invalid.";
  }

  const discountValue =
    Number(
      promo.discountValue
    );

  if (
    !Number.isFinite(
      discountValue
    ) ||
    discountValue <= 0
  ) {
    return "Discount value එක invalid.";
  }

  if (
    promo.discountType ===
      "percentage" &&
    discountValue > 100
  ) {
    return "Percentage discount එක 100ට වඩා වැඩි වෙන්න බැහැ.";
  }

  const minimumOrder =
    Number(
      promo.minimumOrder || 0
    );

  if (
    !Number.isFinite(
      minimumOrder
    ) ||
    minimumOrder < 0
  ) {
    return "Minimum order එක invalid.";
  }

  if (
    promo.usageLimit !==
      null &&
    promo.usageLimit !==
      undefined &&
    (
      !Number.isFinite(
        Number(
          promo.usageLimit
        )
      ) ||
      Number(
        promo.usageLimit
      ) < 1
    )
  ) {
    return "Usage limit එක invalid.";
  }

  if (
    promo.expiresAt &&
    Number.isNaN(
      new Date(
        promo.expiresAt
      ).getTime()
    )
  ) {
    return "Expiry date එක invalid.";
  }

  return "";
}

export async function GET(
  request: NextRequest
) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
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
        is_active,
        created_at
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

    return NextResponse.json({
      promos: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Promo codes load failed.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body =
      (await request.json()) as {
        promo: PromoInput;
      };

    const promo =
      body.promo;

    const validationError =
      validatePromo(promo);

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

    const supabase =
      createAdminClient();

    const code =
      promo.code!
        .trim()
        .toUpperCase();

    const {
      data: existingPromo,
      error:
        existingPromoError,
    } = await supabase
      .from("promo_codes")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (existingPromoError) {
      throw new Error(
        existingPromoError.message
      );
    }

    if (existingPromo) {
      return NextResponse.json(
        {
          error:
            "මේ promo code එක දැනටමත් තියෙනවා.",
        },
        {
          status: 409,
        }
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("promo_codes")
      .insert({
        code,
        discount_type:
          promo.discountType,
        discount_value:
          Number(
            promo.discountValue
          ),
        minimum_order:
          Number(
            promo.minimumOrder ||
              0
          ),
        usage_limit:
          promo.usageLimit ===
            null ||
          promo.usageLimit ===
            undefined
            ? null
            : Math.floor(
                Number(
                  promo.usageLimit
                )
              ),
        used_count: 0,
        expires_at:
          promo.expiresAt ||
          null,
        is_active:
          promo.isActive !==
          false,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(
        error?.message ||
          "Promo code save failed."
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message:
        `${code} promo code එක save කළා.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Promo code save failed.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: NextRequest
) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body =
      (await request.json()) as {
        promo: PromoInput;
      };

    const promo =
      body.promo;

    if (!promo.id) {
      return NextResponse.json(
        {
          error:
            "Promo ID එක අවශ්‍යයි.",
        },
        {
          status: 400,
        }
      );
    }

    const validationError =
      validatePromo(promo);

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

    const supabase =
      createAdminClient();

    const code =
      promo.code!
        .trim()
        .toUpperCase();

    const {
      data: duplicatePromo,
      error:
        duplicateError,
    } = await supabase
      .from("promo_codes")
      .select("id")
      .eq("code", code)
      .neq("id", promo.id)
      .maybeSingle();

    if (duplicateError) {
      throw new Error(
        duplicateError.message
      );
    }

    if (duplicatePromo) {
      return NextResponse.json(
        {
          error:
            "මේ promo code එක වෙන promo එකක් භාවිතා කරනවා.",
        },
        {
          status: 409,
        }
      );
    }

    const {
      error,
    } = await supabase
      .from("promo_codes")
      .update({
        code,
        discount_type:
          promo.discountType,
        discount_value:
          Number(
            promo.discountValue
          ),
        minimum_order:
          Number(
            promo.minimumOrder ||
              0
          ),
        usage_limit:
          promo.usageLimit ===
            null ||
          promo.usageLimit ===
            undefined
            ? null
            : Math.floor(
                Number(
                  promo.usageLimit
                )
              ),
        expires_at:
          promo.expiresAt ||
          null,
        is_active:
          promo.isActive !==
          false,
      })
      .eq("id", promo.id);

    if (error) {
      throw new Error(
        error.message
      );
    }

    return NextResponse.json({
      success: true,
      message:
        `${code} promo code එක update කළා.`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Promo code update failed.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body =
      (await request.json()) as {
        id?: string;
      };

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "Promo ID එක අවශ්‍යයි.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      createAdminClient();

    const {
      error,
      count,
    } = await supabase
      .from("promo_codes")
      .delete({
        count: "exact",
      })
      .eq("id", body.id);

    if (error) {
      throw new Error(
        error.message
      );
    }

    if (!count) {
      return NextResponse.json(
        {
          error:
            "Delete කරන්න promo code එක හොයාගන්න බැහැ.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Promo code එක delete කළා.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Promo code delete failed.",
      },
      {
        status: 500,
      }
    );
  }
}