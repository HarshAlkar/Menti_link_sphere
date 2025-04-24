import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MessageSquare, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Temporary mock data
const upcomingSessions = [
  {
    id: '1',
    mentor: {
      name: 'Dr. Maria Garcia',
      avatar: '/placeholder.svg',
    },
    date: 'Monday, June 12, 2023',
    time: '10:00 AM - 11:00 AM',
    topic: 'Introduction to Data Science',
    status: 'scheduled',
  },
  {
    id: '2',
    mentor: {
      name: 'Robert Johnson',
      avatar: '/placeholder.svg',
    },
    date: 'Wednesday, June 14, 2023',
    time: '2:00 PM - 3:00 PM',
    topic: 'React Component Architecture',
    status: 'scheduled',
  },
];

const pastSessions = [
  {
    id: '3',
    mentor: {
      name: 'Emily Chen',
      avatar: '/placeholder.svg',
    },
    date: 'Friday, June 2, 2023',
    time: '11:00 AM - 12:00 PM',
    topic: 'UI Design Fundamentals',
    status: 'completed',
  },
  {
    id: '4',
    mentor: {
      name: 'James Wilson',
      avatar: '/placeholder.svg',
    },
    date: 'Tuesday, May 30, 2023',
    time: '3:00 PM - 4:00 PM',
    topic: 'Introduction to Machine Learning',
    status: 'completed',
  },
];

// Temporary mock data for availability
const availability = [
  { day: 'Monday', slots: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'] },
  { day: 'Tuesday', slots: ['10:00 AM - 12:00 PM', '3:00 PM - 5:00 PM'] },
  { day: 'Wednesday', slots: ['9:00 AM - 11:00 AM', '1:00 PM - 3:00 PM'] },
  { day: 'Thursday', slots: ['11:00 AM - 1:00 PM', '4:00 PM - 6:00 PM'] },
  { day: 'Friday', slots: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'] },
];

const Schedule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container py-8 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-4">My Schedule</h1>
          <p className="text-muted-foreground mb-8">Manage your mentorship sessions and availability</p>

          <Tabs defaultValue="sessions">
            <TabsList className="mb-6">
              <TabsTrigger value="sessions">Mentorship Sessions</TabsTrigger>
              <TabsTrigger value="availability">My Availability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <Calendar size={20} />
                    Upcoming Sessions
                  </h2>
                  
                  {upcomingSessions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {upcomingSessions.map((session) => (
                        <Card key={session.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                                  <AvatarFallback>{session.mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-lg">{session.topic}</CardTitle>
                                  <CardDescription>with {session.mentor.name}</CardDescription>
                                </div>
                              </div>
                              <Badge className="bg-mentor hover:bg-mentor">Scheduled</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon size={16} className="text-muted-foreground" />
                                <span>{session.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-muted-foreground" />
                                <span>{session.time}</span>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button 
                                  size="sm" 
                                  className="bg-mentor hover:bg-mentor-dark"
                                  onClick={() => navigate(`/video-session/${session.id}`)}
                                >
                                  <Video size={16} className="mr-1" />
                                  Join Session
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageSquare size={16} className="mr-1" />
                                  Message
                                </Button>
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
                          <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                          <Button className="mt-4 bg-mentor hover:bg-mentor-dark">Find a Mentor</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <Calendar size={20} />
                    Past Sessions
                  </h2>
                  
                  {pastSessions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {pastSessions.map((session) => (
                        <Card key={session.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
                                  <AvatarFallback>{session.mentor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-lg">{session.topic}</CardTitle>
                                  <CardDescription>with {session.mentor.name}</CardDescription>
                                </div>
                              </div>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarIcon size={16} className="text-muted-foreground" />
                                <span>{session.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} className="text-muted-foreground" />
                                <span>{session.time}</span>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button size="sm" variant="outline">
                                  View Notes
                                </Button>
                                <Button size="sm" variant="outline">
                                  Provide Feedback
                                </Button>
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
                          <p className="text-muted-foreground">No past sessions found.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manage Your Availability</CardTitle>
                  <CardDescription>
                    Set your available time slots for mentorship sessions. These times will be used by our AI scheduler.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availability.map((day, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-medium mb-2">{day.day}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {day.slots.map((slot, slotIndex) => (
                            <div key={slotIndex} className="flex items-center justify-between bg-muted p-2 rounded">
                              <span className="text-sm">{slot}</span>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">✕</Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="h-9">+ Add Time Slot</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Button className="bg-mentor hover:bg-mentor-dark">Save Changes</Button>
                    <Button variant="outline">Reset</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
