import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Information",
  description:
    "DARKY T islandwide delivery information, delivery charges and estimated delivery times.",
};

export default function DeliveryPage() {
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

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-12 md:py-20">
        <p className="text-sm font-bold tracking-[0.3em] text-gray-500">
          CUSTOMER INFORMATION
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          DELIVERY INFORMATION
        </h1>

        <p className="mt-5 max-w-3xl leading-8 text-gray-600">
          DARKY T orders Sri Lanka තුළ islandwide delivery කරනවා.
          Order එක confirm කළාට පස්සේ customerට delivery details
          දැනුම් දෙනවා.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              DELIVERY AREAS
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Sri Lanka තුළ සියලුම ප්‍රධාන නගර සහ දිස්ත්‍රික්ක වෙත
              delivery ලබා දෙනවා.
            </p>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              DELIVERY FEE
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Items 1 සිට 5 දක්වා orders සඳහා සාමාන්‍ය delivery fee
              එක Rs. 350යි.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Items 5කට වැඩි orders සඳහා delivery fee එක order එකේ
              බර සහ delivery location එක අනුව confirm කරනවා.
            </p>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              DELIVERY TIME
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              සාමාන්‍යයෙන් order එක confirm කළ දින සිට working days
              2–5ක් ඇතුළත delivery ලැබෙනවා.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              දුර ප්‍රදේශ, holidays හෝ courier delays නිසා delivery
              කාලය වෙනස් විය හැකියි.
            </p>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              ORDER CONFIRMATION
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Order එක place කළාට පස්සේ ලබාදුන් phone number එක හරහා
              order details confirm කරනු ලැබේ.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              වැරදි phone number හෝ address එකක් ලබාදී තිබුණොත්
              delivery ප්‍රමාද විය හැකියි.
            </p>
          </article>
        </div>

        <div className="mt-8 border border-black bg-black p-7 text-white md:p-9">
          <h2 className="text-2xl font-black">
            IMPORTANT
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-gray-300">
            Order එක ලබාගන්නා වෙලාවේ parcel එකේ පිටත damage එකක්
            තිබුණොත් courier representative ඉදිරියේ photo හෝ video
            evidence එකක් ලබාගන්න.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/#shop"
            className="bg-black px-7 py-4 font-black text-white transition hover:bg-gray-800"
          >
            SHOP PRODUCTS
          </a>

          <a
            href="/contact"
            className="border border-black px-7 py-4 font-black transition hover:bg-black hover:text-white"
          >
            CONTACT US
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