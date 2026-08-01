"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

type HeroData = {
  backgroundImage: string;
  welcomeText: string;
  line1: string;
  line2: string;
  tagline: string;
};

const DEFAULTS: HeroData = {
  backgroundImage: "/img/samstudio2.jpg",
  welcomeText: "Välkommen till",
  line1: "Sam Studio",
  line2: "Växjö",
  tagline: "Herrfrisör & Studio · Växjö",
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [hero, setHero] = useState<HeroData>(DEFAULTS);
  const [bookingUrl, setBookingUrl] = useState("https://www.bokadirekt.se/places/sam-studio-hair-grooming-cz-salong-54523");

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => {
        if (d.hero) setHero(d.hero);
        if (d.studio?.bookingUrl) setBookingUrl(d.studio.bookingUrl);
      });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[660px] w-full overflow-hidden pt-24 md:pt-28"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={hero.backgroundImage}
          alt="Sam Studio Växjö"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-bg/65 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-transparent to-bg" />
      </motion.div>
      <div className="noise" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto max-w-7xl h-full px-6 lg:px-10 flex flex-col items-center justify-center text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="text-[10px] md:text-sm uppercase tracking-[0.45em] mb-5 md:mb-7"
          style={{ color: "#e2c898" }}
        >
          {hero.welcomeText}
        </motion.p>

        <h1 className="font-display text-[17vw] sm:text-[11vw] md:text-[8vw] lg:text-[6.8rem] leading-[0.92] tracking-tight">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block gold-gradient"
            >
              {hero.line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden mt-2">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {hero.line2}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-7 md:mt-10 text-[11px] md:text-base tracking-[0.3em] uppercase text-fg-muted"
        >
          {hero.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-10 md:mt-12"
        >
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.35em] font-medium transition-all hover:scale-105"
            style={{ background: "#c8a46a", color: "#06050a" }}
          >
            Boka din tid
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-fg-muted"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">
            Scrolla ned
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <ArrowDown size={16} style={{ color: "#c8a46a" }} />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
