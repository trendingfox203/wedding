import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import localFont from "next/font/local";
import { weddingConfig } from "@/lib/wedding-config";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Font thật từ thiết kế Figma (layer "Lê Duy & Quỳnh Khanh"): Fz Alpha Brights.
const script = localFont({
  src: "./fonts/FzAlphaBrights.otf",
  variable: "--font-script",
  display: "swap",
});

// Hero (frame1): "A LOVE STORY" + ngày tháng.
const velour = localFont({
  src: "./fonts/velourraw-trial-regular.ttf",
  variable: "--font-velour",
  display: "swap",
});

// Hero (frame1): "Duy & Khanh".
const parfumerie = localFont({
  src: "./fonts/ParfumerieScriptText.otf",
  variable: "--font-parfumerie",
  display: "swap",
});
const gtDisplay = localFont({
  src: "./fonts/GTSuperDisplay-Regular.otf",
  variable: "--font-gt",
  display: "swap",
});
// Hero (frame1): "With love".
const gtDisplayItalic = localFont({
  src: "./fonts/GT-Super-Display-Light-Italic.otf",
  variable: "--font-gt-italic",
  display: "swap",
});

// Timeline (frame3): tiêu đề "A decade of us". Details trở đi: tiêu đề mỗi section.
const milton = localFont({
  src: "./fonts/Milton_Two.otf",
  variable: "--font-milton",
  display: "swap",
});

// Timeline (frame3): chữ trong card (năm/địa điểm/mô tả).
const valencia = localFont({
  src: "./fonts/Valencia-Light Regular.ttf",
  variable: "--font-valencia",
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const { groom, bride } = weddingConfig;

export const metadata: Metadata = {
  title: `${groom.shortName} & ${bride.shortName} — Wedding Invitation`,
  description: `Join us in celebrating the wedding of ${groom.fullName} and ${bride.fullName}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${script.variable} ${velour.variable} ${parfumerie.variable} ${gtDisplayItalic.variable} ${milton.variable} ${valencia.variable} ${body.variable} h-full snap-y snap-proximity antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
