'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface MetadataHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

const MetadataHead = ({
  title = 'ShopEase - Your One-Stop Online Shopping Destination',
  description = 'Discover quality products at affordable prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout.',
  keywords = 'online shopping, ecommerce, electronics, fashion, home goods, affordable products',
  ogImage = '/images/og-image.jpg',
  ogUrl = 'https://shopease.com',
  canonical,
}: MetadataHeadProps) => {
  // Update page title dynamically
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Head>
  );
};

export default MetadataHead;