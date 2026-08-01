"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;
const INITIAL_COUNT = 7;

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => setImages(d.gallery ?? []));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (selectedIdx === null) return;
      if (e.key === "ArrowLeft") setSelectedIdx(i => i !== null ? (i - 1 + images.length) % images.length : null);
      if (e.key === "ArrowRight") setSelectedIdx(i => i !== null ? (i + 1) % images.length : null);
      if (e.key === "Escape") setSelectedIdx(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIdx, images.length]);

  if (images.length === 0) return null;

  const visible = showAll ? images : images.slice(0, INITIAL_COUNT);

  function prev() { setSelectedIdx(i => i !== null ? (i - 1 + images.length) % images.length : null); }
  function next() { setSelectedIdx(i => i !== null ? (i + 1) % images.length : null); }

  return (
    <section id="galleri" className="relative py-24 md:py-32 bg-bg-soft overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 mb-14 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          <p className="text-[10px] uppercase tracking-[0.5em] mb-4" style={{ color: "#c8a46a" }}>Galleri</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight">
            Hantverk i<br />
            <span className="gold-gradient">varje klipp.</span>
          </h2>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {visible.map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: (i % 8) * 0.05, ease: easeOut }}
              className="relative overflow-hidden rounded-sm bg-bg cursor-pointer break-inside-avoid"
              onClick={() => setSelectedIdx(images.indexOf(src))}
            >
              <Image
                src={src}
                alt="Sam Studio"
                width={400}
                height={400}
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </motion.div>
          ))}
        </div>

        {!showAll && images.length > INITIAL_COUNT && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAll(true)}
              className="group flex items-center gap-3 px-8 py-4 rounded-full border text-sm tracking-wide transition-all hover:scale-105"
              style={{ borderColor: "rgba(200,164,106,0.4)", color: "#c8a46a" }}
            >
              Visa mer
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                <ChevronDown size={16} />
              </motion.span>
              <span className="text-xs text-fg-muted">({images.length - INITIAL_COUNT} bilder till)</span>
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Stäng */}
            <button className="absolute top-6 right-6 p-2 text-fg-muted hover:text-fg transition-colors z-10" onClick={() => setSelectedIdx(null)}>
              <X size={24} />
            </button>

            {/* Föregående */}
            <button
              className="absolute left-4 md:left-8 p-3 rounded-full bg-bg-soft/80 border border-line text-fg hover:border-gold/50 hover:text-gold transition-all z-10"
              onClick={e => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Bild */}
            <motion.div
              key={selectedIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-3xl max-h-[85vh] w-full"
              onClick={e => e.stopPropagation()}
            >
              <Image src={images[selectedIdx]} alt="Sam Studio" width={900} height={900} className="w-full h-auto max-h-[85vh] object-contain rounded-sm" />
              <p className="text-center text-xs text-fg-muted mt-3 tracking-widest">
                {selectedIdx + 1} / {images.length}
              </p>
            </motion.div>

            {/* Nästa */}
            <button
              className="absolute right-4 md:right-8 p-3 rounded-full bg-bg-soft/80 border border-line text-fg hover:border-gold/50 hover:text-gold transition-all z-10"
              onClick={e => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
