import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { LoadingProvider } from "../context/LoadingContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { InitialLoader } from "@/components/ui/ModernLoader";
import StructuredData from "@/components/StructuredData";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rushk.pk"),
  title: "Rushk.pk - Premium Pakistani Clothing Brand | Fashion & Style",
  description:
    "Discover the latest Pakistani fashion trends at Rushk.pk. Shop premium clothing, traditional wear, modern fashion, and stylish accessories. Free shipping across Pakistan.",
  keywords:
    "Pakistani clothing, Pakistani fashion, traditional wear, modern fashion, online clothing store, Pakistani dresses, shalwar kameez, western wear, fashion accessories, Pakistan fashion",
  authors: [{ name: "Rushk.pk Team" }],
  creator: "Rushk.pk",
  publisher: "Rushk.pk",
  category: "Fashion & Clothing",
  classification: "E-commerce",
  openGraph: {
    title: "Rushk.pk - Premium Pakistani Clothing Brand",
    description:
      "Discover the latest Pakistani fashion trends at Rushk.pk. Shop premium clothing, traditional wear, modern fashion, and stylish accessories.",
    url: "https://rushk.pk",
    siteName: "Rushk.pk",
    images: [
      {
        url: "/images/rushk-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rushk.pk - Premium Pakistani Clothing Brand",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rushk.pk - Premium Pakistani Clothing Brand",
    description:
      "Discover the latest Pakistani fashion trends at Rushk.pk. Shop premium clothing, traditional wear, modern fashion, and stylish accessories.",
    images: ["/images/rushk-twitter-image.jpg"],
    creator: "@rushkpk",
    site: "@rushkpk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rushk.pk",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Rushk.pk",
    "application-name": "Rushk.pk",
    "msapplication-TileImage": "/images/rushk-icon-144x144.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/rushk-icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rushk.pk" />

        <StructuredData
          type="Organization"
          data={{
            name: "Rushk.pk",
            url: "https://rushk.pk",
            logo: "https://rushk.pk/images/rushk-logo.png",
            description:
              "Premium Pakistani clothing brand offering traditional and modern fashion",
            address: {
              "@type": "PostalAddress",
              addressCountry: "PK",
              addressLocality: "Pakistan",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+92-XXX-XXXXXXX",
              contactType: "customer service",
            },
            sameAs: [
              "https://facebook.com/rushkpk",
              "https://instagram.com/rushkpk",
              "https://twitter.com/rushkpk",
            ],
          }}
        />
        <StructuredData
          type="WebSite"
          data={{
            name: "Rushk.pk",
            url: "https://rushk.pk",
            description: "Premium Pakistani clothing brand",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://rushk.pk/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </head>
      <body className="antialiased bg-background text-foreground font-geist-sans">
        <NextAuthProvider>
          <AuthProvider>
            <LoadingProvider>
              <CartProvider>
                <WishlistProvider>
                  <InitialLoader />
                  <Navbar />
                  <main className="pt-16 min-h-screen">{children}</main>
                  <SpeedInsights />
                  <Footer />
                </WishlistProvider>
              </CartProvider>
            </LoadingProvider>
          </AuthProvider>
        </NextAuthProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HT2SBL7HRD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-HT2SBL7HRD');
  `}
        </Script>
      </body>
    </html>
  );
}
