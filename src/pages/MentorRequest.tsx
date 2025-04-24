
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { database } from '@/services/database';

// Mock data for mentors
const mockMentors = [
  {
    id: '1',
    name: 'Dr. Maria Garcia',
    expertise: ['Data Science', 'Machine Learning', 'Python'],
    avatar: '/placeholder.svg',
    bio: 'Senior Data Scientist with 8+ years of experience in machine learning and AI. PhD in Computer Science from Stanford.',
    availability: [
      { day: 'Monday', slots: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM - 10:00 AM', '3:00 PM - 4:00 PM'] },
      { day: 'Friday', slots: ['1:00 PM - 2:00 PM', '4:00 PM - 5:00 PM'] },
    ]
  },
  {
    id: '2',
    name: 'Robert Johnson',
    expertise: ['Web Development', 'React', 'Node.js'],
    avatar: '/placeholder.svg',
    bio: 'Full-stack developer with 10+ years experience. Specializing in modern JavaScript frameworks and responsive design.',
    availability: [
      { day: 'Tuesday', slots: ['11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM - 11:00 AM', '4:00 PM - 5:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM'] },
    ]
  },
];

const MentorRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Find mentor by ID from mock data
  const mentor = mockMentors.find(m => m.id === id);

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow container py-8">
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Mentor Not Found</h2>
                <p className="text-muted-foreground mb-4">The mentor you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/mentors')}>View All Mentors</Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRequestSession = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to request a session with this mentor."
      });
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast({
        variant: "destructive",
        title: "Time selection required",
        description: "Please select a date and time slot for your session."
      });
      return;
    }

    // Create session in database
    const session = database.createSession({
      mentorId: mentor.id,
      studentId: user?.id || 'unknown',
      startTime: selectedDate,
      endTime: null,
      status: 'scheduled'
    });

    toast({
      title: "Session requested",
      description: `Your session with ${mentor.name} has been scheduled.`
    });

    // In a real app, this would send a notification to the mentor
    navigate('/dashboard');
  };

  const startInstantSession = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to start a session with this mentor."
      });
      navigate('/login');
      return;
    }

    // Create session in database
    const session = database.createSession({
      mentorId: mentor.id,
      studentId: user?.id || 'unknown',
      startTime: new Date(),
      endTime: null,
      status: 'ongoing'
    });

    toast({
      title: "Starting session",
      description: `Connecting to video call with ${mentor.name}...`
    });

    navigate(`/mentors/${id}/session`);
  };

  // Get day name from date
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Get available slots for selected date
  const getAvailableSlots = (date: Date) => {
    const dayName = getDayName(date);
    const dayAvailability = mentor.availability.find(
      a => a.day === dayName
    );
    return dayAvailability ? dayAvailability.slots : [];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Request Session with {mentor.name}</h1>
            <p className="text-muted-foreground mt-2">
              Schedule a one-on-one session with {mentor.name} to discuss your learning goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{mentor.name}</CardTitle>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mentor.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{mentor.bio}</p>
                  <Button 
                    className="w-full bg-mentor hover:bg-mentor-dark" 
                    onClick={startInstantSession}
                  >
                    Start Instant Session
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule a Session</CardTitle>
                  <CardDescription>
                    Select a date and time that works for you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium mb-2">Available Dates</h3>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="border rounded-md"
                        disabled={(date) => {
                          // Disable dates in the past and dates where mentor isn't available
                          const dayName = getDayName(date);
                          const isAvailable = mentor.availability.some(a => a.day === dayName);
                          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                          return isPast || !isAvailable;
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-md font-medium mb-2">Available Time Slots</h3>
                      {selectedDate ? (
                        <div className="space-y-2">
                          {getAvailableSlots(selectedDate).length > 0 ? (
                            getAvailableSlots(selectedDate).map((slot, index) => (
                              <div 
                                key={index}
                                className={`p-2 border rounded-md cursor-pointer transition-colors ${
                                  selectedTimeSlot === slot 
                                    ? 'bg-mentor text-white' 
                                    : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setSelectedTimeSlot(slot)}
                              >
                                {slot}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No available slots on this date.</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Please select a date first.</p>
                      )}

                      <div className="mt-6">
                        <h3 className="text-md font-medium mb-2">Additional Information</h3>
                        <Textarea
                          placeholder="What would you like to discuss in the session?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="h-24"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    className="bg-mentor hover:bg-mentor-dark"
                    onClick={handleRequestSession}
                    disabled={!selectedDate || !selectedTimeSlot}
                  >
                    Request Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorRequest;
