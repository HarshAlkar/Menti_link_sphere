
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Settings, BarChart4 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for the admin dashboard
const mockStats = {
  totalMentors: 12,
  totalStudents: 78,
  activeSessions: 24,
  totalCourses: 16
};

const mockRecentActivities = [
  { id: 1, type: 'course', action: 'created', title: 'Advanced Machine Learning', user: 'Robert Johnson', time: '2 hours ago' },
  { id: 2, type: 'mentor', action: 'approved', title: 'Dr. Maria Garcia', user: 'Admin', time: '3 hours ago' },
  { id: 3, type: 'session', action: 'completed', title: 'Career Guidance Session', user: 'Ahmed Khan', time: '5 hours ago' },
  { id: 4, type: 'course', action: 'updated', title: 'Web Development Bootcamp', user: 'Sarah Thompson', time: '1 day ago' },
];

const MentorAdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || user?.role !== 'mentor_admin') {
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
                    You need to be logged in as a mentor admin to access this page.
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
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Platform management and analytics
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link to="/course-management">
                <Button>Manage Courses</Button>
              </Link>
              <Link to="/mentor-management">
                <Button variant="outline">Manage Mentors</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Total Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalMentors}</div>
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
                <div className="text-3xl font-bold">{mockStats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Active Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.totalCourses}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5" />
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockStats.activeSessions}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activity">
            <TabsList className="mb-6">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Platform Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {mockRecentActivities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} by {activity.user} • {activity.time}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="approvals">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                <Card>
                  <CardContent className="py-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h3 className="font-medium">New Mentor Application</h3>
                          <p className="text-sm text-muted-foreground">From: James Wilson • Submitted: 1 day ago</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive">Reject</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h3 className="font-medium">Course Publication Request</h3>
                          <p className="text-sm text-muted-foreground">Course: Data Visualization • By: Emily Chen</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive">Reject</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
                <Card>
                  <CardContent className="py-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        View detailed analytics about user engagement, course completions, and mentorship success
                      </p>
                      <Button>View Full Analytics</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
                <Card>
                  <CardContent className="py-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">Configure system-wide email notification settings</p>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h3 className="font-medium">User Permissions</h3>
                          <p className="text-sm text-muted-foreground">Manage role-based permissions</p>
                        </div>
                        <Button size="sm" variant="outline">Manage</Button>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h3 className="font-medium">Platform Appearance</h3>
                          <p className="text-sm text-muted-foreground">Customize logos, colors, and branding</p>
                        </div>
                        <Button size="sm" variant="outline">Customize</Button>
                      </div>
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

export default MentorAdminDashboard;
