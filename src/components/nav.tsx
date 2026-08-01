"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BOOKING_URL } from "@/lib/studio";
import { useTransitionNav } from "@/components/scissors-transition";

const navLinks = [
  { href: "#tjanster", label: "Tjänster" },
  { href: "#om-oss", label: "Om oss" },
  { href: "#galleri", label: "Galleri" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { navigate } = useTransitionNav();

  function handleNav(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setOpen(false);
    navigate(href);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg/88 backdrop-blur-xl border-b border-line"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 h-24 md:h-28 flex items-center justify-between gap-6">
          <a href="/" aria-label="Hem">
            <Image
              src="/img/logo.jpeg"
              alt="Sam Studio Hair & Grooming"
              width={72}
              height={72}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
            />
          </a>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="text-xs uppercase tracking-[0.3em] text-fg-muted hover:text-fg transition-colors cursor-pointer"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-[0.3em] font-medium transition-all"
              style={{ background: "#c8a46a", color: "#06050a" }}
            >
              Boka tid
            </a>
          </div>

          <button
            type="button"
            className="md:hidden text-fg p-2"
            onClick={() => setOpen(true)}
            aria-label="Öppna meny"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-bg/96 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-6 h-24">
              <a href="/" onClick={() => setOpen(false)}>
                <Image
                  src="/img/logo.jpeg"
                  alt="Sam Studio"
                  width={56}
                  height={56}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </a>
              <button
                onClick={() => setOpen(false)}
                aria-label="Stäng meny"
                className="p-2 text-fg"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center gap-10 mt-16">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.5 }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => handleNav(e, l.href)}
                    className="font-display text-3xl tracking-tight text-fg hover:text-accent-soft transition-colors cursor-pointer"
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.5 }}
              >
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm uppercase tracking-[0.3em] font-medium mt-4"
                  style={{ background: "#c8a46a", color: "#06050a" }}
                >
                  Boka tid
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
