import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
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
      <body className={`${pressStart2P.className} antialiased bg-[#5787cb]`}>
        {children}
      </body>
    </html>
  );
}
