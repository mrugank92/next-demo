import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "@/components/Footer";
import StoreProvider from "@/redux/StoreProvider";
import SwrProvider from "@/providers/SwrProvider";
import PageTransition from "@/components/PageTransition";
import { ToastContainer } from "react-toastify";
import { BaseErrorBoundary } from "@/components/error-boundaries";
import React from "react";

/**
 * Initialize the Montserrat font with desired subsets and weights.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/**
 * Metadata for the application, enhancing SEO and providing useful information.
 */
export const metadata: Metadata = {
  title: "My Movie",
  description: "A simple movie app",
};

/**
 * Interface representing the expected parameters for RootLayout.
 */
interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

/**
 * RootLayout Component
 *
 * Serves as the root layout for the application, wrapping all pages.
 * Incorporates internationalization, global state management, and consistent theming.
 */
export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Fetch localized messages based on the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${montserrat.className} flex flex-col min-h-screen w-full`}
      >
        {/* Skip Links for Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <a href="#footer" className="skip-link">
          Skip to footer
        </a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <BaseErrorBoundary>
            <StoreProvider>
              <SwrProvider>
                <main
                  id="main-content"
                  className="flex-grow"
                  role="main"
                  aria-label="Main content"
                >
                  <PageTransition>
                    <div className="fc-container">{children}</div>
                  </PageTransition>
                </main>
              </SwrProvider>
            </StoreProvider>
          </BaseErrorBoundary>
        </NextIntlClientProvider>
        <footer id="footer" role="contentinfo" aria-label="Site footer">
          <Footer />
        </footer>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
