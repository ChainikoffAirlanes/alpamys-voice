import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Твой голос — Alpamys",
  description: "Идеи, которые делают школу лучше.",
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "Твой голос — Alpamys",
    description: "Идеи, которые делают школу лучше.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Твой голос — Alpamys" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Твой голос — Alpamys",
    description: "Идеи, которые делают школу лучше.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c513d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
