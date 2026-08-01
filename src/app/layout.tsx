import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ScissorsTransitionProvider } from "@/components/scissors-transition";
import LoadingScreen from "@/components/loading-screen";
import CookieBanner from "@/components/cookie-banner";
import ScrollProgress from "@/components/scroll-progress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://samstudio.se"),
  title: {
    default: "Sam Studio Växjö · Herrfrisör & Studio",
    template: "%s · Sam Studio Växjö",
  },
  description:
    "Sam Studio i Växjö — herrfrisör med fokus på precision, stil och det personliga mötet. Klippning, fade och skäggvård av högsta kvalitet.",
  keywords: [
    "frisör växjö",
    "herrfrisör växjö",
    "barber växjö",
    "fade växjö",
    "skägg växjö",
    "sam studio",
  ],
  icons: {
    icon: [{ url: "/img/logo.jpeg", type: "image/jpeg" }],
    apple: "/img/logo.jpeg",
  },
  openGraph: {
    title: "Sam Studio Växjö · Herrfrisör",
    description:
      "Herrfrisör och studio i Växjö. Precision, stil och ett personligt bemötande.",
    locale: "sv_SE",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Sam Studio",
  description: "Herrfrisör och barber i Växjö med fokus på precision, fade och skäggvård.",
  url: "https://samstudio.se",
  image: "https://samstudio.se/img/logo.jpeg",
  telephone: "+46000000000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sandgärdsgatan 16B",
    addressLocality: "Växjö",
    postalCode: "352 30",
    addressCountry: "SE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 56.8787,
    longitude: 14.8037,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "15:00" },
  ],
  priceRange: "$$",
  currenciesAccepted: "SEK",
  paymentAccepted: "Cash, Credit Card, Swish",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="sv"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full bg-bg text-fg flex flex-col">
        <ScissorsTransitionProvider>{children}</ScissorsTransitionProvider>
        <LoadingScreen />
        <CookieBanner />
        <ScrollProgress />
      </body>
    </html>
  );
}
