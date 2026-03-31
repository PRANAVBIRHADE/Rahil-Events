import type { Metadata } from "next";
import "./globals.css";
import IntroSequence from "@/components/ui/IntroSequence";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import GlobalMotionLayer from "@/components/layout/GlobalMotionLayer";

export const metadata: Metadata = {
  title: "KRATOS 2026 | Technical Festival",
  description: "Annual Technical Festival of MPGI Engineering - Build. Compete. Innovate. Two days of innovation, competition, and creativity at Matoshri Pratishthan Group of Institutions, Nanded.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col pt-32 font-sans selection:bg-primary-container selection:text-on-primary-container relative">
        <GlobalMotionLayer />
        <IntroSequence />
        <div className="fixed top-0 w-full z-50">
          <Navbar />
          <AnnouncementBar />
        </div>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
