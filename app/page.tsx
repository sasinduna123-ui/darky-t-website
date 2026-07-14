export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-bold tracking-widest">
          DARKY T
        </h1>

        <div className="space-x-8 text-gray-300">
          <a href="#">Home</a>
          <a href="#">Shop</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section
  className="relative flex min-h-[85vh] items-center justify-center bg-cover bg-center px-6 text-center"
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url('/images/hero.jpg')",
  }}
>
  <div>
    <p className="mb-4 text-sm tracking-[0.4em] text-gray-300">
      PREMIUM STREETWEAR
    </p>

    <h2 className="text-5xl font-extrabold leading-tight md:text-7xl">
      PREMIUM
      <br />
      OVERSIZED
      <br />
      T-SHIRTS
    </h2>

    <p className="mt-6 text-lg text-gray-300">
      Designed for comfort.
      <br />
      Made to stand out.
    </p>

    <a
      href="#shop"
      className="mt-10 inline-block rounded-full bg-white px-8 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-gray-200"
    >
      SHOP NOW
    </a>
  </div>
</section>
<section id="shop" className="bg-white px-6 py-20 text-black md:px-12">
  <div className="mx-auto max-w-7xl">
    <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
      NEW COLLECTION
    </p>

    <h3 className="mt-3 text-4xl font-black">
      BEST SELLERS
    </h3>

    <div className="mt-10 grid gap-8 md:grid-cols-3">

      <div>
        <img
  src="/images/TSHIRT1.jpg"
  alt="Essential Black Tee"
  className="aspect-square w-full object-cover"
/>

        <h4 className="mt-5 text-lg font-bold">
          Essential Black Tee
        </h4>

        <p className="mt-1 text-gray-600">
          Rs. 2,850
          <a
  href="https://wa.me/94788809678?text=I%20want%20to%20order%20Essential%20Black%20Tee"
  target="_blank"
  className="mt-4 inline-block w-full bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
>
  ORDER ON WHATSAPP
</a>
        </p>
      </div>

      <div>
        <img
  src="/images/TSHIRT2.jpg"
  alt="Heavy Cotton White Tee"
  className="aspect-square w-full object-cover"
/>

        <h4 className="mt-5 text-lg font-bold">
          Heavy Cotton White Tee
        </h4>

        <p className="mt-1 text-gray-600">
          Rs. 2,850
          <a
  href="https://wa.me/94788809678?text=I%20want%20to%20order%20Heavy%20Cotton%20White%20Tee"
  target="_blank"
  className="mt-4 inline-block w-full bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
>
  ORDER ON WHATSAPP
</a>
        </p>
      </div>

      <div>
        <img
src="/images/TSHIRT3.jpg"
  alt="Dark Grey Oversized Tee"
  className="aspect-square w-full object-cover"
/>

        <h4 className="mt-5 text-lg font-bold">
          Dark Grey Oversized Tee
        </h4>

        <p className="mt-1 text-gray-600">
          Rs. 2,850
          <a
  href="https://wa.me/94788809678?text=I%20want%20to%20order%20Dark%20Grey%20Oversized%20Tee"
  target="_blank"
  className="mt-4 inline-block w-full bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
>
  ORDER ON WHATSAPP
</a>
        </p>
      </div>

    </div>
  </div>
</section>
<section
  id="about"
  className="bg-black px-6 py-20 text-white md:px-12"
>
  <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">

    <div>
      <p className="text-sm tracking-[0.3em] text-gray-400">
        ABOUT DARKY T
      </p>

      <h3 className="mt-4 text-4xl font-black md:text-5xl">
        MADE TO
        <br />
        STAND OUT.
      </h3>
    </div>

    <div className="space-y-6 text-gray-300">
      <p>
        DARKY T is a premium streetwear clothing brand focused on
        oversized T-shirts, comfort and bold designs.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-white/20 p-5">
          <h4 className="text-xl font-bold">240 GSM</h4>
          <p className="mt-2 text-sm text-gray-400">
            Heavy cotton fabric
          </p>
        </div>

        <div className="border border-white/20 p-5">
          <h4 className="text-xl font-bold">OVERSIZED</h4>
          <p className="mt-2 text-sm text-gray-400">
            Premium relaxed fit
          </p>
        </div>

        <div className="border border-white/20 p-5">
          <h4 className="text-xl font-bold">PREMIUM</h4>
          <p className="mt-2 text-sm text-gray-400">
            Quality print and finish
          </p>
        </div>

        <div className="border border-white/20 p-5">
          <h4 className="text-xl font-bold">ISLANDWIDE</h4>
          <p className="mt-2 text-sm text-gray-400">
            Delivery across Sri Lanka
          </p>
        </div>
      </div>
    </div>

  </div>
</section>
<section
  id="contact"
  className="bg-white px-6 py-20 text-black md:px-12"
>
  <div className="mx-auto max-w-7xl text-center">
    <p className="text-sm font-semibold tracking-[0.3em] text-gray-500">
      CONTACT US
    </p>

    <h3 className="mt-4 text-4xl font-black md:text-5xl">
      READY TO ORDER?
    </h3>

    <p className="mx-auto mt-5 max-w-xl text-gray-600">
      Contact DARKY T through WhatsApp, Instagram or Facebook for orders
      and more information.
    </p>

    <a
      href="https://wa.me/94788809678"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 inline-block rounded-full bg-black px-8 py-4 font-bold text-white transition hover:scale-105 hover:bg-gray-800"
    >
      CHAT ON WHATSAPP
    </a>

    <div className="mt-10 flex flex-wrap justify-center gap-8 font-semibold">
      <a href="#" className="hover:text-gray-500">
        INSTAGRAM
      </a>

      <a href="#" className="hover:text-gray-500">
        FACEBOOK
      </a>

      <a href="#" className="hover:text-gray-500">
        TIKTOK
      </a>
    </div>
  </div>
</section>

<footer className="border-t border-white/10 bg-black px-6 py-10 text-center text-white">
  <h3 className="text-2xl font-black tracking-[0.35em]">
    DARKY T
  </h3>

  <p className="mt-4 text-sm text-gray-400">
    Premium Oversized Streetwear
  </p>

  <p className="mt-6 text-xs text-gray-500">
    © 2026 DARKY T. All rights reserved.
  </p>
</footer>
    </main>

  );

}

// DARKY T website