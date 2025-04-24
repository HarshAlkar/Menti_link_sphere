import React, { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from 'components/Navigation';
import Footer from 'components/Footer';
import { Button } from 'components/ui/button';
import { Card, CardContent } from 'components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Progress } from 'components/ui/progress';
import { Check, Lock, PlayCircle, FileText, MessageSquare, Award, Clock, Users } from 'lucide-react';
import { useAuth } from 'contexts/AuthContext';
import { useToast } from 'components/ui/use-toast';

// Mock course data
const mockCourseData = {
  '1': {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: {
      id: 'instructor1',
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
      bio: 'Senior Web Developer with 10+ years of experience',
    },
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
    duration: '6 weeks',
    studentsEnrolled: 1240,
    rating: 4.8,
    reviews: 328,
    price: '$49.99',
    modules: [
      {
        id: 'module1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML markup and document structure',
        lessons: [
          { id: 'lesson1', title: 'Introduction to HTML', type: 'video', duration: '10:25', isCompleted: true },
          { id: 'lesson2', title: 'HTML Document Structure', type: 'video', duration: '15:10', isCompleted: true },
          { id: 'lesson3', title: 'Working with Text Elements', type: 'document', duration: '12:45', isCompleted: false },
          { id: 'lesson4', title: 'HTML Quiz', type: 'quiz', duration: '15:00', isCompleted: false },
        ]
      },
      {
        id: 'module2',
        title: 'CSS Styling Basics',
        description: 'Learn how to style your HTML documents with CSS',
        lessons: [
          { id: 'lesson5', title: 'Introduction to CSS', type: 'video', duration: '12:30', isCompleted: false },
          { id: 'lesson6', title: 'Selectors and Properties', type: 'document', duration: '20:15', isCompleted: false },
          { id: 'lesson7', title: 'Box Model', type: 'video', duration: '14:20', isCompleted: false },
          { id: 'lesson8', title: 'CSS Layout Assignment', type: 'assignment', duration: '45:00', isCompleted: false },
        ]
      },
      {
        id: 'module3',
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your websites with JavaScript',
        lessons: [
          { id: 'lesson9', title: 'Introduction to JavaScript', type: 'video', duration: '18:45', isCompleted: false },
          { id: 'lesson10', title: 'Variables and Data Types', type: 'document', duration: '22:30', isCompleted: false },
          { id: 'lesson11', title: 'Functions and Events', type: 'video', duration: '25:15', isCompleted: false },
          { id: 'lesson12', title: 'DOM Manipulation', type: 'video', duration: '19:50', isCompleted: false },
          { id: 'lesson13', title: 'Final Project', type: 'assignment', duration: '120:00', isCompleted: false },
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Data Science Fundamentals with Python',
    instructor: {
      id: 'instructor2',
      name: 'Michael Chen',
      avatar: '/placeholder.svg',
      bio: 'Data Scientist at Tech Corp with Ph.D in Computer Science',
    },
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1pYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Master the fundamentals of data analysis using Python and popular libraries.',
    duration: '8 weeks',
    studentsEnrolled: 950,
    rating: 4.7,
    reviews: 215,
    price: '$59.99',
    modules: [
      {
        id: 'module1',
        title: 'Introduction to Python',
        description: 'Learn the basics of Python programming language',
        lessons: [
          { id: 'lesson1', title: 'Getting Started with Python', type: 'video', duration: '14:30', isCompleted: false },
          { id: 'lesson2', title: 'Variables and Data Types', type: 'document', duration: '18:20', isCompleted: false },
          { id: 'lesson3', title: 'Control Flow', type: 'video', duration: '20:15', isCompleted: false },
          { id: 'lesson4', title: 'Functions', type: 'video', duration: '16:45', isCompleted: false },
        ]
      },
      {
        id: 'module2',
        title: 'Data Analysis with NumPy and Pandas',
        description: 'Learn how to analyze data using NumPy and Pandas libraries',
        lessons: [
          { id: 'lesson5', title: 'Introduction to NumPy', type: 'video', duration: '22:10', isCompleted: false },
          { id: 'lesson6', title: 'Working with Arrays', type: 'document', duration: '25:30', isCompleted: false },
          { id: 'lesson7', title: 'Introduction to Pandas', type: 'video', duration: '19:45', isCompleted: false },
          { id: 'lesson8', title: 'Data Cleaning', type: 'video', duration: '27:20', isCompleted: false },
          { id: 'lesson9', title: 'Data Analysis Assignment', type: 'assignment', duration: '60:00', isCompleted: false },
        ]
      }
    ]
  }
};

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  if (!courseId || !mockCourseData[courseId as keyof typeof mockCourseData]) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-4">The course you're looking for doesn't exist.</p>
            <Link to="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const course = mockCourseData[courseId as keyof typeof mockCourseData];
  
  // Calculate progress
  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((total, module) => {
    return total + module.lessons.filter(lesson => lesson.isCompleted).length;
  }, 0);
  
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  const handleEnroll = useCallback(() => {
    navigate(`/course/${courseId}?showPayment=true`);
    toast({
      title: "Redirecting to Payment",
      description: "You will be redirected to the payment page.",
    });
  }, [courseId, navigate, toast]);

  const lessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle size={18} />;
      case 'document':
        return <FileText size={18} />;
      case 'quiz':
        return <MessageSquare size={18} />;
      case 'assignment':
        return <FileText size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="relative h-64 md:h-80">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${course.thumbnail})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
          <div className="container mx-auto px-4 relative h-full flex items-center">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="md:text-lg max-w-2xl mb-6">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{course.studentsEnrolled} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Rating: {course.rating}/5</span>
                  <span>({course.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="space-y-6">
                    {isEnrolled ? (
                      <>
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Your Progress</h3>
                            <span className="text-sm">{progressPercentage}% Complete</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        
                        <div className="space-y-4">
                          {course.modules.map((module, moduleIndex) => (
                            <Card key={module.id}>
                              <div className="p-4 border-b font-medium">
                                <div className="flex justify-between items-center">
                                  <h3>Module {moduleIndex + 1}: {module.title}</h3>
                                  <span className="text-sm text-gray-500">
                                    {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length} completed
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                              </div>
                              <CardContent className="p-0">
                                <ul className="divide-y">
                                  {module.lessons.map((lesson) => (
                                    <li key={lesson.id} className="p-4 hover:bg-gray-50">
                                      <Link 
                                        to={`/${lesson.type}/${lesson.id}`} 
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-full ${lesson.isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                                            {lesson.isCompleted ? (
                                              <Check size={16} className="text-green-600" />
                                            ) : (
                                              lessonTypeIcon(lesson.type)
                                            )}
                                          </div>
                                          <div>
                                            <h4 className="font-medium">{lesson.title}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                              <span className="capitalize">{lesson.type}</span>
                                              <span>•</span>
                                              <span>{lesson.duration}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                          {lesson.isCompleted ? 'Review' : 'Start'}
                                        </Button>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        {course.modules.map((module, moduleIndex) => (
                          <Card key={module.id}>
                            <div className="p-4 border-b font-medium">
                              <h3>Module {moduleIndex + 1}: {module.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                            </div>
                            <CardContent className="p-0">
                              <ul className="divide-y">
                                {module.lessons.slice(0, 2).map((lesson) => (
                                  <li key={lesson.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-gray-100">
                                          {lessonTypeIcon(lesson.type)}
                                        </div>
                                        <div>
                                          <h4 className="font-medium">{lesson.title}</h4>
                                          <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="capitalize">{lesson.type}</span>
                                            <span>•</span>
                                            <span>{lesson.duration}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                                {module.lessons.length > 2 && (
                                  <li className="p-4 text-center italic text-gray-500 text-sm">
                                    <div className="flex items-center justify-center gap-2">
                                      <Lock size={14} />
                                      <span>Enroll to unlock {module.lessons.length - 2} more lessons</span>
                                    </div>
                                  </li>
                                )}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">About This Course</h2>
                      <p className="mb-4">{course.description}</p>
                      <p>This comprehensive course will take you from beginner to proficient in {course.title.toLowerCase()}. Through hands-on projects and exercises, you'll gain practical experience that you can apply immediately.</p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {['Master core concepts and principles', 'Build real-world projects from scratch', 'Implement best practices and optimizations', 'Troubleshoot common challenges effectively'].map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check size={18} className="text-green-600 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">Course Structure</h2>
                      <p className="mb-2">This course contains:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <PlayCircle size={18} />
                          <span>{course.modules.reduce((total, module) => 
                            total + module.lessons.filter(l => l.type === 'video').length, 0)} video lessons</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <FileText size={16} />
                            <span>{course.modules.reduce((total, module) => 
                            total + module.lessons.filter(l => l.type === 'document').length, 0)} reading materials</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <MessageSquare size={16} />
                            <span>{course.modules.reduce((total, module) => 
                            total + module.lessons.filter(l => l.type === 'quiz').length, 0)} quizzes</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <FileText size={18} />
                            <span>{course.modules.reduce((total, module) => 
                            total + module.lessons.filter(l => l.type === 'assignment').length, 0)} practical assignments</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Award size={16} />
                            <span>Certificate of completion</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="instructor">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">{course.instructor.name}</h2>
                      <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                      <p>With extensive experience in the field, {course.instructor.name.split(' ')[0]} provides clear, concise instruction that makes complex topics accessible to learners at all levels.</p>
                      <div className="mt-4">
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="text-center md:w-48">
                        <div className="text-5xl font-bold">{course.rating}</div>
                        <div className="flex justify-center my-2">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{course.reviews} reviews</div>
                      </div>
                      <div className="flex-1">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <div className="w-16 text-sm font-medium">{rating} stars</div>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-2 bg-yellow-400 rounded-full" 
                                    style={{ 
                                      width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-10 text-sm text-gray-600">
                                {rating === 5 ? 70 : rating === 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Student Feedback</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Alex Johnson', avatar: '/placeholder.svg', rating: 5, date: '2 months ago', comment: 'Excellent course! The instructor explains complex concepts in an easy-to-understand way. The projects were practical and helped reinforce what I learned.' },
                          { name: 'Maria Garcia', avatar: '/placeholder.svg', rating: 4, date: '3 months ago', comment: 'Very informative and well-structured. I especially enjoyed the hands-on exercises. Would have liked a bit more advanced content towards the end.' },
                          { name: 'Sam Chen', avatar: '/placeholder.svg', rating: 5, date: '1 month ago', comment: 'This course exceeded my expectations. The instructor is knowledgeable and responsive to questions. Highly recommended for beginners!' }
                        ].map((review, i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                  <div className="font-medium">{review.name}</div>
                                  <div className="flex items-center text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <div className="text-sm text-gray-500">{review.date}</div>
                                </div>
                                <p>{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold mb-4">{course.price}</div>
                  
                  {isEnrolled ? (
                    <div className="space-y-4">
                      <Button className="w-full">
                        Continue Learning
                      </Button>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 mb-4" />
                        
                        <div className="flex justify-between text-sm">
                          <span>Last Activity</span>
                          <span>2 days ago</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button className="w-full" onClick={handleEnroll}>
                        Enroll Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        Add to Wishlist
                      </Button>
                      
                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3">This course includes:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <PlayCircle size={16} />
                            <span>{course.modules.reduce((total, module) => 
                              total + module.lessons.filter(l => l.type === 'video').length, 0)} video lessons</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <FileText size={16} />
                            <span>{course.modules.reduce((total, module) => 
                              total + module.lessons.filter(l => l.type === 'document').length, 0)} reading materials</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <MessageSquare size={16} />
                            <span>Access to discussion forums</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Award size={16} />
                            <span>Certificate of completion</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <Clock size={16} />
                            <span>Lifetime access</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetails;
