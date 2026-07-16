import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact DARKY T for orders, delivery information and customer support.",
};

const whatsappNumber = "94788809678";

const whatsappMessage = encodeURIComponent(
  "Hello DARKY T, I need help with an order."
);

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <nav className="flex items-center justify-between bg-black px-5 py-5 text-white md:px-12">
        <a
          href="/"
          className="text-xl font-black tracking-[0.25em] sm:text-2xl"
        >
          DARKY T
        </a>

        <a
          href="/"
          className="border border-white px-5 py-3 text-sm font-black transition hover:bg-white hover:text-black"
        >
          BACK TO HOME
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-12 md:py-20">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
            CUSTOMER SUPPORT
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            CONTACT DARKY T
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-600">
            Orders, delivery, sizes, exchanges හෝ products සම්බන්ධ
            ප්‍රශ්නයක් තිබුණොත් අපව සම්බන්ධ කරගන්න.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="bg-white p-7 text-center shadow-sm md:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
              W
            </div>

            <h2 className="mt-5 text-2xl font-black">
              WHATSAPP
            </h2>

            <p className="mt-3 text-gray-600">
              Quick order and customer support.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-black px-6 py-3 font-black text-white transition hover:bg-gray-800"
            >
              CHAT ON WHATSAPP
            </a>
          </article>

          <article className="bg-white p-7 text-center shadow-sm md:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
              P
            </div>

            <h2 className="mt-5 text-2xl font-black">
              PHONE
            </h2>

            <p className="mt-3 text-gray-600">
              Call us regarding your order.
            </p>

            <a
              href="tel:+94788809678"
              className="mt-6 inline-block bg-black px-6 py-3 font-black text-white transition hover:bg-gray-800"
            >
              +94 78 880 9678
            </a>
          </article>

          <article className="bg-white p-7 text-center shadow-sm md:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-xl text-white">
              T
            </div>

            <h2 className="mt-5 text-2xl font-black">
              TIKTOK
            </h2>

            <p className="mt-3 text-gray-600">
              Follow our latest products and content.
            </p>

            <a
              href="https://www.tiktok.com/@sasindu_nathee?_r=1&_t=ZS-981NZk7vYkz"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-black px-6 py-3 font-black text-white transition hover:bg-gray-800"
            >
              OPEN TIKTOK
            </a>
          </article>
        </div>

        <div className="mt-8 bg-black p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-bold tracking-[0.3em] text-gray-400">
                SUPPORT HOURS
              </p>

              <h2 className="mt-3 text-3xl font-black">
                WE ARE HERE TO HELP
              </h2>
            </div>

            <div className="space-y-3 text-gray-300">
              <p>
                Monday – Saturday: 9:00 AM – 7:00 PM
              </p>

              <p>
                Sunday සහ public holidays වල replies ප්‍රමාද විය
                හැකියි.
              </p>

              <p>
                Message කරන විට order number එක තිබේ නම් ඒකත්
                ඇතුළත් කරන්න.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/#shop"
            className="inline-block bg-black px-8 py-4 font-black text-white transition hover:bg-gray-800"
          >
            SHOP PRODUCTS
          </a>
        </div>
      </section>

      <footer className="bg-black px-6 py-8 text-center text-white">
        <p className="text-sm text-gray-400">
          © 2026 DARKY T. All rights reserved.
        </p>
      </footer>
    </main>
  );
}