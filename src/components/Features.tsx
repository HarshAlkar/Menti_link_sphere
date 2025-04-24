
import React from 'react';
import { Calendar, BookOpen, Users, Award, Clock, Brain } from 'lucide-react';

const features = [
  {
    title: 'AI-Powered Scheduling',
    description: 'Our intelligent system matches mentors and mentees based on availability and optimizes scheduling for both parties.',
    icon: <Calendar className="h-10 w-10 text-mentor" />,
  },
  {
    title: 'Expert-Led Courses',
    description: 'Access a wide range of courses taught by industry professionals and academic experts.',
    icon: <BookOpen className="h-10 w-10 text-mentor" />,
  },
  {
    title: 'Personalized Mentorship',
    description: 'Connect with mentors who can provide personalized guidance tailored to your specific goals and needs.',
    icon: <Users className="h-10 w-10 text-mentor" />,
  },
  {
    title: 'Skill Certification',
    description: 'Earn certificates to showcase your newly acquired skills and knowledge to potential employers.',
    icon: <Award className="h-10 w-10 text-mentor" />,
  },
  {
    title: 'Flexible Learning',
    description: 'Learn at your own pace with on-demand courses and flexible scheduling options for mentor sessions.',
    icon: <Clock className="h-10 w-10 text-mentor" />,
  },
  {
    title: 'Smart Learning Paths',
    description: 'Follow curated learning paths designed to build your skills progressively and efficiently.',
    icon: <Brain className="h-10 w-10 text-mentor" />,
  },
];

const Features = () => {
  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Powerful Features to Enhance Your Learning
          </h2>
          <p className="text-muted-foreground">
            MentorLink Sphere combines advanced technology with human expertise to provide
            a comprehensive learning and mentorship platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
