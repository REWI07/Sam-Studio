"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";

type Service = { name: string; duration: string; price: string; note?: string };
type Category = { category: string; items: Service[] };

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Services() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [bookingUrl, setBookingUrl] = useState("https://www.bokadirekt.se/places/sam-studio-hair-grooming-cz-salong-54523");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => {
        setCategories(d.services ?? []);
        setBookingUrl(d.studio?.bookingUrl ?? bookingUrl);
      });
  }, []);

  if (categories.length === 0) return null;

  return (
    <section id="tjanster" className="relative py-24 md:py-36 bg-bg overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(55% 35% at 50% 0%, rgba(184,154,106,0.09), transparent 65%)" }} />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease: easeOut }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24"
        >
          <div>
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] mb-4 md:mb-5" style={{ color: "#c8a46a" }}>Prislista</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight">
              Tjänster &amp;<br /><span className="gold-gradient">Priser.</span>
            </h2>
          </div>
          <p className="md:max-w-xs text-sm md:text-base text-fg-muted leading-relaxed">
            Alla priser inkluderar konsultation och styling. Boka enkelt online via Bokadirekt.
          </p>
        </motion.div>

        <div className="space-y-3">
          {categories.map((cat, ci) => (
            <motion.div key={ci} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, delay: ci * 0.08, ease: easeOut }}
              className="border border-line rounded-sm overflow-hidden"
            >
              <button onClick={() => setOpenIndex(openIndex === ci ? null : ci)}
                className="w-full flex items-center justify-between px-7 py-5 bg-bg-soft hover:bg-bg/60 transition-colors text-left"
              >
                <p className="text-sm uppercase tracking-[0.18em] md:tracking-[0.4em]" style={{ color: "#c8a46a" }}>{cat.category}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-fg-muted tracking-wide">{cat.items.length} tjänster</span>
                  <motion.div animate={{ rotate: openIndex === ci ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={16} style={{ color: "#c8a46a" }} />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === ci && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: easeOut }} style={{ overflow: "hidden" }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border-t border-line">
                      {cat.items.map((s, i) => (
                        <div key={i} className="bg-bg-soft px-7 py-5 flex items-center justify-between gap-6 hover:bg-bg/60 transition-colors">
                          <div>
                            <p className="text-fg/90 text-sm tracking-wide">{s.name}</p>
                            <p className="text-xs text-fg-muted mt-0.5 tracking-wide">
                              {s.duration}{s.note && <span className="ml-2 opacity-70">· {s.note}</span>}
                            </p>
                          </div>
                          <span className="font-display text-lg tracking-wide whitespace-nowrap shrink-0" style={{ color: "#e2c898" }}>{s.price}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: easeOut }}
          className="flex justify-center mt-14"
        >
          <a href={bookingUrl} target="_blank" rel="noopener"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium tracking-wide text-sm transition-all hover:scale-105"
            style={{ background: "#c8a46a", color: "#06050a" }}
          >
            Boka din tid
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-bg text-white transition-transform group-hover:translate-x-1">
              <ArrowUpRight size={14} />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
