
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import MentorCard from './MentorCard';
import { Link } from 'react-router-dom';

// Temporary mock data
const mockMentors = [
  {
    id: '1',
    name: 'Dr. Maria Garcia',
    expertise: ['Data Science', 'Machine Learning', 'Python'],
    avatar: '/placeholder.svg',
    bio: 'Senior Data Scientist with 8+ years of experience in machine learning and AI. PhD in Computer Science from Stanford.',
    availability: 'Available Mon-Wed',
  },
  {
    id: '2',
    name: 'Robert Johnson',
    expertise: ['Web Development', 'React', 'Node.js'],
    avatar: '/placeholder.svg',
    bio: 'Full-stack developer with 10+ years experience. Specializing in modern JavaScript frameworks and responsive design.',
    availability: 'Available weekends',
  },
  {
    id: '3',
    name: 'Emily Chen',
    expertise: ['UX Design', 'UI Design', 'Figma'],
    avatar: '/placeholder.svg',
    bio: 'Lead UX/UI designer with experience at top tech companies. Passionate about creating accessible and beautiful digital experiences.',
    availability: 'Available Tue-Thu',
  },
];

const FeaturedMentors = () => {
  return (
    <section className="py-12 px-4 md:px-6 bg-sidebar">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Top Mentors</h2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to="/mentors">
              View All
              <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              id={mentor.id}
              name={mentor.name}
              expertise={mentor.expertise}
              avatar={mentor.avatar}
              bio={mentor.bio}
              availability={mentor.availability}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMentors;
