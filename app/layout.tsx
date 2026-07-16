import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://darky-t-website.vercel.app"),

  title: {
    default: "DARKY T | Premium Streetwear",
    template: "%s | DARKY T",
  },

  description:
    "Shop premium oversized T-shirts and streetwear from DARKY T. High-quality clothing with islandwide delivery across Sri Lanka.",

  keywords: [
    "DARKY T",
    "oversized t shirts Sri Lanka",
    "streetwear Sri Lanka",
    "premium clothing Sri Lanka",
    "Sri Lanka clothing brand",
  ],

  authors: [
    {
      name: "DARKY T",
    },
  ],

  creator: "DARKY T",
  publisher: "DARKY T",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "DARKY T | Premium Streetwear",
    description:
      "Shop premium oversized T-shirts and streetwear from DARKY T with islandwide delivery across Sri Lanka.",
    url: "https://darky-t-website.vercel.app",
    siteName: "DARKY T",
    images: [
      {
        url: "/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "DARKY T Premium Streetwear",
      },
    ],
    locale: "en_LK",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "DARKY T | Premium Streetwear",
    description:
      "Shop premium oversized T-shirts and streetwear from DARKY T.",
    images: ["/social-preview.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}