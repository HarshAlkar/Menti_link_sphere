
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-hero-pattern py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4 text-white">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Connect with Mentors and Accelerate Your Learning Journey
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-[600px] mx-auto">
              MentorLink Sphere uses AI-powered scheduling to connect you with the right mentor at the right time, alongside quality courses to boost your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link to="/courses">Explore Courses</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link to="/mentors">Find a Mentor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default HeroSection;
