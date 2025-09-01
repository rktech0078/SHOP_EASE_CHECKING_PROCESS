'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'BreadcrumbList' | 'WebSite';
  data: Record<string, unknown>;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
};

export default StructuredData;
