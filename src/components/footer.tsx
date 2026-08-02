"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTransitionNav } from "@/components/scissors-transition";

type Hour = { label: string; value: string };
type StudioData = {
  address: string;
  area: string;
  phone: string;
  bookingUrl: string;
  instagram: string;
  hours: Hour[];
};

const DEFAULTS: StudioData = {
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

export default function Footer() {
  const [studio, setStudio] = useState<StudioData>(DEFAULTS);
  const { navigate } = useTransitionNav();

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => { if (d.studio) setStudio(d.studio); });
  }, []);

  return (
    <footer className="relative border-t border-line bg-bg-soft mt-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <a href="/" className="inline-block mb-6">
            <Image
              src="/img/logo.jpeg"
              alt="Sam Studio Hair & Grooming"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
            />
          </a>
          <p className="text-fg-muted leading-relaxed text-sm max-w-xs">
            Herrfrisör och studio i Växjö. Precision, stil och ett personligt
            bemötande i varje besök.
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] mb-5" style={{ color: "#c8a46a" }}>
            Navigering
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#tjanster" onClick={(e) => { e.preventDefault(); navigate("#tjanster"); }} className="text-fg-muted hover:text-fg transition-colors cursor-pointer">Tjänster</a>
            </li>
            <li>
              <a href="#om-oss" onClick={(e) => { e.preventDefault(); navigate("#om-oss"); }} className="text-fg-muted hover:text-fg transition-colors cursor-pointer">Om oss</a>
            </li>
            <li>
              <a href="#galleri" onClick={(e) => { e.preventDefault(); navigate("#galleri"); }} className="text-fg-muted hover:text-fg transition-colors cursor-pointer">Galleri</a>
            </li>
            <li>
              <a href={studio.bookingUrl} target="_blank" rel="noopener" className="hover:text-fg transition-colors" style={{ color: "#e2c898" }}>
                Boka tid →
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] mb-5" style={{ color: "#c8a46a" }}>
            Kontakt & besök
          </p>
          <ul className="space-y-3 text-sm text-fg-muted leading-relaxed">
            <li>{studio.address}</li>
            <li>{studio.area}</li>
            {studio.hours.map((h) => (
              <li key={h.label}>{h.label} · {h.value}</li>
            ))}
            <li>
              <a href={`tel:${studio.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-fg transition-colors">
                {studio.phone}
              </a>
            </li>
            <li>
              <a href={studio.instagram} target="_blank" rel="noopener" className="hover:text-fg transition-colors">
                @samstudiovaxjo
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-fg-muted">
          <p>© {new Date().getFullYear()} Sam Studio Växjö. Alla rättigheter förbehållna.</p>
          <p>
            Skapad av{" "}
            <a href="https://saryonstudio.se" target="_blank" rel="noopener" className="hover:text-gold transition-colors" style={{ color: "#c8a46a" }}>
              Saryon Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
