"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookies-ok")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookies-ok", "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-[400]"
        >
          <div
            className="rounded-sm border p-5 shadow-2xl"
            style={{
              background: "#100e12",
              borderColor: "rgba(200,164,106,0.25)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(236,230,220,0.75)" }}>
                Vi använder cookies för att förbättra din upplevelse på webbplatsen.
              </p>
              <button
                onClick={accept}
                className="shrink-0 mt-0.5 transition-colors"
                style={{ color: "#9e9590" }}
              >
                <X size={15} />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 py-2.5 rounded-sm text-xs uppercase tracking-[0.3em] font-medium transition-opacity hover:opacity-90"
                style={{ background: "#c8a46a", color: "#06050a" }}
              >
                Acceptera
              </button>
              <button
                onClick={accept}
                className="px-4 py-2.5 rounded-sm text-xs uppercase tracking-[0.3em] transition-colors border"
                style={{ color: "#9e9590", borderColor: "rgba(200,164,106,0.2)" }}
              >
                Stäng
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
