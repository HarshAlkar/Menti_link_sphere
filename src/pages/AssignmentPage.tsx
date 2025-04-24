// your imports
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
        duration: 12,
        completed: true,
        lessonDetails: [  
          { id: 1, title: 'Variables and Data Types', duration: 5,
            completed: true },
          { id: 2, title: 'Control Structures', duration: 7,
            completed: true }
        ],
        videoUrl: '/videos/LEARN.mp4', // Local video
        content: 'This lesson introduces you to Python programming language, its history, and why it\'s popular for data science.'
      },
      2: {
        title: 'Setting Up Your Environment',
        section: 'Python Basics',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
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
    }
  };

  const [expandedSections, setExpandedSections] = useState([1]);
  const [currentLesson, setCurrentLesson] = useState(1);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleLessonClick = (lessonId: number) => {
    setCurrentLesson(lessonId);
  };

  const handleResourceClick = (resourceId: number) => {
    alert(`Downloading resource: ${courseData.resources.find(r => r.id === resourceId)?.title}`);
  };

  const currentLessonData = courseData.lessonContent[currentLesson];

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r overflow-y-auto bg-gray-50">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-medium text-lg">Course Content</h2>
          <button className="p-1 hover:bg-gray-200 rounded">
            <ChevronDown size={20} />
          </button>
        </div>

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

      <div className="flex-grow overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold">{courseData.title}</h1>
          <p className="text-gray-600">Instructor: {courseData.instructor.name}</p>

          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Course Progress</span>
              <span className="text-sm font-medium">
                {courseData.progress.completed}/{courseData.progress.total} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(courseData.progress.completed / courseData.progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {currentLessonData && (
          <div className="px-6">
            <h2 className="text-xl font-bold mt-6">{currentLessonData.title}</h2>
            <p className="text-gray-600">Section: {currentLessonData.section}</p>

            {/* 🎥 Video Player Integration */}
            <div className="mt-6">
              {currentLessonData.videoUrl?.includes('youtube.com') || currentLessonData.videoUrl?.includes('vimeo.com') ? (
                <iframe
                  src={currentLessonData.videoUrl}
                  title="Lesson Video"
                  className="w-full aspect-video rounded-lg"
                  allowFullScreen
                ></iframe>
              ) : currentLessonData.videoUrl?.endsWith('.mp4') ? (
                <video
                  src={currentLessonData.videoUrl}
                  controls
                  className="w-full aspect-video rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <PlayCircle size={48} className="mx-auto mb-2" />
                    <p>Video not available</p>
                  </div>
                </div>
              )}
            </div>

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
