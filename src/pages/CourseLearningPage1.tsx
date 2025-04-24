import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronRight, BookOpen, Video, FileText, Clock, CheckCircle, Play, Download, Code, Award } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CourseData {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  progress: number;
  duration: string;
  sections: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      type: string;
      completed: boolean;
      videoId?: string;
      controls?: boolean;
    }[];
  }[];
  resources: {
    title: string;
    type: string;
    url: string;
  }[];
}

const CourseLearningPage1 = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Page</title>
</head>
<body>
  <h1>My First HTML Page</h1>
  <p>Hello, my name is [Your Name].</p>
  <ul>
    <li>Hobby 1</li>
    <li>Hobby 2</li>
    <li>Hobby 3</li>
  </ul>
  <a href="https://example.com">My Favorite Website</a>
  <img src="https://via.placeholder.com/150" alt="Placeholder Image">
</body>
</html>`);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const navigate = useNavigate();
  
  // Mock data for a single course's content
  const courseData: CourseData = {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/placeholder.svg',
    },
    progress: 35,
    duration: '8 weeks',
    sections: [
      {
        id: 's1',
        title: 'Getting Started with HTML',
        lessons: [
          {
            id: 'l1',
            title: 'Introduction to HTML',
            duration: '12 min',
            type: 'video',
            completed: true,
            videoId: 'i94zoNYSFik', // YouTube video ID
            controls: true
          },
          {
            id: 'l2',
            title: 'HTML Document Structure',
            duration: '15 min',
            type: 'video',
            completed: true,
            videoId: 'jfwb-VPO0S4', // YouTube video ID
            controls: true
          },
          {
            id: 'l3',
            title: 'Elements & Attributes',
            duration: '18 min',
            type: 'video',
            completed: false,
            videoId: 'i2aVYjYGpzU', // YouTube video ID
            controls: true
          },
          {
            id: 'l4',
            title: 'HTML Exercise',
            type: 'exercise',
            duration: '20 min',
            completed: false,
          }
        ]
      },
      {
        id: 's2',
        title: 'CSS Fundamentals',
        lessons: [
          {
            id: 'l5',
            title: 'Introduction to CSS',
            duration: '14 min',
            type: 'video',
            completed: false,
            videoId: 'KRXsAGEYrwo', // YouTube video ID
            controls: true
          },
          {
            id: 'l6',
            title: 'Selectors & Properties',
            duration: '22 min',
            type: 'video',
            completed: false,
            videoId: 'UABNvoPWg2M', // YouTube video ID
            controls: true
          },
          {
            id: 'l7',
            title: 'CSS Box Model',
            duration: '16 min',
            type: 'video',
            completed: false,
            videoId: 'Xrxd6cEajhM', // YouTube video ID
            controls: true
          },
          {
            id: 'l8',
            title: 'Reading: CSS Best Practices',
            type: 'reading',
            duration: '10 min',
            completed: false,
          }
        ]
      },
      {
        id: 's3',
        title: 'JavaScript Basics',
        lessons: [
          {
            id: 'l9',
            title: 'Introduction to JavaScript',
            duration: '18 min',
            type: 'video',
            completed: false,
            videoId: 'B7wHpNUUT4Y', // YouTube video ID
            controls: true
          },
          {
            id: 'l10',
            title: 'Variables & Data Types',
            duration: '15 min',
            type: 'video',
            completed: false,
            videoId: 'u3v2H5mwixY', // YouTube video ID
            controls: true
          },
          {
            id: 'l11',
            title: 'JavaScript Quiz',
            type: 'quiz',
            duration: '15 min',
            completed: false,
          }
        ]
      }
    ],
    resources: [
      { 
        title: 'HTML & CSS Reference Guide', 
        type: 'pdf',
        url: '/resources/html-css-guide.pdf'
      },
      { 
        title: 'JavaScript Basics', 
        type: 'pdf',
        url: '/resources/javascript-basics.pdf'
      },
      { 
        title: 'Course Slides', 
        type: 'slides',
        url: '/resources/course-slides.pdf'
      },
      { 
        title: 'Starter Code', 
        type: 'code',
        url: '/resources/starter-code.zip'
      }
    ]
  };

  const currentSection = courseData.sections[activeSection];
  const currentLesson = currentSection.lessons[activeLesson];
  
  // Calculate total and completed lessons
  useEffect(() => {
    let total = 0;
    let completed = 0;
    
    courseData.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        total++;
        if (lesson.completed) {
          completed++;
        }
      });
    });
    
    setTotalLessons(total);
    setCompletedLessons(completed);
  }, [courseData]);

  // Function to get icon based on lesson type
  const getLessonIcon = (type) => {
    switch(type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'exercise': return <BookOpen className="w-4 h-4" />;
      default: return <Video className="w-4 h-4" />;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const runCode = () => {
    const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
    if (previewFrame) {
      const previewDocument = previewFrame.contentDocument;
      if (previewDocument) {
        previewDocument.open();
        previewDocument.write(htmlCode);
        previewDocument.close();
      }
    }
  };

  const resetCode = () => {
    setHtmlCode(`<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Page</title>
</head>
<body>
  <h1>My First HTML Page</h1>
  <p>Hello, my name is [Your Name].</p>
  <ul>
    <li>Hobby 1</li>
    <li>Hobby 2</li>
    <li>Hobby 3</li>
  </ul>
  <a href="https://example.com">My Favorite Website</a>
  <img src="https://via.placeholder.com/150" alt="Placeholder Image">
</body>
</html>`);
  };

  const handleQuizSubmit = () => {
    const correctAnswers = {
      q1: 'c', // Character is not a JavaScript data type
      q2: 'b', // typeof [] returns 'object'
    };

    let score = 0;
    Object.keys(quizAnswers).forEach((question) => {
      if (quizAnswers[question] === correctAnswers[question as keyof typeof correctAnswers]) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
  };

  // Handle lesson completion
  const handleLessonComplete = (sectionIndex: number, lessonIndex: number) => {
    const updatedCourseData = { ...courseData };
    updatedCourseData.sections[sectionIndex].lessons[lessonIndex].completed = true;
    
    // Update completed lessons count
    setCompletedLessons(prev => prev + 1);
    
    // Check if all lessons are completed
    const allCompleted = updatedCourseData.sections.every(section => 
      section.lessons.every(lesson => lesson.completed)
    );
    
    if (allCompleted) {
      setCourseCompleted(true);
      setShowCertificate(true);
    }
  };

  const handleNextLesson = () => {
    handleLessonComplete(activeSection, activeLesson);
    if (activeLesson < currentSection.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    } else if (activeSection < courseData.sections.length - 1) {
      setActiveSection(activeSection + 1);
      setActiveLesson(0);
    } else {
      setShowCertificate(true);
    }
  };

  // Calculate course progress
  useEffect(() => {
    const totalLessons = courseData.sections.reduce((total, section) => total + section.lessons.length, 0);
    const completedLessons = courseData.sections.reduce((total, section) => 
      total + section.lessons.filter(lesson => lesson.completed).length, 0
    );
    setCourseProgress(Math.round((completedLessons / totalLessons) * 100));
  }, [courseData]);

  const generateCertificatePDF = () => {
    const doc = new jsPDF();
    
    // Add certificate border
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 10, 190, 277);
    
    // Add logo
    doc.addImage('/logo.png', 'PNG', 80, 20, 50, 20);
    
    // Add title
    doc.setFontSize(24);
    doc.text('Certificate of Completion', 105, 60, { align: 'center' });
    
    // Add course details
    doc.setFontSize(16);
    doc.text(`Course: ${courseData.title}`, 105, 80, { align: 'center' });
    doc.text(`Student: ${user?.username || 'Student'}`, 105, 90, { align: 'center' });
    doc.text(`Instructor: ${courseData.instructor.name}`, 105, 100, { align: 'center' });
    
    // Add completion details
    doc.setFontSize(14);
    doc.text(`Completion Date: ${new Date().toLocaleDateString()}`, 105, 120, { align: 'center' });
    doc.text(`Course Duration: ${courseData.duration}`, 105, 130, { align: 'center' });
    doc.text(`Final Score: ${finalScore}%`, 105, 140, { align: 'center' });
    doc.text(`Course Progress: ${courseProgress}%`, 105, 150, { align: 'center' });
    
    // Add course modules table
    autoTable(doc, {
      startY: 160,
      head: [['Module', 'Status', 'Score']],
      body: courseData.sections.map(section => [
        section.title,
        section.lessons.every(lesson => lesson.completed) ? 'Completed' : 'In Progress',
        '100%'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });
    
    // Add signature lines
    doc.setFontSize(12);
    doc.text('Instructor Signature', 50, 250);
    doc.text('Date', 150, 250);
    
    // Add certificate ID
    doc.setFontSize(10);
    doc.text(`Certificate ID: ${courseData.id}-${Date.now()}`, 105, 270, { align: 'center' });
    
    // Save the PDF
    doc.save(`certificate-${courseData.id}-${user?.username || 'student'}.pdf`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col ${sidebarOpen ? 'w-80' : 'w-0 md:w-16'} transition-all duration-300 overflow-hidden`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="font-semibold">Course Content</h2>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {completedLessons}/{totalLessons} completed
                </span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-auto flex-grow">
          {courseData.sections.map((section, sectionIndex) => (
            <div key={section.id} className="border-b border-gray-200">
              <div 
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${activeSection === sectionIndex ? 'bg-blue-50' : ''}`}
                onClick={() => setActiveSection(sectionIndex)}
              >
                {sidebarOpen && (
                  <>
                    <div>
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-xs text-gray-500">
                        {section.lessons.filter(lesson => lesson.completed).length}/{section.lessons.length} completed
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </>
                )}
                {!sidebarOpen && <span className="mx-auto">{sectionIndex + 1}</span>}
              </div>
              
              {sidebarOpen && activeSection === sectionIndex && (
                <div className="bg-gray-50">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div 
                      key={lesson.id}
                      className={`p-3 pl-8 border-l-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                        activeSection === sectionIndex && activeLesson === lessonIndex 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-transparent'
                      } ${lesson.completed ? 'text-gray-500' : ''}`}
                      onClick={() => {
                        setActiveSection(sectionIndex);
                        setActiveLesson(lessonIndex);
                      }}
                    >
                      <div className="mr-2 text-gray-500">
                        {lesson.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          getLessonIcon(lesson.type)
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm">{lesson.title}</h4>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {lesson.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Resources</h3>
            <div className="space-y-2">
              {courseData.resources.map((resource, index) => (
                <a 
                  key={index} 
                  href={resource.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {resource.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-grow overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="font-semibold text-xl">{courseData.title}</h1>
            <p className="text-sm text-gray-600">Instructor: {courseData.instructor.name}</p>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <p className="text-xs text-gray-500 mb-1">Course Progress</p>
              <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${courseData.progress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm font-medium">{completedLessons}/{totalLessons} completed</p>
          </div>
        </div>
        
        {/* Lesson Content */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">{currentLesson.title}</h2>
            <p className="text-gray-600">Section: {currentSection.title}</p>
          </div>
          
          {/* Video Player */}
          {currentLesson.type === 'video' && (
            <div className="relative bg-black rounded-lg overflow-hidden mb-6">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentLesson.videoId}?autoplay=0&rel=0&controls=1&modestbranding=1&showinfo=1&enablejsapi=1&widget_referrer=${window.location.href}`}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
              {currentLesson.duration && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-white text-sm">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" /> {currentLesson.duration}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Reading Content */}
          {currentLesson.type === 'reading' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="prose max-w-none">
                <h3>CSS Best Practices</h3>
                <p>This reading material covers the best practices for writing clean, maintainable CSS code.</p>
                <h4>Key Topics:</h4>
                <ul>
                  <li>Organization and structure</li>
                  <li>Naming conventions</li>
                  <li>Code optimization techniques</li>
                  <li>Browser compatibility considerations</li>
                </ul>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in tortor nec metus commodo lacinia. Sed auctor tristique eros, at venenatis urna finibus at. Phasellus eget ullamcorper nibh, ac laoreet eros.</p>
              </div>
            </div>
          )}
          
          {/* Exercise Content */}
          {currentLesson.type === 'exercise' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">HTML Exercise</h3>
              <p className="mb-4">Create a simple HTML page with the following elements:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>A header with the title "My First HTML Page"</li>
                <li>A paragraph introducing yourself</li>
                <li>An unordered list of your three favorite hobbies</li>
                <li>A link to your favorite website</li>
                <li>An image (you can use any placeholder image)</li>
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Your Code:</h4>
                  <div className="relative">
                    <textarea
                      value={htmlCode}
                      onChange={(e) => setHtmlCode(e.target.value)}
                      className="w-full h-64 font-mono text-sm p-4 bg-gray-100 rounded-md border border-gray-300 resize-none"
                      spellCheck="false"
                    />
                    <button
                      onClick={runCode}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                    >
                      Run Code
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Preview:</h4>
                  <iframe
                    id="preview-frame"
                    className="w-full h-64 border border-gray-300 rounded-md bg-white"
                    title="HTML Preview"
                  ></iframe>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button 
                  onClick={runCode}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Run Code
                </button>
                <button 
                  onClick={resetCode}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => {
                    const updatedCourseData = {...courseData};
                    updatedCourseData.sections[activeSection].lessons[activeLesson].completed = true;
                    if (activeLesson < currentSection.lessons.length - 1) {
                      setActiveLesson(activeLesson + 1);
                    } else if (activeSection < courseData.sections.length - 1) {
                      setActiveSection(activeSection + 1);
                      setActiveLesson(0);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
          
          {/* Quiz Content */}
          {currentLesson.type === 'quiz' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">JavaScript Quiz</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2">1. Which of the following is not a JavaScript data type?</p>
                  <div className="space-y-2">
                    {['String', 'Boolean', 'Character', 'Undefined'].map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`q1-${index}`}
                          name="q1"
                          value={option.charAt(0).toLowerCase()}
                          checked={quizAnswers['q1'] === option.charAt(0).toLowerCase()}
                          onChange={(e) => setQuizAnswers({...quizAnswers, q1: e.target.value})}
                          className="mr-2"
                          disabled={quizSubmitted}
                        />
                        <label htmlFor={`q1-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">2. What will the following code output? console.log(typeof [])</p>
                  <div className="space-y-2">
                    {['array', 'object', 'undefined', 'Array'].map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`q2-${index}`}
                          name="q2"
                          value={option.charAt(0).toLowerCase()}
                          checked={quizAnswers['q2'] === option.charAt(0).toLowerCase()}
                          onChange={(e) => setQuizAnswers({...quizAnswers, q2: e.target.value})}
                          className="mr-2"
                          disabled={quizSubmitted}
                        />
                        <label htmlFor={`q2-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {quizSubmitted && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="font-medium">Your Score: {quizScore}/2</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {quizScore === 2 ? 'Great job! You got all questions correct!' :
                     quizScore === 1 ? 'Good effort! You got one question correct.' :
                     'Keep practicing! Review the JavaScript basics.'}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleQuizSubmit}
                disabled={quizSubmitted || !quizAnswers['q1'] || !quizAnswers['q2']}
                className={`mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors ${
                  quizSubmitted || !quizAnswers['q1'] || !quizAnswers['q2'] ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {quizSubmitted ? 'Quiz Submitted' : 'Submit Quiz'}
              </button>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button 
              className={`flex items-center px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors ${(activeSection === 0 && activeLesson === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={activeSection === 0 && activeLesson === 0}
              onClick={() => {
                if (activeLesson > 0) {
                  setActiveLesson(activeLesson - 1);
                } else if (activeSection > 0) {
                  setActiveSection(activeSection - 1);
                  setActiveLesson(courseData.sections[activeSection - 1].lessons.length - 1);
                }
              }}
            >
              Previous Lesson
            </button>
            
            <div className="flex items-center gap-4">
              {currentLesson.type === 'video' && !currentLesson.completed && (
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                  onClick={() => handleLessonComplete(activeSection, activeLesson)}
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Completed
                </Button>
              )}
              
              {courseCompleted && (
                <Button 
                  className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
                  onClick={() => setShowCertificate(true)}
                >
                  <Award className="w-4 h-4" />
                  View Certificate
                </Button>
              )}
              
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleNextLesson}
              >
                {activeLesson === currentSection.lessons.length - 1 && activeSection === courseData.sections.length - 1 
                  ? 'Complete Course' 
                  : 'Next Lesson'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Section */}
      {courseCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="text-center mb-6">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-gray-600">You have successfully completed the course!</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Your Certificate</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{courseData.title}</p>
                    <p className="text-sm text-gray-600">Completed on {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Student: {user?.username || 'Student'}</p>
                    <p className="text-sm text-gray-600">Instructor: {courseData.instructor.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Course Duration: {courseData.duration || '8 weeks'}</p>
                    <p className="text-sm text-gray-600">Final Score: {finalScore}%</p>
                    <p className="text-sm text-gray-600">Course Progress: {courseProgress}%</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Course Modules</h4>
                  <div className="space-y-2">
                    {courseData.sections.map((section, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{section.title}</span>
                        <span className="text-sm text-gray-600">
                          {section.lessons.every(lesson => lesson.completed) ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCertificate(false)}
              >
                Close
              </Button>
              <Button 
                className="bg-mentor hover:bg-mentor-dark"
                onClick={() => {
                  generateCertificatePDF();
                  setShowCertificate(false);
                }}
              >
                Download Certificate
              </Button>
              <Button 
                className="bg-mentor hover:bg-mentor-dark"
                onClick={() => {
                  setShowCertificate(false);
                  navigate('/certificates');
                }}
              >
                View All Certificates
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseLearningPage1;