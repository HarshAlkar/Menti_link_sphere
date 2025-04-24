import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Clock, Check, PlayCircle, Download } from 'lucide-react';

const DataScienceCourseContent = () => {
  const courseData = {
    id: '2',
    title: 'Data Science Fundamentals with Python',
    instructor: {
      name: 'Michael Chen',
      avatar: '/placeholder.svg',
    },
    category: 'Data Science',
    progress: {
      completed: 3,
      total: 15,
    },
    sections: [
      {
        id: 1,
        title: 'Python Basics',
        lessons: 4,
        content: [
          { id: 1, title: 'Introduction to Python', duration: 12, completed: true },
          { id: 2, title: 'Setting Up Your Environment', duration: 15, completed: true },
          { id: 3, title: 'Variables and Data Types', duration: 18, completed: true },
          { id: 4, title: 'Control Structures', duration: 20, completed: false }
        ]
      },
      {
        id: 2,
        title: 'Data Manipulation with Pandas',
        lessons: 4,
        content: [
          { id: 5, title: 'Introduction to Pandas', duration: 15, completed: false },
          { id: 6, title: 'DataFrame Operations', duration: 18, completed: false },
          { id: 7, title: 'Data Cleaning Techniques', duration: 20, completed: false },
          { id: 8, title: 'Data Transformation', duration: 22, completed: false }
        ]
      },
      {
        id: 3,
        title: 'Data Visualization',
        lessons: 3,
        content: [
          { id: 9, title: 'Matplotlib Fundamentals', duration: 15, completed: false },
          { id: 10, title: 'Advanced Visualizations with Seaborn', duration: 20, completed: false },
          { id: 11, title: 'Interactive Visualizations', duration: 25, completed: false }
        ]
      },
      {
        id: 4,
        title: 'Machine Learning Basics',
        lessons: 4,
        content: [
          { id: 12, title: 'Introduction to Machine Learning', duration: 18, completed: false },
          { id: 13, title: 'Supervised Learning', duration: 25, completed: false },
          { id: 14, title: 'Unsupervised Learning', duration: 22, completed: false },
          { id: 15, title: 'Model Evaluation', duration: 20, completed: false }
        ]
      }
    ],
    resources: [
      { id: 1, title: 'Python Cheat Sheet', type: 'download' },
      { id: 2, title: 'Pandas Reference Guide', type: 'download' },
      { id: 3, title: 'Course Slides', type: 'download' },
      { id: 4, title: 'Starter Code', type: 'download' }
    ],
    lessonContent: {
      1: {
        title: 'Introduction to Python',
        section: 'Python Basics',
        videoUrl: '#',
        content: 'This lesson introduces you to Python programming language, its history, and why it\'s popular for data science.'
      },
      2: {
        title: 'Setting Up Your Environment',
        section: 'Python Basics',
        videoUrl: '#',
        content: 'Learn how to set up Python, install necessary packages, and configure your development environment.'
      },
      3: {
        title: 'Variables and Data Types',
        section: 'Python Basics',
        videoUrl: '#',
        content: 'Understand Python variables, data types, and basic operations.'
      },
      4: {
        title: 'Control Structures',
        section: 'Python Basics',
        videoUrl: '#',
        content: 'Learn about conditional statements, loops, and control flow in Python.'
      },
      5: {
        title: 'Introduction to Pandas',
        section: 'Data Manipulation with Pandas',
        videoUrl: '#',
        content: 'Get started with Pandas library and understand its fundamental concepts.'
      }
      // Additional lessons would be defined here
    }
  };

  // State management
  const [expandedSections, setExpandedSections] = useState([1]); // Initially expand first section
  const [currentLesson, setCurrentLesson] = useState(1); // Initially show first lesson

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Handle clicking on a lesson
  const handleLessonClick = (lessonId) => {
    setCurrentLesson(lessonId);
  };

  // Handle resource click
  const handleResourceClick = (resourceId) => {
    // In a real app, this would trigger a download
    alert(`Downloading resource: ${courseData.resources.find(r => r.id === resourceId).title}`);
  };

  // Find current lesson details
  const currentLessonData = courseData.lessonContent[currentLesson];

  return (
    <div className="flex h-screen">
      {/* Left Sidebar Navigation */}
      <div className="w-80 border-r overflow-y-auto bg-gray-50">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-medium text-lg">Course Content</h2>
          <button className="p-1 hover:bg-gray-200 rounded">
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Course Sections */}
        {courseData.sections.map((section) => (
          <div key={section.id} className="border-b">
            <div 
              className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div>
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.lessons} lessons</p>
              </div>
              {expandedSections.includes(section.id) ? 
                <ChevronDown size={20} /> : 
                <ChevronRight size={20} />
              }
            </div>

            {/* Show lessons when section is expanded */}
            {expandedSections.includes(section.id) && (
              <div className="bg-white">
                {section.content.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`flex items-center p-4 pl-6 hover:bg-gray-100 cursor-pointer ${
                      currentLesson === lesson.id ? 'bg-blue-50' : 
                      lesson.completed ? 'bg-green-50' : ''
                    }`}
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <div className="mr-3">
                      {lesson.completed ? 
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div> :
                        <Clock size={16} className="text-gray-400" />
                      }
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration} min</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Resources Section */}
        <div className="p-4">
          <h2 className="font-medium text-lg mb-4">Resources</h2>
          {courseData.resources.map((resource) => (
            <div 
              key={resource.id} 
              className="flex items-center mb-3 text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => handleResourceClick(resource.id)}
            >
              <Download size={16} className="mr-2" />
              <span className="text-sm">{resource.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold">{courseData.title}</h1>
          <p className="text-gray-600">Instructor: {courseData.instructor.name}</p>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Course Progress</span>
              <span className="text-sm font-medium">{courseData.progress.completed}/{courseData.progress.total} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{width: `${(courseData.progress.completed / courseData.progress.total) * 100}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Lesson Content */}
        {currentLessonData && (
          <div className="px-6">
            <h2 className="text-xl font-bold mt-6">{currentLessonData.title}</h2>
            <p className="text-gray-600">Section: {currentLessonData.section}</p>
            
            {/* Video Player */}
            <div className="mt-6 bg-gray-900 w-full aspect-video rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 cursor-pointer hover:bg-opacity-30 transition">
                  <PlayCircle size={40} className="text-white" />
                  
                </div>
                <p className="text-white mt-4">Video Content</p>
              </div>
            </div>
            
            {/* Lesson Content */}
            <div className="my-6 pb-6">
              <p className="text-gray-700">{currentLessonData.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataScienceCourseContent;