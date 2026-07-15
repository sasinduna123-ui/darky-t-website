import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/utils/supabase/admin";

type ProductSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL";

type ProductStock = Record<
  ProductSize,
  number
>;

type ProductVariantInput = {
  name: string;
  slug: string;
  hex: string;
  images: string[];
  stock: ProductStock;
};

type ProductInput = {
  id?: string;
  originalSlug?: string;

  slug: string;
  name: string;
  shortName: string;

  productType:
    | "tshirt"
    | "pants";

  price: number;
  image: string;
  images: string[];

  description: string;
  features: string[];
  sizeGuide: unknown;

  variants:
    ProductVariantInput[];
};

const productSizes:
  ProductSize[] = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ];

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

function createSlug(
  value: string
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function cleanImages(
  images: unknown
): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .filter(
      (
        image
      ): image is string =>
        typeof image ===
          "string" &&
        image.trim() !== ""
    )
    .map((image) =>
      image.trim()
    );
}

function cleanFeatures(
  features: unknown
): string[] {
  if (
    !Array.isArray(features)
  ) {
    return [];
  }

  return features
    .filter(
      (
        feature
      ): feature is string =>
        typeof feature ===
          "string" &&
        feature.trim() !== ""
    )
    .map((feature) =>
      feature.trim()
    );
}

function validateProduct(
  product: ProductInput
) {
  if (!product.name?.trim()) {
    return "Product name එක අවශ්‍යයි.";
  }

  if (!product.slug?.trim()) {
    return "Product slug එක අවශ්‍යයි.";
  }

  if (
    product.productType !==
      "tshirt" &&
    product.productType !==
      "pants"
  ) {
    return "Product type එක invalid.";
  }

  if (
    !Number.isFinite(
      Number(product.price)
    ) ||
    Number(product.price) <= 0
  ) {
    return "Product price එක invalid.";
  }

  if (
    !Array.isArray(
      product.variants
    ) ||
    product.variants.length ===
      0
  ) {
    return "අවම colour variant එකක් අවශ්‍යයි.";
  }

  for (
    let index = 0;
    index <
    product.variants.length;
    index += 1
  ) {
    const variant =
      product.variants[index];

    if (!variant.name?.trim()) {
      return `Colour ${
        index + 1
      } name එක අවශ්‍යයි.`;
    }
  }

  return "";
}

async function findProductBySlug(
  slug: string
) {
  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}

async function replaceVariants(
  productId: string,
  variants:
    ProductVariantInput[]
) {
  const supabase =
    createAdminClient();

  const {
    error: deleteError,
  } = await supabase
    .from("product_variants")
    .delete()
    .eq(
      "product_id",
      productId
    );

  if (deleteError) {
    throw new Error(
      deleteError.message
    );
  }

  for (
    let index = 0;
    index < variants.length;
    index += 1
  ) {
    const variant =
      variants[index];

    const variantName =
      variant.name.trim();

    const variantSlug =
      createSlug(
        variant.slug ||
          variantName
      ) ||
      `colour-${index + 1}`;

    const {
      data:
        insertedVariant,
      error:
        variantError,
    } = await supabase
      .from(
        "product_variants"
      )
      .insert({
        product_id:
          productId,

        name:
          variantName,

        slug:
          variantSlug,

        hex:
          variant.hex?.trim() ||
          "#000000",

        images:
          cleanImages(
            variant.images
          ),
      })
      .select("id")
      .single();

    if (
      variantError ||
      !insertedVariant
    ) {
      throw new Error(
        variantError
          ?.message ||
          "Variant save failed."
      );
    }

    const stockRows =
      productSizes.map(
        (size) => ({
          variant_id:
            insertedVariant.id,

          size,

          quantity:
            Math.max(
              0,
              Math.floor(
                Number(
                  variant.stock?.[
                    size
                  ] ?? 0
                )
              )
            ),
        })
      );

    const {
      error: stockError,
    } = await supabase
      .from("product_stock")
      .insert(stockRows);

    if (stockError) {
      throw new Error(
        stockError.message
      );
    }
  }
}

export async function GET(
  request: NextRequest
) {
  if (
    !isAdminRequest(request)
  ) {
    return unauthorizedResponse();
  }

  try {
    const supabase =
      createAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        short_name,
        product_type,
        price,
        image,
        images,
        description,
        features,
        size_guide,
        is_active,
        created_at,
        product_variants (
          id,
          name,
          slug,
          hex,
          images,
          product_stock (
            size,
            quantity
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

    return NextResponse.json({
      products:
        data ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Products load failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  if (
    !isAdminRequest(request)
  ) {
    return unauthorizedResponse();
  }

  try {
    const body =
      (await request.json()) as {
        product: ProductInput;
      };

    const product =
      body.product;

    const validationError =
      validateProduct(product);

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

    const existingProduct =
      await findProductBySlug(
        product.slug
      );

    if (existingProduct) {
      return NextResponse.json(
        {
          error:
            "මේ slug එකෙන් product එකක් දැනටමත් තියෙනවා.",
        },
        {
          status: 409,
        }
      );
    }

    const supabase =
      createAdminClient();

    const productImages =
      cleanImages(
        product.images
      );

    const mainImage =
      product.image?.trim() ||
      productImages[0] ||
      "/images/product-image.jpg";

    const {
      data:
        insertedProduct,
      error:
        productError,
    } = await supabase
      .from("products")
      .insert({
        slug:
          product.slug.trim(),

        name:
          product.name.trim(),

        short_name:
          product.shortName
            ?.trim() ||
          product.name.trim(),

        product_type:
          product.productType,

        price:
          Math.floor(
            Number(
              product.price
            )
          ),

        image:
          mainImage,

        images:
          productImages,

        description:
          product.description
            ?.trim() || "",

        features:
          cleanFeatures(
            product.features
          ),

        size_guide:
          product.sizeGuide,

        is_active: true,
      })
      .select("id")
      .single();

    if (
      productError ||
      !insertedProduct
    ) {
      throw new Error(
        productError
          ?.message ||
          "Product save failed."
      );
    }

    try {
      await replaceVariants(
        insertedProduct.id,
        product.variants
      );
    } catch (error) {
      await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          insertedProduct.id
        );

      throw error;
    }

    return NextResponse.json({
      success: true,
      id:
        insertedProduct.id,
      message:
        "Product එක Supabase එකට save කළා.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Product save failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest
) {
  if (
    !isAdminRequest(request)
  ) {
    return unauthorizedResponse();
  }

  try {
    const body =
      (await request.json()) as {
        product: ProductInput;
      };

    const product =
      body.product;

    const validationError =
      validateProduct(product);

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

    if (
      !product.originalSlug
    ) {
      return NextResponse.json(
        {
          error:
            "Original product slug එක missing.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await findProductBySlug(
        product.originalSlug
      );

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Update කරන්න product එක හොයාගන්න බැහැ.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      product.slug !==
      product.originalSlug
    ) {
      const duplicateProduct =
        await findProductBySlug(
          product.slug
        );

      if (
        duplicateProduct &&
        duplicateProduct.id !==
          existingProduct.id
      ) {
        return NextResponse.json(
          {
            error:
              "අලුත් slug එක වෙන product එකක් භාවිතා කරනවා.",
          },
          {
            status: 409,
          }
        );
      }
    }

    const supabase =
      createAdminClient();

    const productImages =
      cleanImages(
        product.images
      );

    const mainImage =
      product.image?.trim() ||
      productImages[0] ||
      "/images/product-image.jpg";

    const {
      error:
        updateError,
    } = await supabase
      .from("products")
      .update({
        slug:
          product.slug.trim(),

        name:
          product.name.trim(),

        short_name:
          product.shortName
            ?.trim() ||
          product.name.trim(),

        product_type:
          product.productType,

        price:
          Math.floor(
            Number(
              product.price
            )
          ),

        image:
          mainImage,

        images:
          productImages,

        description:
          product.description
            ?.trim() || "",

        features:
          cleanFeatures(
            product.features
          ),

        size_guide:
          product.sizeGuide,

        is_active: true,
      })
      .eq(
        "id",
        existingProduct.id
      );

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    await replaceVariants(
      existingProduct.id,
      product.variants
    );

    return NextResponse.json({
      success: true,
      id:
        existingProduct.id,
      message:
        "Product එක Supabase එකේ update කළා.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Product update failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  if (
    !isAdminRequest(request)
  ) {
    return unauthorizedResponse();
  }

  try {
    const body =
      (await request.json()) as {
        slug?: string;
      };

    const slug =
      body.slug?.trim();

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Delete කරන්න product slug එක අවශ්‍යයි.",
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
      .from("products")
      .delete({
        count: "exact",
      })
      .eq("slug", slug);

    if (error) {
      throw new Error(
        error.message
      );
    }

    if (!count) {
      return NextResponse.json(
        {
          error:
            "Delete කරන්න product එක හොයාගන්න බැහැ.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Product එක Supabase එකෙන් delete කළා.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Product delete failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}