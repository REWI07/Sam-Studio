import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg text-fg flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/img/logo.jpeg"
        alt="Sam Studio"
        width={80}
        height={80}
        className="rounded-full mb-8 opacity-60"
      />

      <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: "#c8a46a" }}>
        404
      </p>
      <h1 className="font-display text-4xl md:text-6xl mb-4">Sidan hittades inte</h1>
      <p className="text-sm md:text-base mb-12 max-w-sm" style={{ color: "rgba(236,230,220,0.5)" }}>
        Sidan du letar efter finns inte eller har flyttats.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium tracking-wide transition-all hover:scale-105"
        style={{ background: "#c8a46a", color: "#06050a" }}
      >
        Tillbaka till startsidan
      </Link>
    </main>
  );
}
