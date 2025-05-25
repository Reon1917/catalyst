import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StagewiseToolbar from "@/components/StagewiseToolbar";
import CommandPaletteProvider from "@/components/CommandPaletteProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catalyst - Marketing Campaign Planner",
  description: "Plan, manage, and optimize your marketing campaigns with data-driven insights",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/branding/logo-only.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/branding/logo-only.png",
        type: "image/png",
        sizes: "16x16",
      }
    ],
    shortcut: [
      {
        url: "/branding/logo-only.png",
        type: "image/png",
      }
    ],
    apple: [
      {
        url: "/branding/logo-only.png",
        type: "image/png",
        sizes: "180x180",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <CommandPaletteProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <StagewiseToolbar />
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
