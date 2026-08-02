"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";

export default function StickyBook() {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [bookingUrl, setBookingUrl] = useState("https://www.bokadirekt.se/places/sam-studio-hair-grooming-cz-salong-54523");
  const { scrollY } = useScroll();

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => { if (d.studio?.bookingUrl) setBookingUrl(d.studio.bookingUrl); });
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolledEnough(y > 300);
  });

  const visible = scrolledEnough && !footerVisible;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-5 pt-3"
      style={{ background: "linear-gradient(to top, rgba(8,6,8,0.95) 60%, transparent)" }}
    >
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener"
        className="flex items-center justify-center w-full py-4 rounded-full text-sm uppercase tracking-[0.35em] font-medium transition-opacity active:opacity-80"
        style={{
          background: "linear-gradient(135deg, #c8a46a, #e2c898, #b8946a)",
          color: "#080608",
        }}
      >
        Boka tid
      </a>
    </motion.div>
  );
}
