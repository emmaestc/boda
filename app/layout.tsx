import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Jost } from "next/font/google";
import { wedding } from "@/lib/config/wedding";
import "./globals.css";

/* Tres familias, ni una más: serif para los títulos, manuscrita para las
   frases del corazón y una sans limpia para la información práctica. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(wedding.seo.url),
  title: wedding.seo.title,
  description: wedding.seo.description,
  applicationName: wedding.couple.first + " & " + wedding.couple.second,
  authors: [{ name: wedding.couple.first + " & " + wedding.couple.second }],
  keywords: [
    "matrimonio",
    "boda",
    "invitación",
    wedding.couple.first,
    wedding.couple.second,
    wedding.date.year,
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: wedding.seo.url,
    siteName: wedding.seo.title,
    title: wedding.seo.title,
    description: wedding.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.seo.title,
    description: wedding.seo.description,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#fcfbf8",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${cormorant.variable} ${greatVibes.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-porcelain text-ink">{children}</body>
    </html>
  );
}
