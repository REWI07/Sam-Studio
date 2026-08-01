"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const easeOut = [0.22, 1, 0.36, 1] as const;

type AboutData = {
  portraitImage: string;
  ownerName: string;
  ownerRole: string;
  heading: string;
  headingAccent: string;
  text1: string;
  text2: string;
  rating: string;
  reviews: string;
  experience: string;
};

const DEFAULTS: AboutData = {
  portraitImage: "/img/sam1.jpg",
  ownerName: "Sam",
  ownerRole: "Master Barber",
  heading: "Passion för",
  headingAccent: "hantverket.",
  text1: "Sam är frisör och barberare med över 18 års erfarenhet. Med passion för hantverk och ett öga för detaljer skapar han resultat som du faktiskt är stolt över — varje gång.",
  text2: "På Sam Studio i Växjö tas du emot med värme och expertis. Oavsett om det gäller en klassisk klippning, skarp fade eller skäggdesign — du är i trygga händer.",
  rating: "4.9",
  reviews: "424",
  experience: "18+",
};

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [about, setAbout] = useState<AboutData>(DEFAULTS);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => { if (d.about) setAbout(d.about); });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="om-oss"
      ref={ref}
      className="relative py-24 md:py-36 bg-bg overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: easeOut }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-bg-soft">
              <motion.div style={{ y: imgY }} className="absolute inset-0 -inset-y-12">
                <Image
                  src={about.portraitImage}
                  alt={about.ownerName}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] uppercase tracking-[0.4em] mb-1.5" style={{ color: "#e2c898" }}>
                  {about.ownerRole}
                </p>
                <p className="font-display italic text-4xl text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
                  {about.ownerName}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
            className="lg:col-span-6"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] mb-5" style={{ color: "#c8a46a" }}>
              Om oss
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-7">
              {about.heading}
              <br />
              <span className="gold-gradient">{about.headingAccent}</span>
            </h2>

            <div className="space-y-5 text-fg-muted leading-relaxed text-base max-w-lg">
              <p>{about.text1}</p>
              <p>{about.text2}</p>
            </div>

            <div className="h-px w-16 my-8" style={{ background: "#c8a46a" }} />

            <div className="flex items-center gap-10">
              <div>
                <p className="font-display text-4xl" style={{ color: "#e2c898" }}>{about.rating}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-fg-muted mt-1">av 5 · {about.reviews} recensioner</p>
              </div>
              <div className="h-10 w-px" style={{ background: "rgba(184,154,106,0.25)" }} />
              <div>
                <p className="font-display text-4xl" style={{ color: "#e2c898" }}>{about.experience}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-fg-muted mt-1">års erfarenhet</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
