import type { Metadata, Viewport } from "next";
import { auth } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistant Builder",
  description:
    "White-label Assistant Craft Tool instances for Gobonkers clients.",
  icons: {
    icon: "/logo-us.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#191A1B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="nl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        />
      </head>
      <body>
        {children}
        {session && <SignOutButton />}
      </body>
    </html>
  );
}
