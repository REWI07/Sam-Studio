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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="sv"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-fg flex flex-col">
        <ScissorsTransitionProvider>{children}</ScissorsTransitionProvider>
        <LoadingScreen />
        <CookieBanner />
        <ScrollProgress />
      </body>
    </html>
  );
}
