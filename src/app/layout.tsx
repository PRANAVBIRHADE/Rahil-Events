import type { Metadata } from "next";
import "./globals.css";
import IntroSequence from "@/components/ui/IntroSequence";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "KRATOS 2026 | Technical Festival",
  description: "Matoshri Engineering Festival. A convergence of logic, design, and raw technical power.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col pt-32 font-sans selection:bg-primary-container selection:text-on-primary-container">
        <IntroSequence />
        <div className="fixed top-0 w-full z-50">
          <Navbar />
          <AnnouncementBar />
        </div>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
