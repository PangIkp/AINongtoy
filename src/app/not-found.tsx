import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#5ad7ff]">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-[#b6c2da]">
          The page you requested does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#5ad7ff] px-6 py-3 text-sm font-semibold text-[#05111f] transition hover:bg-[#82e2ff]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
