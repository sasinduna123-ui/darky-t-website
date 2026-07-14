"use client";

import { useState } from "react";
import type { ProductSizeGuide } from "@/app/data/products";

type SizeGuideProps = {
  sizeGuide: ProductSizeGuide;
};

const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
] as const;

export default function SizeGuide({
  sizeGuide,
}: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm font-bold underline underline-offset-4 transition hover:text-gray-500"
      >
        SIZE GUIDE
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 text-black shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-3 text-3xl font-light transition hover:text-gray-500"
              aria-label="Close size guide"
            >
              ×
            </button>

            <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
              DARKY T
            </p>

            <h2 className="mt-2 text-3xl font-black">
              SIZE GUIDE
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              ඔබට ගැළපෙන size එක තෝරාගැනීමට පහත measurements
              භාවිත කරන්න. Measurements සියල්ල අඟල් වලින් දක්වා ඇත.
            </p>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="border border-black px-4 py-3">
                      SIZE
                    </th>

                    <th className="border border-black px-4 py-3">
                      CHEST
                    </th>

                    <th className="border border-black px-4 py-3">
                      LENGTH
                    </th>

                    <th className="border border-black px-4 py-3">
                      SLEEVE
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sizes.map((size, index) => (
                    <tr
                      key={size}
                      className={
                        index % 2 === 1
                          ? "bg-gray-50"
                          : "bg-white"
                      }
                    >
                      <td className="border px-4 py-3 font-bold">
                        {size}
                      </td>

                      <td className="border px-4 py-3">
                        {sizeGuide[size].chest}
                      </td>

                      <td className="border px-4 py-3">
                        {sizeGuide[size].length}
                      </td>

                      <td className="border px-4 py-3">
                        {sizeGuide[size].sleeve}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7 bg-gray-100 p-5">
              <h3 className="font-black">
                SIZE එක තෝරන්නේ කොහොමද?
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                ඔබට හොඳින් ගැළපෙන T-shirt එකක් පැතලි මතුපිටක
                තබා chest, length සහ sleeve measurements මැනලා
                මේ table එක සමඟ සසඳන්න.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-7 w-full bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800"
            >
              CLOSE SIZE GUIDE
            </button>
          </div>
        </div>
      )}
    </>
  );
}