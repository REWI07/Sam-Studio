"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
          style={{ background: "#080608" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/img/logo.jpeg"
              alt="Sam Studio"
              width={110}
              height={110}
              className="rounded-full"
              priority
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-2xl tracking-[0.2em] mt-6"
            style={{ color: "#e2c898" }}
          >
            SAM STUDIO
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-[10px] uppercase tracking-[0.55em] mt-2"
            style={{ color: "#c8a46a" }}
          >
            Växjö
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px w-20"
            style={{ background: "linear-gradient(90deg, transparent, #c8a46a, transparent)", transformOrigin: "center" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
