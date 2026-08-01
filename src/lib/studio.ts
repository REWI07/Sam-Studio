export type Service = {
  name: string;
  duration: string;
  price: string;
  note?: string;
};

export const STUDIO_NAME = "Sam Studio";
export const STUDIO_CITY = "Växjö";
export const ADDRESS = "Sandgärdsgatan 16B, 352 30 Växjö";
export const AREA = "Växjö";
export const PHONE = "070-717 06 06";
export const EMAIL = "info@samstudio.se";
export const BOOKING_URL = "https://www.bokadirekt.se/places/sam-studio-hair-grooming-cz-salong-54523";
export const INSTAGRAM = "https://www.instagram.com/samstudiovaxjo/";

export const HOURS = [
  { label: "Mån-Fre", value: "09:00-19:00" },
  { label: "Lördag", value: "10:00-18:00" },
  { label: "Söndag", value: "11:00-16:30" },
];

export type ServiceCategory = {
  category: string;
  items: Service[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    category: "Barberartjänster",
    items: [
      { name: "Klassisk klippning med fade", duration: "30 min", price: "från 450 kr" },
      { name: "Klassisk klippning (utan fade)", duration: "25 min", price: "från 450 kr" },
      { name: "Klassisk klippning med tjockt / långt hår", duration: "40 min", price: "från 510 kr" },
      { name: "Skinfade med buzzcut", duration: "25 min", price: "från 410 kr" },
      { name: "Buzz cut (utan fade)", duration: "20 min", price: "från 340 kr" },
      { name: "Klippning hår & skägg", duration: "40 min", price: "från 640 kr" },
      { name: "VIP Barberare", duration: "60 min", price: "från 1 100 kr", note: "komplett paket" },
      { name: "Familj paket", duration: "60 min", price: "från 960 kr" },
      { name: "Student", duration: "25 min", price: "400 kr" },
      { name: "Student klippning + skägg", duration: "35 min", price: "från 510 kr" },
      { name: "Ungdomsklippning 10–15 år", duration: "30 min", price: "från 410 kr" },
      { name: "Barn klippning", duration: "25 min", price: "350 kr" },
      { name: "Pensionär klippning", duration: "25 min", price: "från 390 kr" },
      { name: "Skägg trimmer bas", duration: "20 min", price: "från 200 kr" },
      { name: "Skägg trimmer med fade (kort skägg)", duration: "20 min", price: "från 250 kr" },
      { name: "Skägg trimmer (lång skägg)", duration: "25 min", price: "från 280 kr" },
      { name: "Fön med styling", duration: "20 min", price: "från 270 kr" },
      { name: "Vaxning", duration: "15 min", price: "170 kr" },
      { name: "Tråd", duration: "15 min", price: "150 kr" },
    ],
  },
  {
    category: "Klippning & Ansikte",
    items: [
      { name: "American shave", duration: "30 min", price: "450 kr" },
      { name: "Lugg klippning", duration: "20 min", price: "200 kr" },
      { name: "Student långt hår (tvätt ingår ej)", duration: "40 min", price: "470 kr" },
      { name: "Ansiktsbehandling", duration: "20 min", price: "250 kr" },
    ],
  },
  {
    category: "Frisörtjänster – Dam",
    items: [
      { name: "Dam klippning kort hår", duration: "35 min", price: "från 640 kr" },
      { name: "Dam klippning av hårtoppar", duration: "45 min", price: "från 710 kr" },
      { name: "Dam klippning mellan / långt hår", duration: "60 min", price: "från 910 kr" },
    ],
  },
];

export const SERVICES: Service[] = SERVICE_CATEGORIES.flatMap((c) => c.items);

export const ACCENT = "#c8a46a";
export const ACCENT_SOFT = "#e2c898";
