import type { Metadata } from "next";
import { Inter, Jost, Courier_Prime } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { DevToolsBlocker } from "@/components/ui/dev-tools-blocker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400"],
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';
                
                // Immediate protection before page loads
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                  return false;
                }, true);
                
                document.addEventListener('keydown', function(e) {
                  // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
                  if (e.keyCode === 123 || 
                      (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                      (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
                      (e.ctrlKey && e.keyCode === 85) ||
                      (e.ctrlKey && e.shiftKey && e.keyCode === 67)) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);
                
                // Console warning
                setTimeout(function() {
                  console.clear();
                  console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
                  console.log('%cDeveloper tools are prohibited during the contest!', 'color: red; font-size: 16px;');
                }, 100);
                
                // Override console methods
                const originalLog = console.log;
                const originalClear = console.clear;
                
                Object.defineProperty(console, 'log', {
                  value: function() {
                    if (arguments[0] && arguments[0].includes && arguments[0].includes('STOP!')) {
                      originalLog.apply(console, arguments);
                    }
                  }
                });
                
                Object.defineProperty(console, 'clear', {
                  value: function() {
                    originalClear.apply(console, arguments);
                    setTimeout(function() {
                      console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
                      console.log('%cDeveloper tools are prohibited!', 'color: red; font-size: 16px;');
                    }, 100);
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jost.variable} ${courierPrime.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <DevToolsBlocker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
