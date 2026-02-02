import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Silverball Rules - Bob's Guide to Classic Pinball Machines",
  description: "Rules, tips, and strategies for classic pinball machines. Find quickie rules, full strategies, and expert advice from Bob Matthews.",
  keywords: "pinball, rules, strategy, classic pinball, Bob Matthews, silverball",
  metadataBase: new URL('https://rules.silverballmania.com'),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Silverball Rules',
    title: "Silverball Rules - Bob's Guide to Classic Pinball Machines",
    description: "Rules, tips, and strategies for classic pinball machines. Find quickie rules, full strategies, and expert advice from Bob Matthews.",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Silverball Rules - Bob's Guide to Classic Pinball Machines",
    description: "Rules, tips, and strategies for classic pinball machines.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${roboto.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
