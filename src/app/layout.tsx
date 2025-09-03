import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PHProvider } from "@/components/providers/posthog-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FAQBuilder - SEO-Friendly FAQ Generator",
  description: "Generate People Also Ask-style FAQs with JSON-LD schema for better SEO and rich snippets. Perfect for developer tools and SaaS products.",
  keywords: ["FAQ", "SEO", "JSON-LD", "structured data", "rich snippets", "People Also Ask", "developer tools"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <PHProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </Suspense>
          </AuthProvider>
        </PHProvider>
      </body>
    </html>
  );
}
