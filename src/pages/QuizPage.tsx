
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Mock quiz data
const mockQuizzes = [
  {
    id: 'quiz1',
    title: 'HTML Basics Quiz',
    courseId: '1',
    description: 'Test your knowledge of HTML fundamentals.',
    timeLimit: 15, // in minutes
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'Hyper Transfer Markup Language',
          'Hyperlink and Text Markup Language',
          'Home Tool Markup Language'
        ],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'Which tag is used to create a hyperlink?',
        options: [
          '<link>',
          '<a>',
          '<href>',
          '<url>'
        ],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'Which HTML element defines the title of a document?',
        options: [
          '<meta>',
          '<header>',
          '<title>',
          '<head>'
        ],
        correctAnswer: 2
      },
      {
        id: 'q4',
        question: 'Which HTML element is used to specify a footer for a document or section?',
        options: [
          '<footer>',
          '<bottom>',
          '<section>',
          '<end>'
        ],
        correctAnswer: 0
      },
      {
        id: 'q5',
        question: 'What is the correct HTML element for inserting a line break?',
        options: [
          '<break>',
          '<lb>',
          '<newline>',
          '<br>'
        ],
        correctAnswer: 3
      }
    ]
  },
  {
    id: 'quiz2',
    title: 'CSS Fundamentals',
    courseId: '1',
    description: 'Test your knowledge of CSS fundamentals.',
    timeLimit: 20,
    passingScore: 75,
    questions: [
      {
        id: 'q1',
        question: 'What does CSS stand for?',
        options: [
          'Creative Style Sheets',
          'Cascading Style Sheets',
          'Computer Style Sheets',
          'Colorful Style Sheets'
        ],
        correctAnswer: 1
      },
      // More questions...
    ]
  }
];

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [score, setScore] = useState(0);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading quiz
    setLoading(true);
    setTimeout(() => {
      const foundQuiz = mockQuizzes.find(q => q.id === quizId);
      setQuiz(foundQuiz || null);
      if (foundQuiz) {
        setRemainingTime(foundQuiz.timeLimit * 60);
        setAnswers(new Array(foundQuiz.questions.length).fill(-1));
      }
      setLoading(false);
    }, 500);
  }, [quizId]);

  useEffect(() => {
    let timer: number;
    if (started && !completed && remainingTime > 0) {
      timer = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [started, completed, remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setStarted(true);
    toast({
      title: "Quiz Started",
      description: `You have ${quiz.timeLimit} minutes to complete this quiz.`,
    });
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setCompleted(true);
    
    toast({
      title: "Quiz Completed",
      description: `Your score: ${calculatedScore}%`,
    });
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === 'next' && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getProgressStatus = () => {
    const answeredCount = answers.filter(a => a !== -1).length;
    return Math.round((answeredCount / answers.length) * 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                  <p className="text-muted-foreground mb-6">
                    Please log in to take this quiz.
                  </p>
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Loading Quiz...</h2>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    The quiz you're looking for doesn't exist or you don't have permission to take it.
                  </p>
                  <Button asChild>
                    <Link to="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (completed) {
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow bg-gray-50">
          <div className="container py-8 px-4 md:px-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to={`/courses/${quiz.courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            </Button>
            
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{quiz.title} - Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${
                    passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className={`text-4xl font-bold ${
                      passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {score}%
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">
                    {passed ? 'Quiz Passed! 🎉' : 'Quiz Failed'}
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {passed 
                      ? 'Great job! You have successfully passed this quiz.' 
                      : `You didn't meet the passing score of ${quiz.passingScore}%. Try again!`}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Question Summary:</h3>
                  {quiz.questions.map((question: any, index: number) => (
                    <div 
                      key={question.id} 
                      className={`p-3 rounded-md ${
                        answers[index] === question.correctAnswer 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex">
                        <div className="mr-3">
                          {answers[index] === question.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{question.question}</p>
                          <div className="mt-1 text-sm">
                            <p className="text-muted-foreground">
                              Your answer: {question.options[answers[index]]}
                            </p>
                            {answers[index] !== question.correctAnswer && (
                              <p className="text-green-600 font-medium">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStarted(false);
                    setCompleted(false);
                    setCurrentQuestion(0);
                    setAnswers(new Array(quiz.questions.length).fill(-1));
                    setRemainingTime(quiz.timeLimit * 60);
                  }}
                >
                  Retake Quiz
                </Button>
                <Button asChild>
                  <Link to={`/courses/${quiz.courseId}`}>
                    Back to Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow bg-gray-50">
          <div className="container py-8 px-4 md:px-6">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to={`/courses/${quiz.courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            </Button>
            
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground">{quiz.description}</p>
                </div>
                
                <div className="space-y-2 border rounded-md p-4 bg-muted/40">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">Time Limit: <span className="font-medium">{quiz.timeLimit} minutes</span></p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">Questions: <span className="font-medium">{quiz.questions.length}</span></p>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">Passing Score: <span className="font-medium">{quiz.passingScore}%</span></p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-amber-800">Before you begin:</h3>
                  <ul className="text-sm text-amber-700 list-disc list-inside mt-2 space-y-1">
                    <li>Ensure you have a stable internet connection</li>
                    <li>You cannot pause the quiz once started</li>
                    <li>Do not refresh or navigate away from the page</li>
                    <li>Submit your answers before the time runs out</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button size="lg" onClick={handleStartQuiz}>
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active quiz view
  const currentQ = quiz.questions[currentQuestion];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <div className="flex items-center text-red-500 font-medium">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatTime(remainingTime)}
                </div>
              </div>
              <Progress value={getProgressStatus()} className="h-2 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span>{getProgressStatus()}% completed</span>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
                  <div className="space-y-2">
                    {currentQ.options.map((option: string, index: number) => (
                      <div 
                        key={index}
                        className={`border rounded-md p-3 cursor-pointer transition-colors ${
                          answers[currentQuestion] === index 
                            ? 'bg-primary/10 border-primary' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleSelectAnswer(currentQuestion, index)}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                            answers[currentQuestion] === index 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => navigateQuestion('prev')}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              
              <div>
                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button onClick={handleSubmit}>
                    Submit Quiz
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigateQuestion('next')}
                    disabled={currentQuestion === quiz.questions.length - 1}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;
