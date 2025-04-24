
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Award, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

// Mock courses data
const mockEnrolledCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Dr. Maria Garcia',
    progress: 65,
    nextLesson: 'CSS Flexbox and Grid',
    nextLessonDate: '2023-09-22T13:00:00Z',
  },
  {
    id: '2',
    title: 'Advanced Machine Learning',
    instructor: 'Robert Johnson',
    progress: 42,
    nextLesson: 'Neural Networks Architecture',
    nextLessonDate: '2023-09-23T15:30:00Z',
  },
];

// Mock mentor sessions
const mockMentorSessions = [
  {
    id: '1',
    mentorName: 'Dr. Ahmed Khan',
    date: '2023-09-24T14:00:00Z',
    topic: 'Career Guidance in Tech',
    status: 'scheduled',
  },
  {
    id: '2',
    mentorName: 'Sarah Thompson',
    date: '2023-09-20T11:00:00Z',
    topic: 'Project Review',
    status: 'completed',
  },
];

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'student') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
                  <p className="text-muted-foreground">
                    You need to be logged in as a student to access this page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Student Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your learning progress
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link to="/courses">
                <Button>Browse Courses</Button>
              </Link>
              <Link to="/student/leaderboard">
                <Button variant="outline">View Leaderboard</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockEnrolledCourses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {mockMentorSessions.filter(s => s.status === 'scheduled').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Current Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">16th</div>
                <p className="text-sm text-muted-foreground">Top 20%</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="mentors">My Mentors</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">My Courses</h2>
                <div className="space-y-4">
                  {mockEnrolledCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Instructor: {course.instructor}
                            </p>
                          </div>
                          <Button size="sm">Continue Learning</Button>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="mt-4 text-sm text-muted-foreground">
                            <p>Next lesson: {course.nextLesson}</p>
                            <p>Scheduled: {new Date(course.nextLessonDate).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mentors">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">My Mentors</h2>
                {mockMentorSessions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockMentorSessions
                        .filter(session => session.status === 'scheduled')
                        .map((session) => (
                        <Card key={session.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="bg-gray-200 rounded-full h-14 w-14 flex items-center justify-center">
                                <Users className="h-8 w-8 text-gray-500" />
                              </div>
                              <div>
                                <h3 className="font-medium">{session.mentorName}</h3>
                                <p className="text-sm text-muted-foreground">Topic: {session.topic}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button size="sm">Join Session</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Past Sessions</h3>
                      <div className="space-y-3">
                        {mockMentorSessions
                          .filter(session => session.status === 'completed')
                          .map((session) => (
                          <Card key={session.id}>
                            <CardContent className="py-3 px-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">{session.mentorName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {session.topic} • {new Date(session.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button variant="outline" size="sm">View Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          You don't have any mentors yet.
                        </p>
                        <Link to="/mentors">
                          <Button>Find a Mentor</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((achievement) => (
                    <Card key={achievement} className={achievement > 3 ? "opacity-40" : ""}>
                      <CardContent className="p-4 text-center">
                        <div className="mx-auto bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-3">
                          <Award className={`h-8 w-8 ${achievement > 3 ? "text-gray-400" : "text-primary"}`} />
                        </div>
                        <h3 className="font-medium text-sm">Achievement {achievement}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement > 3 ? "Locked" : "Unlocked"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
