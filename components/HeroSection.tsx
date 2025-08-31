'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/types';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { HeroSectionSkeleton } from './ui/skeleton';

interface HeroSectionProps {
  banners: Banner[];
}

const HeroSection = ({ banners }: HeroSectionProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Loading skeleton delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentBanner((prev) =>
      prev === 0 ? (banners?.length || 1) - 1 : prev - 1
    );
  }, [banners?.length]);

  const goToNext = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % (banners?.length || 1));
  }, [banners?.length]);

  const goToBanner = useCallback((index: number) => {
    setCurrentBanner(index);
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if ((banners?.length || 0) <= 1) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, 10000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [banners?.length, goToNext]);

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full bg-gray-100">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg mb-4"></div>
            <Button size="sm" className="bg-black text-white px-4 py-2 rounded-none">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const banner = banners[currentBanner];
  
  if (!banner) {
    return null;
  }
  
  const desktopImageUrl = banner.image ? urlFor(banner.image).url() : '';
  const mobileImageUrl = banner.mobileImage ? urlFor(banner.mobileImage).url() : '';



  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full overflow-hidden">
      {/* Responsive Banner Images */}
      {mobileImageUrl && (
        <Image
          src={mobileImageUrl}
          alt={banner.title || 'Hero Banner - Mobile'}
          fill
          priority
          className="object-cover object-center block md:hidden"
          style={{
            objectPosition: 'center center'
          }}
          quality={95}
          sizes="(max-width: 768px) 100vw, 0vw"
        />
      )}
      
      {desktopImageUrl && (
        <Image
          src={desktopImageUrl}
          alt={banner.title || 'Hero Banner - Desktop'}
          fill
          priority
          className="object-cover object-center hidden md:block"
          style={{
            objectPosition: 'center center'
          }}
          quality={95}
          sizes="(min-width: 768px) 100vw, 0vw"
        />
      )}
      
      {/* Fallback if no images */}
      {!mobileImageUrl && !desktopImageUrl && (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 mx-auto"></div>
            <p className="text-sm">No banner image available</p>
          </div>
        </div>
      )}

      {/* Simple Small Button - Top Right */}
      {banner.buttonText && banner.buttonLink && (
        <div className="absolute top-6 right-6 z-20">
          <Button size="sm" className="bg-black text-white px-4 py-2 rounded-none text-sm">
            <Link href={banner.buttonLink}>
              {banner.buttonText}
            </Link>
          </Button>
        </div>
      )}

      {/* Simple Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-300 hover:scale-110 z-20"
            aria-label="Previous banner"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all duration-300 hover:scale-110 z-20"
            aria-label="Next banner"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Simple Progress Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToBanner(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentBanner
                  ? 'bg-white scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;