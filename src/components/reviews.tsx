"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type ReviewItem = { name: string; rating: number; text: string; date: string };
type ReviewsData = { rating: string; count: string; items: ReviewItem[] };

const DEFAULTS: ReviewsData = {
  rating: "4.9",
  count: "424",
  items: [
    { name: "Marcus L.", rating: 5, text: "Bästa klippningen jag haft på länge. Sam vet precis vad han gör — lyssnar, förstår och levererar. Kommer definitivt tillbaka.", date: "April 2025" },
    { name: "Ali K.", rating: 5, text: "Fantastisk service och riktigt bra fade. Salongen är snygg och atmosfären är avslappnad. Kan varmt rekommendera!", date: "Mars 2025" },
    { name: "Johan E.", rating: 5, text: "Sam är en riktig proffs. Skäggklippningen var perfekt och han tog sig tid att göra det rätt. 5 stjärnor utan tvekan.", date: "Maj 2025" },
    { name: "Daniel S.", rating: 5, text: "Värt varje krona. Har testat många barberare i Växjö men Sam Studio är i en klass för sig. Alltid nöjd när jag går därifrån.", date: "Juni 2025" },
  ],
};

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Reviews() {
  const [data, setData] = useState<ReviewsData>(DEFAULTS);
  const [bookingUrl, setBookingUrl] = useState("https://www.bokadirekt.se/places/sam-studio-hair-grooming-cz-salong-54523");

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => {
        if (d.reviews) setData(d.reviews);
        if (d.studio?.bookingUrl) setBookingUrl(d.studio.bookingUrl);
      });
  }, []);

  return (
    <section className="relative py-24 md:py-32 bg-bg overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(50% 40% at 50% 100%, rgba(184,154,106,0.07), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: easeOut }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] mb-4" style={{ color: "#c8a46a" }}>
              Recensioner
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-tight">
              Vad kunderna
              <br />
              <span className="gold-gradient">säger.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-display text-5xl" style={{ color: "#e2c898" }}>{data.rating}</p>
              <div className="flex gap-0.5 mt-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#c8a46a" stroke="none" />
                ))}
              </div>
              <p className="text-xs text-fg-muted mt-1 tracking-wide">{data.count} recensioner</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.items.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: easeOut }}
              className="relative p-7 rounded-sm border border-line bg-bg-soft hover:border-[rgba(200,164,106,0.35)] transition-colors"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} size={13} fill="#c8a46a" stroke="none" />
                ))}
              </div>
              <p className="text-fg/85 leading-relaxed text-sm md:text-base mb-6">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: "#e2c898" }}>{r.name}</p>
                <p className="text-xs text-fg-muted tracking-wide">{r.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener"
            className="text-xs uppercase tracking-[0.4em] transition-colors hover:text-fg"
            style={{ color: "#c8a46a" }}
          >
            Läs alla recensioner på Bokadirekt →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
