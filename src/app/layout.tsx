import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileMenuProvider } from "@/components/layout/MobileMenuProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | EnterpriseOS AI",
    default: "EnterpriseOS AI — Enterprise Intelligence Platform",
  },
  description:
    "Production-grade enterprise AI platform for executive reporting, AI agents, knowledge management, and analytics.",
  keywords: ["enterprise AI", "watsonx", "IBM", "AI agents", "knowledge management"],
  authors: [{ name: "EnterpriseOS AI" }],
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased font-sans">
        {/* Skip to main content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>

        <MobileMenuProvider>
          {/* Fixed sidebar */}
          <Sidebar />

          {/* Main content — offset by sidebar on desktop */}
          <div className="flex flex-col flex-1 md:ml-60 min-h-screen">
            <Header />
            <main id="main-content" className="flex-1 mt-14" tabIndex={-1}>
              {children}
            </main>
          </div>
        </MobileMenuProvider>
      </body>
    </html>
  );
}
