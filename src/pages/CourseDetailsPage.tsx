import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Clock, Users, Star, BookOpen, Video, FileText,
  CheckCircle, ChevronRight, ArrowLeft, Bookmark,
  Share2, MessageSquare, Award, GraduationCap, Zap,
  Lightbulb, Brain, Target, Trophy, Shield, Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface User {
  name: string;
  avatar: string;
}

interface Instructor extends User {
  bio: string;
  expertise: string[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading';
  duration: string;
  preview: boolean;
  url?: string;
  content?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Review {
  id: string;
  user: User;
  rating: number;
  comment: string;
  date: string;
}

interface Course {
  id: string;
  title: string;
  instructor: Instructor;
  description: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  price: number;
  sections: Section[];
  requirements: string[];
  whatYouWillLearn: string[];
  reviews: Review[];
}

// Mock course data - this would typically come from an API
const mockCourses: Record<string, Course> = {
  '1': {
    id: '1',
    title: 'Machine Learning Essentials',
    instructor: {
      name: 'Dr. James Wilson',
      avatar: '/placeholder.svg',
      bio: 'Senior Data Scientist with 10+ years of experience in AI and ML',
      expertise: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow']
    },
    description: 'Understand the core concepts of machine learning algorithms and their applications.',
    category: 'AI & ML',
    level: 'Intermediate',
    duration: '8 weeks',
    rating: 4.8,
    students: 1250,
    price: 99.99,
    sections: [
      {
        id: '1',
        title: 'Introduction to Machine Learning',
        lessons: [
          {
            id: '1',
            title: 'What is Machine Learning?',
            type: 'video',
            duration: '15:30',
            preview: true,
            url: 'https://www.youtube.com/embed/example1'
          },
          {
            id: '2',
            title: 'Types of Machine Learning',
            type: 'video',
            duration: '20:15',
            preview: false,
            url: 'https://www.youtube.com/embed/example2'
          }
        ]
      }
    ],
    requirements: [
      'Basic understanding of programming',
      'Familiarity with Python',
      'No prior ML experience required'
    ],
    whatYouWillLearn: [
      'Fundamentals of machine learning',
      'Supervised and unsupervised learning',
      'Neural networks',
      'Model evaluation',
      'Practical applications'
    ],
    reviews: [
      {
        id: '1',
        user: {
          name: 'John Doe',
          avatar: '/placeholder.svg'
        },
        rating: 5,
        comment: 'Excellent course! Very well explained.',
        date: '1 week ago'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Advanced JavaScript Programming',
    instructor: {
      name: 'Alex Thompson',
      avatar: '/placeholder.svg',
      bio: 'Senior JavaScript Developer with 8+ years of experience',
      expertise: ['JavaScript', 'React', 'Node.js', 'TypeScript']
    },
    description: 'Take your JavaScript skills to the next level with advanced concepts and modern patterns.',
    category: 'Web Development',
    level: 'Advanced',
    duration: '10 weeks',
    rating: 4.7,
    students: 1800,
    price: 79.99,
    sections: [
      {
        id: '1',
        title: 'Advanced JavaScript Concepts',
        lessons: [
          {
            id: '1',
            title: 'Closures and Scope',
            type: 'video',
            duration: '18:30',
            preview: true,
            url: 'https://www.youtube.com/embed/example3'
          }
        ]
      }
    ],
    requirements: [
      'Intermediate JavaScript knowledge',
      'Basic understanding of ES6+',
      'Experience with web development'
    ],
    whatYouWillLearn: [
      'Advanced JavaScript patterns',
      'Functional programming',
      'Asynchronous programming',
      'Performance optimization',
      'Modern JavaScript features'
    ],
    reviews: [
      {
        id: '1',
        user: {
          name: 'Jane Smith',
          avatar: '/placeholder.svg'
        },
        rating: 4,
        comment: 'Great content, very challenging!',
        date: '2 weeks ago'
      }
    ]
  },
  '3': {
    id: '3',
    title: 'UX/UI Design Principles',
    instructor: {
      name: 'Elena Rodriguez',
      avatar: '/placeholder.svg',
      bio: 'Senior UX Designer with 8+ years of experience in creating intuitive and beautiful digital interfaces',
      expertise: ['UX Design', 'UI Design', 'User Research', 'Prototyping']
    },
    description: 'Learn the principles of creating user-friendly and aesthetically pleasing digital interfaces. Master the art of designing intuitive user experiences and beautiful user interfaces.',
    category: 'Design',
    level: 'Intermediate',
    duration: '6 weeks',
    rating: 4.9,
    students: 2150,
    price: 899,
    sections: [
      {
        id: '1',
        title: 'Introduction to UX/UI Design',
        lessons: [
          {
            id: '1',
            title: 'What is UX/UI Design?',
            type: 'video',
            duration: '12:30',
            preview: true,
            url: 'https://www.youtube.com/embed/example4'
          },
          {
            id: '2',
            title: 'Design Thinking Process',
            type: 'video',
            duration: '15:45',
            preview: false,
            url: 'https://www.youtube.com/embed/example5'
          }
        ]
      },
      {
        id: '2',
        title: 'User Research',
        lessons: [
          {
            id: '3',
            title: 'User Interviews',
            type: 'video',
            duration: '18:20',
            preview: false,
            url: 'https://www.youtube.com/embed/example6'
          },
          {
            id: '4',
            title: 'User Personas',
            type: 'video',
            duration: '14:15',
            preview: false,
            url: 'https://www.youtube.com/embed/example7'
          }
        ]
      }
    ],
    requirements: [
      'Basic understanding of design principles',
      'Familiarity with design tools (Figma, Adobe XD, or Sketch)',
      'No prior UX/UI experience required'
    ],
    whatYouWillLearn: [
      'Fundamentals of UX/UI design',
      'User research methods',
      'Wireframing and prototyping',
      'Design systems',
      'Accessibility principles',
      'User testing techniques'
    ],
    reviews: [
      {
        id: '1',
        user: {
          name: 'Sarah Johnson',
          avatar: '/placeholder.svg'
        },
        rating: 5,
        comment: 'This course completely transformed my approach to design. The instructor explains complex concepts in a simple way.',
        date: '2 weeks ago'
      },
      {
        id: '2',
        user: {
          name: 'Michael Chen',
          avatar: '/placeholder.svg'
        },
        rating: 4,
        comment: 'Great course with practical examples. Would recommend to anyone starting in UX/UI design.',
        date: '1 month ago'
      }
    ]
  }
};

const CourseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [courseData, setCourseData] = useState<Course | null>(mockCourses[id as keyof typeof mockCourses] || null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!courseData) {
      navigate('/courses');
      toast({
        title: "Course Not Found",
        description: "The requested course could not be found.",
        variant: "destructive"
      });
    }
  }, [courseData, navigate, toast]);

  if (!courseData) {
    return null;
  }

  const handleEnroll = () => {
    setIsEnrolled(true);
    toast({
      title: "Enrollment Successful!",
      description: "You have successfully enrolled in this course.",
    });
    navigate(`/courses/${id}/learn`);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from Bookmarks" : "Added to Bookmarks",
      description: isBookmarked ? "Course removed from your bookmarks." : "Course added to your bookmarks.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold mb-4">{courseData.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-semibold">{courseData.rating}</span>
                  <span className="text-gray-500 ml-1">({courseData.students} students)</span>
                </div>
                <Badge variant="secondary">{courseData.level}</Badge>
                <Badge variant="secondary">{courseData.category}</Badge>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{courseData.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{courseData.students} enrolled</span>
                </div>
              </div>
              <p className="text-gray-700 mb-6">{courseData.description}</p>
              <div className="flex items-center space-x-4">
                <Button onClick={handleEnroll} disabled={isEnrolled}>
                  {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                </Button>
                <Button variant="outline" onClick={toggleBookmark}>
                  {isBookmarked ? <Bookmark className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                </Button>
                <Button variant="outline">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courseData.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {courseData.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-6">
                  {courseData.sections.map((section) => (
                    <div key={section.id} className="border rounded-lg">
                      <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-semibold">{section.title}</h3>
                      </div>
                      <div className="divide-y">
                        {section.lessons.map((lesson) => (
                          <div key={lesson.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {lesson.type === 'video' ? (
                                <Video className="h-5 w-5 text-gray-500" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-500" />
                              )}
                              <span>{lesson.title}</span>
                              {lesson.preview && (
                                <Badge variant="outline">Preview</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">{lesson.duration}</span>
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="p-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={courseData.instructor.avatar} />
                    <AvatarFallback>{courseData.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{courseData.instructor.name}</h3>
                    <p className="text-gray-600 mb-4">{courseData.instructor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {courseData.instructor.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  {courseData.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.user.avatar} />
                            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{review.user.name}</h4>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">Rs.{courseData.price}</span>
                  <Badge variant="secondary">Best Value</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-gray-500" />
                    <span>{courseData.sections.reduce((acc, section) => acc + section.lessons.length, 0)} lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{courseData.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span>{courseData.students} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-gray-500" />
                    <span>Certificate of Completion</span>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={handleEnroll} disabled={isEnrolled}>
                  {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-blue-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                  <span>Practical exercises</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span>Interactive learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Real-world projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-blue-500" />
                  <span>Achievement badges</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Money-back guarantee</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage; 