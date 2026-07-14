"use client";

import { useMemo, useState } from "react";

type Stock = {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
};

const initialStock: Stock = {
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  XXL: 0,
};

export default function AdminProductPage() {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [price, setPrice] = useState("3650");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState<Stock>(initialStock);
  const [copied, setCopied] = useState(false);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const slug = useMemo(() => createSlug(name), [name]);

  const imagePath = image.trim()
    ? image.trim().startsWith("/images/")
      ? image.trim()
      : `/images/${image.trim()}`
    : "/images/product-image.jpg";

  const generatedCode = `{
  id: "${slug || "product-id"}",
  slug: "${slug || "product-slug"}",
  name: "${name.trim() || "Product Name"}",
  shortName: "${shortName.trim() || name.trim() || "Short Name"}",
  price: ${Number(price) || 0},
  image: "${imagePath}",
  description:
    "${description
      .trim()
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ")}",
  stock: {
    XS: ${stock.XS},
    S: ${stock.S},
    M: ${stock.M},
    L: ${stock.L},
    XL: ${stock.XL},
    XXL: ${stock.XXL},
  },
},`;

  function updateStock(size: keyof Stock, value: string) {
    const numberValue = Math.max(0, Number(value) || 0);

    setStock((currentStock) => ({
      ...currentStock,
      [size]: numberValue,
    }));
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Code එක copy කරන්න බැරි වුණා.");
    }
  }

  function resetForm() {
    setName("");
    setShortName("");
    setPrice("3650");
    setImage("");
    setDescription("");
    setStock(initialStock);
    setCopied(false);
  }

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
          href="/"
          className="text-sm font-bold transition hover:text-gray-300"
        >
          BACK TO HOME
        </a>
      </nav>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-12">
        <div>
          <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
            DARKY T ADMIN
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            ADD NEW PRODUCT
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-gray-600">
            Product විස්තර පුරවලා පහළින් හැදෙන code එක copy කරගෙන
            products.ts file එකට paste කරන්න.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div className="bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black">
              PRODUCT DETAILS
            </h2>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  PRODUCT NAME
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Example: Red Oversized Tee"
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  SHORT NAME
                </label>

                <input
                  type="text"
                  value={shortName}
                  onChange={(event) =>
                    setShortName(event.target.value)
                  }
                  placeholder="Example: Red Tee"
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  PRICE
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="3650"
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  IMAGE FILE NAME
                </label>

                <input
                  type="text"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="Example: red-tee.jpg"
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Photo එක public/images folder එකට දාලා file name එක
                  මෙතන දාන්න.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  DESCRIPTION
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Product description එක ලියන්න"
                  rows={5}
                  className="w-full resize-none border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <p className="mb-4 text-sm font-bold">
                  STOCK BY SIZE
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {(Object.keys(stock) as Array<keyof Stock>).map(
                    (size) => (
                      <div key={size}>
                        <label className="mb-2 block text-sm font-bold">
                          {size}
                        </label>

                        <input
                          type="number"
                          min="0"
                          value={stock[size]}
                          onChange={(event) =>
                            updateStock(size, event.target.value)
                          }
                          className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="mt-8 w-full border border-black px-6 py-4 font-bold transition hover:bg-black hover:text-white"
            >
              RESET FORM
            </button>
          </div>

          {/* Preview and Generated Code */}
          <div className="space-y-8">
            <div className="bg-white p-6 shadow-sm md:p-8">
              <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
                PRODUCT PREVIEW
              </p>

              <div className="mt-6 overflow-hidden bg-gray-100">
                <img
                  src={imagePath}
                  alt={name || "Product preview"}
                  onError={(event) => {
                    event.currentTarget.src =
                      "/images/product-image.jpg";
                  }}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <h2 className="mt-5 text-2xl font-black">
                {name || "PRODUCT NAME"}
              </h2>

              <p className="mt-2 text-xl font-bold">
                Rs. {(Number(price) || 0).toLocaleString()}
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                {description ||
                  "Product description එක මෙතන පේනවා."}
              </p>

              <p className="mt-5 text-sm text-gray-500">
                Product link:
              </p>

              <p className="mt-1 break-all font-bold">
                /product/{slug || "product-slug"}
              </p>
            </div>

            <div className="bg-black p-6 text-white shadow-sm md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-black">
                  GENERATED CODE
                </h2>

                <button
                  type="button"
                  onClick={copyCode}
                  className="bg-white px-5 py-3 font-black text-black transition hover:bg-gray-200"
                >
                  {copied ? "COPIED ✓" : "COPY CODE"}
                </button>
              </div>

              <pre className="mt-6 max-h-[600px] overflow-auto whitespace-pre-wrap border border-white/20 bg-gray-950 p-5 text-sm leading-7 text-gray-200">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
