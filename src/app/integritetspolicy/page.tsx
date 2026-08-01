import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Sam Studios integritetspolicy – hur vi hanterar dina personuppgifter.",
};

export default function IntegritetspolicyPage() {
  return (
    <main className="min-h-screen bg-bg text-fg px-6 py-24 md:py-32">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] mb-12 transition-colors"
          style={{ color: "#c8a46a" }}
        >
          ← Tillbaka
        </Link>

        <h1 className="font-display text-4xl md:text-5xl mb-3">Integritetspolicy</h1>
        <p className="text-xs uppercase tracking-widest mb-12" style={{ color: "#9e9590" }}>
          Sam Studio Växjö · Senast uppdaterad: 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "rgba(236,230,220,0.75)" }}>
          <section>
            <h2 className="font-display text-lg text-fg mb-3">1. Personuppgiftsansvarig</h2>
            <p>
              Sam Studio, Sandgärdsgatan 16B, 352 30 Växjö, ansvarar för behandlingen av dina
              personuppgifter på denna webbplats.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-fg mb-3">2. Vilka uppgifter samlar vi in?</h2>
            <p>
              Vi samlar inte in personuppgifter direkt via denna webbplats. Bokning sker via
              Bokadirekt, vars egna integritetspolicy gäller för de uppgifter du lämnar där.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-fg mb-3">3. Cookies</h2>
            <p>
              Vi använder en teknisk cookie (<span className="font-mono text-xs bg-white/5 px-1 py-0.5 rounded">cookies-ok</span>)
              för att komma ihåg ditt samtycke till cookies. Cookien innehåller
              ingen personlig information och lagras lokalt i din webbläsare. Ingen
              analys- eller spårningscookie används.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-fg mb-3">4. Tredjepartstjänster</h2>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                <strong className="text-fg">Google Maps</strong> — används för att visa vår adress. Google kan
                samla in data enligt Googles sekretesspolicy.
              </li>
              <li>
                <strong className="text-fg">Bokadirekt</strong> — bokningar hanteras av Bokadirekt. Deras
                integritetspolicy gäller för de uppgifter du anger vid bokning.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-fg mb-3">5. Dina rättigheter</h2>
            <p>
              Enligt GDPR har du rätt att begära tillgång till, rättelse eller radering av
              eventuella personuppgifter vi behandlar. Kontakta oss via telefon eller besök
              salongen för att utöva dina rättigheter.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg text-fg mb-3">6. Kontakt</h2>
            <p>
              Har du frågor om hur vi hanterar personuppgifter är du välkommen att kontakta
              oss direkt i salongen eller via telefon.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-line">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] transition-colors"
            style={{ color: "#c8a46a" }}
          >
            ← Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </main>
  );
}
