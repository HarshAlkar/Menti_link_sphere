
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { database, Session } from '@/services/database';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar, Users } from 'lucide-react';

const MentorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [activeStudents, setActiveStudents] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, this would be a database query to fetch mentor's sessions
      const mentorSessions = database.listSessionsByMentor(user.id);
      setSessions(mentorSessions);
      
      // Get unique student IDs
      const studentIds = [...new Set(mentorSessions.map(session => session.studentId))];
      setActiveStudents(studentIds);
    }
  }, [isAuthenticated, user]);

  const handleCreateSession = () => {
    toast({
      title: "Session Created",
      description: "New session has been scheduled successfully",
    });
  };

  if (!isAuthenticated || user?.role !== 'mentor') {
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
                    You need to be logged in as a mentor to access this page.
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
                Mentor Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your mentees and sessions
              </p>
            </div>
            <Button className="mt-4 md:mt-0" onClick={handleCreateSession}>
              Schedule New Session
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Active Mentees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeStudents.length}</div>
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
                  {sessions.filter(s => s.status === 'scheduled').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Completed Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {sessions.filter(s => s.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="mentees">
            <TabsList className="mb-6">
              <TabsTrigger value="mentees">My Mentees</TabsTrigger>
              <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
            </TabsList>

            <TabsContent value="mentees">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">My Mentees</h2>
                {activeStudents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeStudents.map((studentId, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-200 rounded-full h-14 w-14 flex items-center justify-center">
                              <Users className="h-8 w-8 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">Student {index + 1}</h3>
                              <p className="text-sm text-muted-foreground">ID: {studentId.substring(0, 8)}</p>
                            </div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button variant="outline" size="sm">View Progress</Button>
                            <Button size="sm">Schedule</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          You don't have any active mentees yet.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sessions">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                {sessions.filter(s => s.status === 'scheduled').length > 0 ? (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === 'scheduled')
                      .map((session, index) => (
                        <Card key={index}>
                          <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">Session with Student {session.studentId.substring(0, 8)}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.startTime).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">Reschedule</Button>
                                <Button size="sm">Join</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          You don't have any upcoming sessions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Session History</h2>
                {sessions.filter(s => s.status === 'completed').length > 0 ? (
                  <div className="space-y-4">
                    {sessions
                      .filter(s => s.status === 'completed')
                      .map((session, index) => (
                        <Card key={index}>
                          <CardContent className="py-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">Session with Student {session.studentId.substring(0, 8)}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime!).toLocaleString()}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-6">
                      <div className="text-center">
                        <p className="text-muted-foreground">
                          You haven't completed any sessions yet.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorDashboard;
