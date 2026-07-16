import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exchange & Return Policy",
  description:
    "Read the DARKY T exchange and return policy for clothing orders.",
};

export default function ReturnsPage() {
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
          CUSTOMER POLICY
        </p>

        <h1 className="mt-3 text-4xl font-black md:text-6xl">
          EXCHANGE & RETURN POLICY
        </h1>

        <p className="mt-5 max-w-3xl leading-8 text-gray-600">
          Product එක ලැබුණු පසු size, damage හෝ වැරදි product එකක්
          සම්බන්ධ ගැටලුවක් තිබුණොත් පහත policy එකට අනුව අපව
          සම්බන්ධ කරගන්න.
        </p>

        <div className="mt-12 space-y-6">
          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              EXCHANGE PERIOD
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Product එක ලැබුණු දින සිට දින 3ක් ඇතුළත exchange
              request එක ඉදිරිපත් කළ යුතුයි.
            </p>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              EXCHANGE CONDITIONS
            </h2>

            <div className="mt-5 space-y-3 leading-7 text-gray-600">
              <p>
                ✓ Product එක භාවිතා කරලා, wash කරලා හෝ damage කරලා
                නොතිබිය යුතුයි.
              </p>

              <p>
                ✓ Original tags, labels සහ packaging තිබිය යුතුයි.
              </p>

              <p>
                ✓ Perfume, smoke, sweat හෝ වෙනත් smell එකක් නොතිබිය
                යුතුයි.
              </p>

              <p>
                ✓ Product එක නැවත විකිණීමට සුදුසු තත්ත්වයේ තිබිය
                යුතුයි.
              </p>
            </div>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              DAMAGED OR WRONG PRODUCT
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Damage වූ product එකක් හෝ order කළ product එකට වෙනස්
              product එකක් ලැබුණොත් parcel එක open කරන video එක සහ
              පැහැදිලි photos අපට එවන්න.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              අපගේ වරදක් බව තහවුරු වුණොත් replacement delivery එක
              සඳහා අවශ්‍ය ක්‍රියාමාර්ග ගන්නවා.
            </p>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              SIZE EXCHANGES
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Customer විසින් වැරදි size එක select කරලා තිබුණොත්,
              අවශ්‍ය replacement size එක stock තිබේ නම් exchange
              කළ හැකියි.
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              Size exchange සඳහා return සහ නැවත delivery charges
              customer විසින් ගෙවිය යුතු විය හැකියි.
            </p>
          </article>

          <article className="bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black">
              NON-RETURNABLE ITEMS
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              භාවිතා කළ, wash කළ, stain වූ, damage වූ, tags ඉවත් කළ
              හෝ custom-made products return/exchange කළ නොහැකියි.
            </p>
          </article>

          <article className="border border-black bg-black p-7 text-white md:p-9">
            <h2 className="text-2xl font-black">
              REFUNDS
            </h2>

            <p className="mt-4 leading-7 text-gray-300">
              සාමාන්‍යයෙන් cash refund ලබා නොදෙන අතර, සුදුසු
              අවස්ථාවල replacement product හෝ exchange එකක් ලබා
              දෙනවා. විශේෂ තත්ත්වයන් DARKY T විසින් පරීක්ෂා කර
              තීරණය කරනු ලැබේ.
            </p>
          </article>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/contact"
            className="bg-black px-7 py-4 font-black text-white transition hover:bg-gray-800"
          >
            REQUEST AN EXCHANGE
          </a>

          <a
            href="/#shop"
            className="border border-black px-7 py-4 font-black transition hover:bg-black hover:text-white"
          >
            CONTINUE SHOPPING
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