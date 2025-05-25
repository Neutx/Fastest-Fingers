import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KREO Fastest Fingers - Typing Contest",
  description: "Can you type faster than everyone else? Join the KREO typing contest and win amazing prizes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jost.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
