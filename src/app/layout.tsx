import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const slideHeading = Fraunces({
  variable: "--font-slide-heading",
  subsets: ["latin"],
});

const slideBody = DM_Sans({
  variable: "--font-slide-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zlider — AI slide maker",
  description: "Prompt, edit, and export presentation decks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${slideHeading.variable} ${slideBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
