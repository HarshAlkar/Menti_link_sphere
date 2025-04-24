import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  Video, FileText, CheckCircle, ChevronRight, Menu,
  Bookmark, Share2, Star, ThumbsUp, MessageSquare,
  BookmarkPlus, BookmarkMinus, Brain, Target, Trophy,
  GraduationCap, Lightbulb, Sparkles, Zap, Rocket, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Mock course data - this would typically come from an API
const courseData = {
  id: '3',
  title: 'UX/UI Design Principles',
  instructor: {
    name: 'Elena Rodriguez',
    avatar: '/placeholder.svg',
    bio: 'Senior UX Designer with 8+ years of experience in creating intuitive and beautiful digital interfaces',
    expertise: ['UX Design', 'UI Design', 'User Research', 'Prototyping']
  },
  description: 'Learn the principles of creating user-friendly and aesthetically pleasing digital interfaces.',
  category: 'Design',
  level: 'Intermediate',
  duration: '6 weeks',
  rating: 4.9,
  students: 2150,
  price: 89.99,
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
          completed: true,
          url: 'https://www.youtube.com/watch?v=Y40J_DomBu4',
          content: 'In this lesson, we will explore the fundamentals of UX/UI design and its importance in creating successful digital products.'
        },
        {
          id: '2',
          title: 'Design Thinking Process',
          type: 'video',
          duration: '15:45',
          completed: false,
          url: 'https://www.youtube.com/watch?v=YIOvlyvp2r0',
          content: 'Learn about the design thinking process and how it helps in creating user-centered solutions.'
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
          completed: false,
          url: 'https://www.youtube.com/watch?v=pBYuHMJyg_g',
          content: 'Master the art of conducting effective user interviews to gather valuable insights.'
        },
        {
          id: '4',
          title: 'User Personas',
          type: 'video',
          duration: '14:15',
          completed: false,
          url: 'https://www.youtube.com/watch?v=UnAuwhu2C9Q',
          content: 'Learn how to create detailed user personas to guide your design decisions.'
        }
      ]
    }
  ],
  resources: [
    {
      id: '1',
      title: 'Course Slides',
      type: 'pdf',
      url: '#'
    },
    {
      id: '2',
      title: 'Design Templates',
      type: 'file',
      url: '#'
    }
  ],
  achievements: [
    {
      id: '1',
      title: 'Design Basics Master',
      description: 'Complete all basic design concepts',
      icon: <Brain className="w-6 h-6" />,
      unlocked: true
    },
    {
      id: '2',
      title: 'Research Champion',
      description: 'Complete all user research lessons',
      icon: <Target className="w-6 h-6" />,
      unlocked: false
    }
  ]
};

// Add this function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

// Add these interfaces
interface Rating {
  stars: number;
  comment: string;
}

interface SuggestedCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
}

// Add mock suggested courses
const suggestedCourses: SuggestedCourse[] = [
  {
    id: '4',
    title: 'Advanced UI Design',
    instructor: 'Elena Rodriguez',
    thumbnail: '/placeholder.svg',
    rating: 4.8
  },
  {
    id: '5',
    title: 'User Research Masterclass',
    instructor: 'David Chen',
    thumbnail: '/placeholder.svg',
    rating: 4.9
  }
];

const CourseLearningPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const showPayment = searchParams.get('showPayment') === 'true';
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  const [currentSection, setCurrentSection] = useState(courseData.sections[0]);
  const [currentLesson, setCurrentLesson] = useState(courseData.sections[0].lessons[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rating, setRating] = useState<Rating>({ stars: 0, comment: '' });
  const [showNextCourses, setShowNextCourses] = useState(false);

  // Video controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  // Progress tracking
  useEffect(() => {
    const completedLessons = courseData.sections.reduce((acc, section) => 
      acc + section.lessons.filter(lesson => lesson.completed).length, 0);
    const totalLessons = courseData.sections.reduce((acc, section) => 
      acc + section.lessons.length, 0);
    setProgress((completedLessons / totalLessons) * 100);
  }, [currentLesson]);

  // Add this effect to handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle lesson completion
  const handleLessonComplete = () => {
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => 
        lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
      )
    }));
    toast({
      title: "Lesson Completed!",
      description: "Great job! You've completed this lesson.",
    });
  };

  // Add note
  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote('');
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully.",
      });
    }
  };

  // Add this function to handle video completion
  const handleVideoCompletion = () => {
    const updatedSections = courseData.sections.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson => 
        lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
      )
    }));

    // Check if all lessons are completed
    const allLessonsCompleted = updatedSections.every(section =>
      section.lessons.every(lesson => lesson.completed)
    );

    if (allLessonsCompleted) {
      setIsCourseCompleted(true);
      toast({
        title: "Course Completed!",
        description: "Congratulations! You've completed the entire course.",
      });
    } else {
      toast({
        title: "Lesson Completed!",
        description: "Great job! You've completed this lesson.",
      });
    }
  };

  // Add this function to handle certificate generation
  const handleGenerateCertificate = () => {
    setShowCertificate(true);
    toast({
      title: "Certificate Generated!",
      description: "Your course completion certificate is ready.",
    });
  };

  // Add this function to track video progress
  const handleVideoProgress = (event: any) => {
    const video = event.target;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);

    // Mark as completed if watched more than 90%
    if (progress >= 90 && !isVideoCompleted) {
      setIsVideoCompleted(true);
      handleVideoCompletion();
    }
  };

  // Add this effect for celebration animation
  useEffect(() => {
    if (isCourseCompleted) {
      setShowCelebration(true);
      setTimeout(() => {
        setRating({ stars: 0, comment: '' });
      }, 2000);
    }
  }, [isCourseCompleted]);

  // Add this function to handle rating submission
  const handleRatingSubmit = () => {
    toast({
      title: "Thank you for your feedback!",
      description: "Your rating has been submitted successfully.",
    });
    setShowNextCourses(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowSidebar(!showSidebar)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">{courseData.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Progress value={progress} className="w-32" />
            <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            <Button variant="outline" onClick={toggleBookmark}>
              {isBookmarked ? <BookmarkMinus className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
            <Button variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 bg-white rounded-lg shadow-sm p-4"
              >
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="mt-4">
                    {courseData.sections.map((section) => (
                      <div key={section.id} className="mb-4">
                        <h3 className="font-semibold mb-2">{section.title}</h3>
                        <div className="space-y-2">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center p-2 rounded-lg cursor-pointer ${
                                lesson.id === currentLesson.id
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => setCurrentLesson(lesson)}
                            >
                              <div className="w-8 h-8 flex items-center justify-center">
                                {lesson.type === 'video' ? (
                                  <Video className="h-4 w-4" />
                                ) : (
                                  <FileText className="h-4 w-4" />
                                )}
                              </div>
                              <span className="flex-1">{lesson.title}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                                {lesson.completed && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="resources" className="mt-4">
                    <div className="space-y-2">
                      {courseData.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            {resource.type === 'pdf' ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <span className="flex-1">{resource.title}</span>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="notes" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 p-2 border rounded-lg"
                        />
                        <Button onClick={addNote}>Add</Button>
                      </div>
                      <div className="space-y-2">
                        {notes.map((note, index) => (
                          <div
                            key={index}
                            className="p-2 bg-gray-50 rounded-lg"
                          >
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Video Player */}
              <div 
                ref={videoContainerRef}
                className="relative aspect-video bg-black"
              >
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson.url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onEnded={handleVideoCompletion}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="icon" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                      </Button>
                      <div className="text-white text-sm">
                        {currentLesson.duration}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleFullscreen}
                      className="text-white hover:text-white hover:bg-black/20"
                    >
                      {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                    </Button>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <Progress value={videoProgress} className="h-1" />
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                  <div className="flex items-center space-x-4">
                    {currentLesson.completed && (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>Completed</span>
                      </div>
                    )}
                    <Button onClick={handleVideoCompletion}>
                      Mark as Complete
                    </Button>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p>{currentLesson.content}</p>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            
            {showPayment && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                  <p>This section will integrate with a payment gateway to process payments for the course.</p>
                  {/* Placeholder for Payment Integration */}
                  <Button>Pay Now</Button>
                </div>
              </div>
            )}

            {/* Celebration Animation */}
            <AnimatePresence>
              {showCelebration && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-lg p-8 text-center max-w-md"
                  >
                    <div className="flex justify-center mb-4">
                      <Sparkles className="h-12 w-12 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                    <p className="text-gray-600 mb-4">
                      You've completed the course successfully!
                    </p>
                    <Button onClick={() => setShowCelebration(false)}>
                      Continue
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rating Section */}
            <AnimatePresence>
              {showRating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                  <motion.div
                    className="bg-white rounded-lg p-8 max-w-md w-full"
                  >
                    <h2 className="text-2xl font-bold mb-4">Rate This Course</h2>
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="icon"
                          onClick={() => setRating({ stars: star, comment: '' })}
                          className={rating.stars >= star ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          <Star className="h-8 w-8" />
                        </Button>
                      ))}
                    </div>
                    <textarea
                      value={rating.comment}
                      onChange={(e) => setRating({ ...rating, comment: e.target.value })}
                      placeholder="Share your thoughts about this course..."
                      className="w-full p-2 border rounded-lg mb-4"
                      rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setRating({ stars: 0, comment: '' })}>
                        Skip
                      </Button>
                      <Button onClick={handleRatingSubmit}>
                        Submit Rating
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Courses Section */}
            {showNextCourses && (
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Continue Learning</h3>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/courses')}
                        className="flex items-center space-x-2"
                      >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        <span>Back to Courses</span>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestedCourses.map((course) => (
                        <Card key={course.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="font-semibold">{course.title}</h4>
                                <p className="text-sm text-gray-600">{course.instructor}</p>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm ml-1">{course.rating}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => navigate(`/courses/${course.id}`)}
                                >
                                  View Course
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Certificate Section */}
            {isCourseCompleted && (
              <div className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">Course Completion Certificate</h3>
                        <p className="text-gray-600 mt-1">
                          Congratulations! You've completed all lessons in this course.
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button onClick={handleGenerateCertificate}>
                          Generate Certificate
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/courses')}
                          className="flex items-center space-x-2"
                        >
                          <ChevronRight className="h-4 w-4 rotate-180" />
                          <span>Back to Courses</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Certificate Preview */}
            {showCertificate && (
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="mb-4">
                        <GraduationCap className="h-16 w-16 mx-auto text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Certificate of Completion</h3>
                      <p className="text-gray-600 mb-4">
                        This is to certify that
                      </p>
                      <h4 className="text-xl font-semibold mb-4">{user?.username || 'Student'}</h4>
                      <p className="text-gray-600 mb-4">
                        has successfully completed the course
                      </p>
                      <h4 className="text-xl font-semibold mb-4">{courseData.title}</h4>
                      <div className="flex justify-center space-x-4 mt-6">
                        <Button variant="outline" onClick={() => window.print()}>
                          Print Certificate
                        </Button>
                        <Button variant="outline">
                          Download PDF
                        </Button>
                        <Button variant="outline">
                          Share Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Achievements */}
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAchievements(!showAchievements)}
              >
                <Trophy className="h-5 w-5 mr-2" />
                View Achievements
              </Button>
              <AnimatePresence>
                {showAchievements && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {courseData.achievements.map((achievement) => (
                      <Card
                        key={achievement.id}
                        className={`${
                          achievement.unlocked ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-blue-50">
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
