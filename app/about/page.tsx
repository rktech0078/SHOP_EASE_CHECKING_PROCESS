import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ShopEase',
  description: 'Learn more about ShopEase, our mission, vision, and the team behind your favorite online shopping destination.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">About ShopEase</h1>
            <p className="text-lg md:text-xl text-white/90">
              Your trusted partner for quality products and exceptional shopping experience
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in animation-delay-100">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Story
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2023, ShopEase began with a simple mission: to make online shopping truly easy and enjoyable. 
                We believe that shopping should be a pleasure, not a chore.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                What started as a small venture has now grown into a trusted e-commerce platform offering thousands of 
                quality products across multiple categories. Our journey has been defined by our commitment to customer 
                satisfaction and product excellence.
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl animate-fade-in animation-delay-200">
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <Image 
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80" 
                alt="ShopEase team working" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white animate-fade-in">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality',
                description: 'We never compromise on the quality of our products. Each item is carefully selected and verified.',
                icon: '✓',
                delay: '100'
              },
              {
                title: 'Customer First',
                description: 'Your satisfaction is our top priority. Were committed to providing exceptional service at every step.',
                icon: '♥',
                delay: '200'
              },
              {
                title: 'Innovation',
                description: 'We continuously evolve and improve our platform to enhance your shopping experience.',
                icon: '★',
                delay: '300'
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-${value.delay}`}
              >
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white animate-fade-in">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
                delay: '100'
              },
              {
                name: 'Michael Chen',
                role: 'CTO',
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
                delay: '200'
              },
              {
                name: 'Priya Patel',
                role: 'Head of Design',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80',
                delay: '300'
              },
              {
                name: 'David Wilson',
                role: 'Customer Experience',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
                delay: '400'
              }
            ].map((member, index) => (
              <div 
                key={index} 
                className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in animation-delay-${member.delay}`}
              >
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Get in Touch</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you. Our customer support team is always ready to help.
          </p>
          <a 
            href="mailto:contact@shopease.com" 
            className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}