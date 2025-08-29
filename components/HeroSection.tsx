'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/types';
import { Button } from './ui/Button';
import { ChevronLeft, ChevronRight, Play, Pause, Star, Sparkles, ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';
import { HeroSectionSkeleton } from './ui/skeleton';

interface HeroSectionProps {
  banners: Banner[];
}

const HeroSection = ({ banners }: HeroSectionProps) => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Loading skeleton delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBannerChange = useCallback(
    (getNextIndex: (prev: number) => number) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBanner(getNextIndex);
        setTimeout(() => setIsTransitioning(false), 200);
      }, 400);
    },
    []
  );

  const goToPrevious = useCallback(() => {
    handleBannerChange((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  }, [banners.length, handleBannerChange]);

  const goToNext = useCallback(() => {
    handleBannerChange((prev) => (prev + 1) % banners.length);
  }, [banners.length, handleBannerChange]);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [banners.length, isPaused, goToNext]);

  // Mouse position tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (isLoading) {
    return <HeroSectionSkeleton />;
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-[500px] w-full overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float-slow"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-white/10 rounded-full animate-float-fast"></div>
          <div className="absolute bottom-20 right-16 w-12 h-12 bg-white/10 rounded-full animate-float-slow"></div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced Text Content */}
            <div className="mb-6">
              <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white animate-fade-in-up">
              Welcome to ShopEase
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-medium">
              Your one-stop destination for quality products at 
              <span className="text-yellow-300 font-bold"> affordable prices</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group">
                <Link href="/products" className="flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 px-8 py-4 rounded-full">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-6 mt-12 text-white/80 animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm">4.9 Rating</span>
              </div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-sm">10,000+ Happy Customers</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-sm">Free Delivery</div>
            </div>
          </div>
        </div>

        {/* Custom Styles for Animations */}
        <style jsx>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(90deg); }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(270deg); }
          }
          .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
          .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
          .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
          .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
          .animation-delay-200 { animation-delay: 0.2s; }
          .animation-delay-400 { animation-delay: 0.4s; }
          .animation-delay-600 { animation-delay: 0.6s; }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  const banner = banners[currentBanner];
  
  // Early return if no banner
  if (!banner) {
    return null;
  }
  
  const imageUrl = banner.image ? urlFor(banner.image).url() : '';

  // Parallax calculation
  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <div 
      className="relative h-[420px] sm:h-[480px] md:h-[560px] lg:h-[700px] w-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced Image with Parallax Effect */}
      {imageUrl ? (
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={banner.title}
            fill
            priority
            className={`object-cover object-center transition-all duration-1000 ease-in-out ${
              isTransitioning ? 'opacity-60 scale-110' : 'opacity-100 scale-105'
            }`}
            style={{
              transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px) scale(${isHovered ? '1.08' : '1.05'})`,
              transition: 'transform 0.3s ease-out'
            }}
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Dynamic Color Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Animated Light Rays */}
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-white/20 to-transparent rotate-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-white/10 to-transparent -rotate-12 animate-pulse animation-delay-1000"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}

      {/* Enhanced Content with 3D Effect */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-10">
        <div
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            isTransitioning
              ? 'opacity-0 translate-y-8 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
          style={{
            transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
          }}
        >
          {/* Enhanced Title with Gradient Text */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white drop-shadow-2xl animate-gradient">
              {banner.title}
            </span>
          </h1>
          
          {banner.subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 mb-6 sm:mb-10 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              {banner.subtitle}
            </p>
          )}
          
          {banner.buttonText && banner.buttonLink && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-500/25 transition-all duration-300 group backdrop-blur-sm border border-white/20"
              >
                <Link href={banner.buttonLink} className="flex items-center gap-2">
                  {banner.buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:scale-105 px-8 py-4 rounded-full shadow-xl transition-all duration-300"
              >
                <Link href="/products">Explore More</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/20 hover:bg-white/40 text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-2xl hover:scale-110 hover:shadow-white/25 group z-20"
            aria-label="Previous banner"
          >
            <ChevronLeft size={28} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/20 hover:bg-white/40 text-white p-3 sm:p-4 rounded-full transition-all duration-300 shadow-2xl hover:scale-110 hover:shadow-white/25 group z-20"
            aria-label="Next banner"
          >
            <ChevronRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Enhanced Control Panel */}
      {banners.length > 1 && (
        <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
          <button
            onClick={togglePause}
            className="backdrop-blur-xl bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-300 shadow-lg hover:scale-110"
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>
      )}

      {/* Enhanced Progress Bar */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          <div className="flex space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`relative overflow-hidden transition-all duration-500 ${
                  index === currentBanner
                    ? 'w-12 h-3 bg-white rounded-full shadow-lg'
                    : 'w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              >
                {index === currentBanner && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator for Auto-slide */}
      {banners.length > 1 && !isPaused && (
        <div className="absolute bottom-2 left-0 w-full h-1 bg-white/20 z-20">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-progress"></div>
        </div>
      )}

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-float-1"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-float-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/20 rounded-full animate-float-3"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white/25 rounded-full animate-float-4"></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-10px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-8px) translateX(-3px); }
          66% { transform: translateY(8px) translateX(3px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(8px); }
        }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .animate-progress { animation: progress 6s linear infinite; }
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 6s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 5s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default HeroSection;