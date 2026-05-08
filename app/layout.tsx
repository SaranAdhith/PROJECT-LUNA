import type { Metadata } from "next";
import { Syne, Space_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ui/ClientShell";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "LUNA — AI Satellite Intelligence Platform",
  description:
    "The Intelligence Layer for Earth's Orbit. Explore 9,000+ active satellites, orbital analytics, space history, and AI-powered mission intelligence.",
  keywords: ["satellite", "space", "AI", "orbit", "NASA", "ISS", "Starlink", "LUNA"],
  openGraph: {
    title: "LUNA — AI Satellite Intelligence Platform",
    description: "The Intelligence Layer for Earth's Orbit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceMono.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full bg-[#030308] text-white antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
