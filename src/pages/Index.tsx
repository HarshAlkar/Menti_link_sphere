import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturedCourses from '@/components/FeaturedCourses';
import FeaturedMentors from '@/components/FeaturedMentors';
import Features from '@/components/Features';
import CtaSection from '@/components/CtaSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses />
        <FeaturedMentors />
        <Features />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
