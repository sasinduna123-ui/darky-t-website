import { createClient } from "@/utils/supabase/server";

export default async function SupabaseTestPage() {
  const supabase =
    await createClient();

  const {
    data: products,
    error,
  } = await supabase
    .from("products")
    .select("*");

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold tracking-[0.3em] text-gray-400">
          DARKY T DATABASE
        </p>

        <h1 className="mt-4 text-4xl font-black">
          SUPABASE CONNECTION TEST
        </h1>

        {error ? (
          <div className="mt-8 border border-red-500 bg-red-950 p-6">
            <h2 className="text-xl font-black text-red-400">
              CONNECTION ERROR
            </h2>

            <pre className="mt-4 whitespace-pre-wrap text-sm text-red-200">
              {error.message}
            </pre>
          </div>
        ) : (
          <div className="mt-8 border border-green-500 bg-green-950 p-6">
            <h2 className="text-xl font-black text-green-400">
              CONNECTION SUCCESSFUL
            </h2>

            <p className="mt-4 text-green-100">
              Products table එක Supabase එකෙන් read කළා.
            </p>

            <p className="mt-3 font-bold">
              Products found:{" "}
              {products?.length ?? 0}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}