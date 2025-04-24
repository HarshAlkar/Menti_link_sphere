
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MentorCard from '@/components/MentorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

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
  {
    id: '4',
    name: 'James Wilson',
    expertise: ['AI', 'Machine Learning', 'Computer Vision'],
    avatar: '/placeholder.svg',
    bio: 'AI researcher with focus on computer vision and deep learning. Previously worked at Google AI and published papers at top conferences.',
    availability: 'Available evenings',
  },
  {
    id: '5',
    name: 'Sarah Thompson',
    expertise: ['Digital Marketing', 'SEO', 'Content Strategy'],
    avatar: '/placeholder.svg',
    bio: 'Marketing executive with expertise in digital transformation. Helped scale multiple startups and Fortune 500 companies.',
    availability: 'Available Mon-Fri',
  },
  {
    id: '6',
    name: 'Dr. Ahmed Khan',
    expertise: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
    avatar: '/placeholder.svg',
    bio: 'Cybersecurity expert with 15+ years of experience. Certified ethical hacker and security consultant for major organizations.',
    availability: 'Available weekends',
  },
];

const Mentors = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container py-8 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-8">Find a Mentor</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Search mentors by name or expertise..." className="pl-10" />
            </div>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="ai">AI & ML</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="security">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="availability">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="availability">Any Availability</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          <div className="mt-8 flex justify-center">
            <Button variant="outline" size="lg">Load More Mentors</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Mentors;
