import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Maximize2, Minimize2, BookOpen, Video, FileText, Clock, 
  CheckCircle, Download, Code, Award, ChevronRight, Menu,
  Bookmark, Share2, Star, ThumbsUp, MessageSquare, BookmarkPlus,
  BookmarkMinus, Heart, HeartHandshake, Brain, Target, Trophy,
  GraduationCap, Lightbulb, Sparkles, Zap, Rocket, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Mock course data
const courseData = {
  id: '1',
  title: 'Machine Learning Essentials',
  instructor: {
    name: 'Dr. VARUN',
    avatar: '/placeholder.svg',
    bio: 'Senior Data Scientist with 10+ years of experience in AI and ML',
    expertise: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow']
  },
  description: 'Understand the core concepts of machine learning algorithms and their applications in real-world scenarios.',
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
          completed: true,
          url: 'https://www.youtube.com/embed/example1'
        },
        {
          id: '2',
          title: 'Types of Machine Learning',
          type: 'video',
          duration: '20:15',
          completed: false,
          url: 'https://www.youtube.com/embed/example2'
        },
        {
          id: '3',
          title: 'Basic Concepts and Terminology',
          type: 'reading',
          duration: '10:00',
          completed: false,
          content: '...'
        }
      ]
    },
    {
      id: '2',
      title: 'Supervised Learning',
      lessons: [
        {
          id: '4',
          title: 'Linear Regression',
          type: 'video',
          duration: '25:45',
          completed: false,
          url: 'https://www.youtube.com/embed/example3'
        },
        {
          id: '5',
          title: 'Logistic Regression',
          type: 'video',
          duration: '22:30',
          completed: false,
          url: 'https://www.youtube.com/embed/example4'
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
      title: 'Python Notebooks',
      type: 'code',
      url: '#'
    }
  ],
  achievements: [
    {
      id: '1',
      title: 'ML Basics Master',
      description: 'Complete all basic ML concepts',
      icon: <Brain className="w-6 h-6" />,
      unlocked: true
    },
    {
      id: '2',
      title: 'Practice Champion',
      description: 'Complete 10 practice exercises',
      icon: <Target className="w-6 h-6" />,
      unlocked: false
    }
  ]
};

const AdvancedCourseLearningPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  // Video controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const toggleBookmark = () => setIsBookmarked(!isBookmarked);

  // Progress tracking
  useEffect(() => {
    const completedLessons = courseData.sections.reduce((acc, section) => 
      acc + section.lessons.filter(lesson => lesson.completed).length, 0);
    const totalLessons = courseData.sections.reduce((acc, section) => 
      acc + section.lessons.length, 0);
    setProgress((completedLessons / totalLessons) * 100);
  }, [currentLesson]);

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
                              <Code className="h-4 w-4" />
                            )}
                          </div>
                          <span className="flex-1">{resource.title}</span>
                          <Download className="h-4 w-4" />
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
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`${currentLesson.url}?autoplay=0&controls=1&modestbranding=1&showinfo=1&rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
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
                    <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                  <Button onClick={handleLessonComplete}>
                    Mark as Complete
                  </Button>
                </div>
                <div className="prose max-w-none">
                  {/* Add lesson content here */}
                </div>
              </div>
            </div>

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

export default AdvancedCourseLearningPage; 