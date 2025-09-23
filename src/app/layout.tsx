import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-press-start-2p",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nine To Fight",
  description: "The only corporate simulation game you'll ever need",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.className} antialiased bg-[#5787cb]`}>
        {children}
      </body>
    </html>
  );
}
