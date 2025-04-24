
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

// Temporary mock data
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
    },
    category: 'Web Development',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
  },
  {
    id: '2',
    title: 'Data Science Fundamentals with Python',
    instructor: {
      name: 'Michael Chen',
      avatar: '/placeholder.svg',
    },
    category: 'Data Science',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Master the fundamentals of data analysis using Python and popular libraries.',
  },
  {
    id: '3',
    title: 'UX/UI Design Principles',
    instructor: {
      name: 'Elena Rodriguez',
      avatar: '/placeholder.svg',
    },
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    description: 'Learn the principles of creating user-friendly and aesthetically pleasing digital interfaces.',
  },
  {
    id: '4',
    title: 'Machine Learning Essentials',
    instructor: {
      name: 'Dr. James Wilson',
      avatar: '/placeholder.svg',
    },
    category: 'AI & ML',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Understand the core concepts of machine learning algorithms and their applications.',
  },
];

const FeaturedCourses = () => {
  return (
    <section className="py-12 px-4 md:px-6">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Courses</h2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link to="/courses">
              View All
              <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              instructor={course.instructor}
              category={course.category}
              thumbnail={course.thumbnail}
              description={course.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
