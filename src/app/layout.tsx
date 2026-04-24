import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistant Craft Tool",
  description:
    "Craft a tailored AI assistant system prompt in 8 guided steps. Bilingual (NL/EN).",
  icons: {
    icon: "/logo-us.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#191A1B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
