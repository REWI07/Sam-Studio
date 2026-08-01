"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

type StoryData = {
  backgroundImage: string;
  label: string;
  quoteBefore: string;
  quoteAccent: string;
  quoteAfter: string;
  tagline: string;
};

const DEFAULTS: StoryData = {
  backgroundImage: "/img/sam1.jpg",
  label: "Vår filosofi",
  quoteBefore: "Ett klipp är mer än ett klipp —",
  quoteAccent: "det är känslan du bär med dig",
  quoteAfter: "när du lämnar stolen.",
  tagline: "Sam Studio · Växjö · sedan 2018",
};

export default function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const [story, setStory] = useState<StoryData>(DEFAULTS);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => { if (d.story) setStory(d.story); });
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative py-28 md:py-44 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={story.backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-20"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/80 to-bg" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-xs uppercase tracking-[0.45em] mb-8"
          style={{ color: "rgba(200,164,106,0.8)" }}
        >
          {story.label}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl md:text-5xl leading-[1.2]"
        >
          {story.quoteBefore}{" "}
          <em className="not-italic gold-gradient">
            {story.quoteAccent}
          </em>{" "}
          {story.quoteAfter}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 inline-flex items-center gap-3"
        >
          <span className="block h-px w-10 bg-gold/50" />
          <span className="text-xs uppercase tracking-[0.4em] text-fg-muted">
            {story.tagline}
          </span>
          <span className="block h-px w-10 bg-gold/50" />
        </motion.div>
      </div>
    </section>
  );
}
