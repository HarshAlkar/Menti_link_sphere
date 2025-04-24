import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MessageSquare, SendHorizontal, X, Minimize2, Maximize2, BookOpen, Calendar, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Session {
  id: string;
  courseId: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Analytics {
  totalTimeSpent: number;
  averageCompletionTime: number;
  quizScores: number[];
  engagementScore: number;
  learningPath: string[];
}

interface AIResponse {
  text: string;
  type: 'info' | 'question' | 'suggestion' | 'error';
  context?: {
    courseId?: string;
    lessonId?: string;
    sectionId?: string;
  };
}

interface ProjectInfo {
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  architecture: {
    frontend: string[];
    backend: string[];
    database: string[];
  };
  components: {
    name: string;
    description: string;
    features: string[];
  }[];
}

// Add type definitions for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

// Mock data - in a real app, this would come from your backend
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    instructor: 'HARSH',
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    category: 'Web Development',
    level: 'Beginner',
    duration: '8 weeks',
    rating: 4.8,
    students: 1200,
    sections: [
      {
        id: '1',
        title: 'Introduction to Web Development',
        lessons: [
          { id: '1', title: 'What is Web Development?', duration: '15:00', completed: false },
          { id: '2', title: 'Setting Up Your Environment', duration: '20:00', completed: false }
        ]
      }
    ]
  },
  // Add more courses as needed
];

const mockSessions: Session[] = [
  {
    id: '1',
    courseId: '1',
    date: '2024-03-20',
    time: '14:00',
    duration: '1 hour',
    status: 'upcoming'
  }
];

// Add mock analytics data
const mockAnalytics: Record<string, Analytics> = {
  '1': {
    totalTimeSpent: 1200, // in minutes
    averageCompletionTime: 45, // in minutes
    quizScores: [85, 90, 88, 92],
    engagementScore: 0.85,
    learningPath: ['HTML Basics', 'CSS Fundamentals', 'JavaScript Introduction']
  }
};

const projectInfo: ProjectInfo = {
  name: "MentorLink Sphere",
  description: "A comprehensive e-learning platform that connects mentors and students through interactive courses, live sessions, and personalized learning experiences. The platform leverages AI to provide personalized learning paths, real-time assistance, and intelligent course recommendations.",
  features: [
    "Interactive Course Learning with AI-powered content delivery",
    "Live Mentoring Sessions with real-time collaboration tools",
    "Advanced Progress Tracking with AI analytics",
    "AI-Powered Chatbot for instant assistance",
    "Smart Course Analytics and Performance Insights",
    "Automated Certificate Generation",
    "Intelligent Resource Management",
    "Personalized User Profiles and Learning Paths",
    "AI-driven Content Recommendations",
    "Real-time Progress Monitoring",
    "Automated Assessment and Feedback",
    "Smart Scheduling System"
  ],
  technologies: [
    "React with TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "WebRTC",
    "OpenAI API",
    "",
    "WebSocket",
    "",
    "",
    ""
  ],
  architecture: {
    frontend: [
      "React with TypeScript for type-safe development",
      "Tailwind CSS for responsive design",
      "Context API for state management",
      "React Router for navigation",
      "WebRTC for video sessions",
      "TensorFlow.js for client-side AI",
      "WebSocket for real-time communication"
    ],
    backend: [
      "Node.js with Express for API development",
      "MongoDB for flexible data storage",
      "JWT for secure authentication",
      "WebSocket for real-time features",
      "OpenAI API integration for AI capabilities",
      "AWS S3 for file storage",
      "Redis for caching"
    ],
    database: [
      "MongoDB for flexible data storage",
      "User profiles and authentication",
      "Course content and progress tracking",
      "Session scheduling and management",
      "Analytics and reporting",
      "AI model training data",
      "Resource management"
    ]
  },
  components: [
    {
      name: "Course Learning Page",
      description: "Interactive course content delivery with AI-powered video lessons, progress tracking, and completion certificates",
      features: [
        "AI-powered video player with progress tracking",
        "Automatic lesson completion detection",
        "Smart certificate generation",
        "Advanced course analytics",
        "Resource access with AI recommendations",
        "Interactive quizzes with AI feedback",
        "Personalized learning paths"
      ]
    },
    {
      name: "ChatBot",
      description: "Advanced AI-powered assistant for course guidance and support using natural language processing",
      features: [
        "Natural language processing with OpenAI",
        "Context-aware responses",
        "Voice input/output capabilities",
        "Course-specific assistance",
        "Progress tracking and recommendations",
        "Multi-language support",
        "Learning style adaptation"
      ]
    },
    {
      name: "Mentoring Sessions",
      description: "Live video sessions between mentors and students with AI-powered features",
      features: [
        "WebRTC video conferencing",
        "AI-powered session scheduling",
        "Smart recording capabilities",
        "Interactive whiteboard with AI assistance",
        "Resource sharing with recommendations",
        "Real-time translation",
        "Session analytics"
      ]
    },
    {
      name: "Analytics Dashboard",
      description: "Comprehensive analytics platform with AI-driven insights",
      features: [
        "Real-time progress tracking",
        "AI-powered performance predictions",
        "Learning pattern analysis",
        "Personalized recommendations",
        "Engagement metrics",
        "Skill gap analysis",
        "Automated reporting"
      ]
    }
  ]
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const [aiContext, setAiContext] = useState<any>({});

  useEffect(() => {
    scrollToBottom();

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;

    // Update context when course or lesson changes
    const courseId = location.pathname.split('/')[2];
    const course = mockCourses.find(c => c.id === courseId);
    
    if (course) {
      setAiContext({
        course,
        progress: mockAnalytics[courseId],
        user: user
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [location.pathname, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const speakResponse = (text: string) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthesisRef.current.speak(utterance);
    }
  };

  const generateAIResponse = (userMessage: string, context: any): AIResponse => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Project-specific queries
    if (lowerMessage.includes('project') || lowerMessage.includes('mentorlink')) {
      return {
        text: `Here's comprehensive information about ${projectInfo.name}:

        Description: ${projectInfo.description}
        
        Key Features:
        ${projectInfo.features.map(f => `- ${f}`).join('\n')}
        
        Technologies Used:
        ${projectInfo.technologies.map(t => `- ${t}`).join('\n')}
        
        Would you like to know more about any specific aspect of the project? I can provide details about:
        - Architecture and tech stack
        - Specific components and features
        - Development process
        - AI capabilities
        - Deployment and infrastructure`,
        type: 'info'
      };
    }

    // Architecture queries
    if (lowerMessage.includes('architecture') || lowerMessage.includes('tech stack')) {
      return {
        text: `The project architecture consists of:

        Frontend Architecture:
        ${projectInfo.architecture.frontend.map(f => `- ${f}`).join('\n')}
        
        Backend Architecture:
        ${projectInfo.architecture.backend.map(b => `- ${b}`).join('\n')}
        
        Database Architecture:
        ${projectInfo.architecture.database.map(d => `- ${d}`).join('\n')}
        
        The system is designed with scalability and performance in mind, leveraging modern technologies and AI capabilities. Would you like more details about any specific part of the architecture?`,
        type: 'info'
      };
    }

    // AI capabilities queries
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
      return {
        text: `The project leverages AI in several powerful ways:

        1. Smart Learning Assistant:
        - Natural language processing for understanding student queries
        - Context-aware responses and recommendations
        - Voice interaction capabilities
        
        2. Personalized Learning:
        - AI-driven content recommendations
        - Adaptive learning paths
        - Performance prediction and intervention
        
        3. Analytics and Insights:
        - Learning pattern analysis
        - Progress prediction
        - Skill gap identification
        
        4. Session Management:
        - Smart scheduling
        - Real-time translation
        - Automated session summaries
        
        Would you like to know more about any specific AI feature?`,
        type: 'info'
      };
    }

    // Development queries
    if (lowerMessage.includes('develop') || lowerMessage.includes('build')) {
      return {
        text: `To develop or contribute to ${projectInfo.name}:

        1. Setup:
        - Clone the repository
        - Install dependencies (npm install)
        - Set up environment variables
        - Configure AI service credentials
        
        2. Development:
        - Frontend: src/components and src/pages
        - Backend: server directory
        - AI Services: src/services/ai
        - Database: MongoDB setup
        
        3. Testing:
        - Run tests (npm test)
        - Check linting (npm run lint)
        - AI model testing
        
        4. Deployment:
        - Docker containerization
        - AWS deployment
        - CI/CD pipeline
        
        Would you like more specific instructions for any part of the development process?`,
        type: 'info'
      };
    }

    // Component-specific queries
    if (lowerMessage.includes('component') || lowerMessage.includes('feature')) {
      const component = projectInfo.components.find(c => 
        lowerMessage.includes(c.name.toLowerCase())
      );
      
      if (component) {
        return {
          text: `Here's detailed information about the ${component.name}:

          Description: ${component.description}
          
          Features:
          ${component.features.map(f => `- ${f}`).join('\n')}
          
          Technical Implementation:
          - Built with React and TypeScript
          - Integrated with AI services
          - Real-time capabilities
          - Scalable architecture
          
          Would you like to know more about any specific feature or implementation detail?`,
          type: 'info'
        };
      }
    }

    // Contextual understanding
    const currentCourse = context.course;
    const currentLesson = context.lesson;
    const userProgress = context.progress;
    
    // Natural language patterns
    const greetingPatterns = ['hi', 'hello', 'hey', 'good morning', 'good afternoon'];
    const questionPatterns = ['what', 'how', 'why', 'when', 'where', 'can you', 'could you'];
    const gratitudePatterns = ['thanks', 'thank you', 'appreciate'];
    
    // Check for greetings
    if (greetingPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return {
        text: `Hello! I'm your AI learning assistant. I can help you with:
        - Understanding course concepts
        - Explaining difficult topics
        - Providing study tips
        - Answering your questions
        
        What would you like to know?`,
        type: 'info'
      };
    }
    
    // Check for gratitude
    if (gratitudePatterns.some(pattern => lowerMessage.includes(pattern))) {
      return {
        text: "You're welcome! Is there anything else I can help you with?",
        type: 'info'
      };
    }
    
    // Course-specific understanding
    if (currentCourse) {
      // Questions about course content
      if (lowerMessage.includes('explain') || lowerMessage.includes('understand')) {
        const topic = lowerMessage.split('explain')[1] || lowerMessage.split('understand')[1];
        return {
          text: `Let me explain ${topic.trim()} in ${currentCourse.title}:
          
          ${generateExplanation(topic, currentCourse)}
          
          Would you like me to provide an example or go into more detail?`,
          type: 'info',
          context: { courseId: currentCourse.id }
        };
      }
      
      // Progress-related questions
      if (lowerMessage.includes('how am i doing') || lowerMessage.includes('my progress')) {
        return {
          text: `Based on your progress in ${currentCourse.title}:
          - You've completed ${userProgress?.completedLessons || 0} out of ${userProgress?.totalLessons || 0} lessons
          - Your average quiz score is ${userProgress?.averageScore || 0}%
          - You're ${userProgress?.completionPercentage || 0}% through the course
          
          ${generateProgressFeedback(userProgress)}`,
          type: 'info',
          context: { courseId: currentCourse.id }
        };
      }
    }
    
    // Learning assistance
    if (lowerMessage.includes('help me learn') || lowerMessage.includes('study tips')) {
      return {
        text: `Here are some effective learning strategies:
        1. Active Recall: Test yourself on the material
        2. Spaced Repetition: Review content at increasing intervals
        3. Interleaving: Mix different topics while studying
        4. Elaboration: Explain concepts in your own words
        5. Concrete Examples: Connect abstract ideas to real-world scenarios
        
        Would you like me to explain any of these techniques in detail?`,
        type: 'suggestion'
      };
    }
    
    // Default AI response
    return {
      text: "I can help you with information about the project, its architecture, components, and development. What specific aspect would you like to know more about?",
      type: 'question'
    };
  };

  const generateExplanation = (topic: string, course: Course): string => {
    // This would be replaced with actual AI-generated content in production
    return `In ${course.title}, ${topic.trim()} is a fundamental concept that helps you understand how things work together. It's important because it forms the basis for more advanced topics you'll learn later in the course.`;
  };

  const generateProgressFeedback = (progress: any): string => {
    if (!progress) return "Keep up the good work!";
    
    if (progress.completionPercentage >= 80) {
      return "You're making excellent progress! Consider challenging yourself with some advanced topics.";
    } else if (progress.completionPercentage >= 50) {
      return "You're doing well! Try to maintain this pace and don't hesitate to ask questions.";
    } else {
      return "You're on the right track! Remember to take breaks and review previous lessons regularly.";
    }
  };

  const getBotResponse = (userMessage: string): string => {
    // Get AI response
    const aiResponse = generateAIResponse(userMessage, aiContext);
    
    // Combine AI response with structured data
    const structuredResponse = getStructuredResponse(userMessage);
    
    return `${aiResponse.text}\n\n${structuredResponse}`;
  };

  const handleSendMessage = (message?: string) => {
    const msg = message || inputValue;
    if (!msg.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: msg,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Get bot response after a short delay
    setTimeout(() => {
      const response = getBotResponse(msg);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      speakResponse(response);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getStructuredResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Course-related queries
    if (lowerMessage.includes('course') || lowerMessage.includes('class')) {
      const courseId = location.pathname.split('/')[2];
      const course = mockCourses.find(c => c.id === courseId);
      
      if (course) {
        return `Course Details:
        - Instructor: ${course.instructor}
        - Category: ${course.category}
        - Level: ${course.level}
        - Duration: ${course.duration}
        - Rating: ${course.rating}/5
        - Students: ${course.students}
        
        The course has ${course.sections.length} sections.`;
      }
      return "Course details not found.";
    }

    // Session-related queries
    if (lowerMessage.includes('session') || lowerMessage.includes('schedule')) {
      const userSessions = mockSessions.filter(s => s.status === 'upcoming');
      if (userSessions.length > 0) {
        return `Upcoming Sessions:
        ${userSessions.map(s => `- ${s.date} at ${s.time} (${s.duration})`).join('\n')}`;
      }
      return "No upcoming sessions found.";
    }

    // Profile-related queries
    if (lowerMessage.includes('profile') || lowerMessage.includes('my')) {
      if (user) {
        return `Profile Information:
        - Username: ${user.username}
        - Email: ${user.email}
        - Role: ${user.role}
        
        Enrolled in ${mockCourses.length} courses.`;
      }
      return "Profile information not available.";
    }

    // Analytics queries
    if (lowerMessage.includes('analytics') || lowerMessage.includes('stats')) {
      const courseId = location.pathname.split('/')[2];
      const analytics = mockAnalytics[courseId];
      const course = mockCourses.find(c => c.id === courseId);
      
      if (analytics && course) {
        return `Course Analytics:
        - Total Time Spent: ${Math.floor(analytics.totalTimeSpent / 60)} hours
        - Average Completion Time: ${analytics.averageCompletionTime} minutes
        - Quiz Performance: ${analytics.quizScores.join(', ')}%
        - Engagement Score: ${(analytics.engagementScore * 100).toFixed(1)}%
        - Learning Path: ${analytics.learningPath.join(' → ')}`;
      }
      return "Analytics data not available.";
    }

    return "";
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={toggleChat}
          className="rounded-full h-12 w-12 shadow-lg"
          variant="default"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className={`w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
          <CardHeader className="p-3 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Course Assistant</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {!isMinimized && (
            <>
              <CardContent className="p-4 h-[calc(100%-120px)] overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="flex w-full space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleListening}
                    className={isListening ? 'bg-red-100' : ''}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={() => handleSendMessage()}>
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default ChatBot; 