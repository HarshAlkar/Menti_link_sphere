
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock courses data
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    students: 24,
    progress: 65,
    lastUpdated: '2023-09-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Advanced Machine Learning',
    students: 18,
    progress: 42,
    lastUpdated: '2023-09-12T14:15:00Z',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    students: 32,
    progress: 78,
    lastUpdated: '2023-09-18T09:45:00Z',
  },
];

const TeacherDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'teacher') {
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
                    You need to be logged in as a teacher to access this page.
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
                Teacher Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your courses and student progress
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link to="/course-management">
                <Button>Manage Courses</Button>
              </Link>
              <Button variant="outline">Generate Reports</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Active Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockCourses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {mockCourses.reduce((acc, course) => acc + course.students, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="courses">
            <TabsList className="mb-6">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="students">Student Performance</TabsTrigger>
              <TabsTrigger value="materials">Course Materials</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">My Courses</h2>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {course.students} students enrolled • Last updated {new Date(course.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">View Course</Button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-1">
                            Overall Progress: {course.progress}%
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Student Performance</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        View detailed performance analytics for your students
                      </p>
                      <Button>View Student Analytics</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="materials">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Course Materials</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        Upload and manage course materials for your courses
                      </p>
                      <Button>Manage Materials</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;
