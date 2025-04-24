
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CtaSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-mentor to-mentee text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of learners who are advancing their careers with MentorLink Sphere.
            Get access to expert mentors and quality courses today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                  <Link to="/register">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
