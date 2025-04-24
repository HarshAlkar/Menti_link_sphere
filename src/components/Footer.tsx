
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-white py-6 px-4 md:px-6 mt-auto">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">MentorLink Sphere</h3>
          <p className="text-sm text-muted-foreground">
            Connecting mentors and learners through advanced AI scheduling and quality educational content.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Platform</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary">
                Browse Courses
              </Link>
            </li>
            <li>
              <Link to="/mentors" className="text-sm text-muted-foreground hover:text-primary">
                Find Mentors
              </Link>
            </li>
            <li>
              <Link to="/become-a-mentor" className="text-sm text-muted-foreground hover:text-primary">
                Become a Mentor
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="text-sm text-muted-foreground hover:text-primary">
                AI Scheduling
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/careers" className="text-sm text-muted-foreground hover:text-primary">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t">
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MentorLink Sphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
