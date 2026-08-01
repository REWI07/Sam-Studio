"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ArrowUpRight } from "lucide-react";

type Hour = { label: string; value: string };
type StudioData = {
  name: string;
  city: string;
  address: string;
  area: string;
  phone: string;
  bookingUrl: string;
  instagram: string;
  hours: Hour[];
};

const DEFAULTS: StudioData = {
  name: "Sam Studio",
  city: "Växjö",
  address: "Sandgärdsgatan 16B, 352 30 Växjö",
  area: "Växjö",
  phone: "070-717 06 06",
  bookingUrl: "https://www.bokadirekt.se/places/sam-studio-hair-grooming-cz-salong-54523",
  instagram: "https://www.instagram.com/samstudiovaxjo/",
  hours: [
    { label: "Mån-Fre", value: "09:00-19:00" },
    { label: "Lördag", value: "10:00-18:00" },
    { label: "Söndag", value: "11:00-16:30" },
  ],
};

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const [studio, setStudio] = useState<StudioData>(DEFAULTS);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => { if (d.studio) setStudio(d.studio); });
  }, []);

  return (
    <section id="kontakt" className="relative py-20 md:py-32 bg-bg-soft overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(55% 40% at 50% 100%, rgba(184,154,106,0.10), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <p className="text-[10px] uppercase tracking-[0.45em] mb-5" style={{ color: "#c8a46a" }}>
            Boka & hitta hit
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95]">
            Välj din{" "}
            <span className="gold-gradient">tid.</span>
          </h2>
          <p className="mt-5 text-fg-muted">
            Boka enkelt online — vi finns i {studio.city} och tar emot dig med öppna armar.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="mb-8"
        >
          <a
            href={studio.bookingUrl}
            target="_blank"
            rel="noopener"
            className="group relative flex items-center justify-between p-8 md:p-10 rounded-sm border border-line overflow-hidden transition-all hover:border-transparent"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0))",
            }}
          >
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-500"
              style={{
                background: "radial-gradient(120% 80% at 0% 0%, rgba(200,164,106,0.55), transparent 60%)",
              }}
            />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.4em] text-fg-muted mb-2">Online bokning</p>
              <p className="font-display text-3xl md:text-5xl" style={{ color: "#e2c898" }}>Boka via Bokadirekt</p>
            </div>
            <ArrowUpRight size={32} className="relative transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "#c8a46a" }} />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line rounded-sm overflow-hidden">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(studio.address)}`}
            target="_blank"
            rel="noopener"
            className="group bg-bg-soft p-7 hover:bg-bg/50 transition-colors"
          >
            <MapPin size={18} className="mb-4" style={{ color: "#c8a46a" }} />
            <p className="text-[11px] uppercase tracking-[0.3em] text-fg-muted mb-2">Adress</p>
            <p className="font-display text-base leading-snug">{studio.address}</p>
            <p className="text-sm text-fg-muted mt-1">{studio.area}</p>
          </a>

          <a
            href={`tel:${studio.phone.replace(/[^0-9+]/g, "")}`}
            className="group bg-bg-soft p-7 hover:bg-bg/50 transition-colors"
          >
            <Phone size={18} className="mb-4" style={{ color: "#c8a46a" }} />
            <p className="text-[11px] uppercase tracking-[0.3em] text-fg-muted mb-2">Telefon</p>
            <p className="font-display text-base">{studio.phone}</p>
            <p className="text-sm text-fg-muted mt-1">Ring oss gärna</p>
          </a>

          <div className="bg-bg-soft p-7">
            <Clock size={18} className="mb-4" style={{ color: "#c8a46a" }} />
            <p className="text-[11px] uppercase tracking-[0.3em] text-fg-muted mb-2">Öppettider</p>
            {studio.hours.map((h) => (
              <p key={h.label} className="font-display text-sm">
                {h.label} · {h.value}
              </p>
            ))}
            <p className="text-xs text-fg-muted mt-1">Sön: boka 24h i förväg</p>
          </div>

          <a
            href={studio.instagram}
            target="_blank"
            rel="noopener"
            className="group bg-bg-soft p-7 hover:bg-bg/50 transition-colors"
          >
            <span className="block mb-4" style={{ color: "#c8a46a" }}>
              <InstagramIcon size={18} />
            </span>
            <p className="text-[11px] uppercase tracking-[0.3em] text-fg-muted mb-2">Instagram</p>
            <p className="font-display text-base">@samstudiovaxjo</p>
            <p className="text-sm text-fg-muted mt-1">Följ oss</p>
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
          className="mt-4 rounded-sm overflow-hidden border border-line"
          style={{ height: 340 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2139.7520735764517!2d14.803661776508541!3d56.87874997343292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465a6f0a3b9a1bcf%3A0x8a3a2c9f2a3b7e1d!2sSandg%C3%A4rdsgatan%2016B%2C%20352%2030%20V%C3%A4xj%C3%B6!5e0!3m2!1ssv!2sse!4v1700000000000!5m2!1ssv!2sse"
            width="100%"
            height="340"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sam Studio Växjö"
          />
        </motion.div>
      </div>
    </section>
  );
}
