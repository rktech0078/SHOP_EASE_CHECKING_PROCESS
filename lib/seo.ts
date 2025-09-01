export const generateSEOData = (page: string, customData?: Record<string, unknown>) => {
  const baseData = {
    siteName: 'Rushk.pk',
    siteUrl: 'https://rushk.pk',
    description: 'Discover the latest Pakistani fashion trends at Rushk.pk. Shop premium clothing, traditional wear, modern fashion, and stylish accessories.',
  };

  const pageData = {
    home: {
      title: 'Rushk.pk - Premium Pakistani Clothing Brand | Fashion & Style',
      description: 'Discover the latest Pakistani fashion trends at Rushk.pk. Shop premium clothing, traditional wear, modern fashion, and stylish accessories. Free shipping across Pakistan.',
      keywords: 'Pakistani clothing, Pakistani fashion, traditional wear, modern fashion, online clothing store, Pakistani dresses, shalwar kameez, western wear, fashion accessories, Pakistan fashion',
      ogImage: '/images/rushk-home-og.jpg',
    },
    products: {
      title: 'Shop Fashion Collection | Rushk.pk - Pakistani Clothing Brand',
      description: 'Explore our exclusive collection of Pakistani fashion. From traditional shalwar kameez to modern western wear, find your perfect style at Rushk.pk.',
      keywords: 'Pakistani dresses, shalwar kameez, western wear, fashion collection, online shopping, Pakistan fashion',
      ogImage: '/images/rushk-products-og.jpg',
    },
    categories: {
      title: 'Fashion Categories | Rushk.pk - Pakistani Clothing Store',
      description: 'Browse through our carefully curated fashion categories. Find traditional wear, modern fashion, and accessories at Rushk.pk.',
      keywords: 'fashion categories, traditional wear, modern fashion, accessories, Pakistani clothing categories',
      ogImage: '/images/rushk-categories-og.jpg',
    },
    about: {
      title: 'About Rushk.pk - Premium Pakistani Clothing Brand',
      description: 'Learn about Rushk.pk, Pakistan\'s premier clothing brand. We bring you the finest traditional and modern fashion with quality and style.',
      keywords: 'about Rushk.pk, Pakistani clothing brand, fashion company, Rushk.pk story',
      ogImage: '/images/rushk-about-og.jpg',
    },
    contact: {
      title: 'Contact Rushk.pk - Get in Touch | Pakistani Clothing Brand',
      description: 'Contact Rushk.pk for customer support, inquiries, or feedback. We\'re here to help you with your fashion needs.',
      keywords: 'contact Rushk.pk, customer support, fashion inquiries, Rushk.pk contact',
      ogImage: '/images/rushk-contact-og.jpg',
    },
  };

  const data = customData || pageData[page as keyof typeof pageData] || pageData.home;

  return {
    ...baseData,
    ...data,
    canonical: `${baseData.siteUrl}/${page === 'home' ? '' : page}`,
  };
};

export const generateStructuredData = (type: string, data: Record<string, unknown>) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  return {
    ...baseStructure,
    ...data,
  };
};
