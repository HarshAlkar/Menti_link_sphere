
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import CreateSessionModal from './CreateSessionModal';

// Mock upcoming sessions data
const upcomingSessions = [
  {
    id: "session1",
    title: "React Router Deep Dive",
    mentor: "Dr. Maria Garcia",
    mentorAvatar: "/placeholder.svg",
    date: "2023-10-15T10:00:00",
    duration: "45 min",
    participants: 1,
    type: "mentor",
  },
  {
    id: "session2",
    title: "Redux State Management",
    mentor: "Robert Johnson",
    mentorAvatar: "/placeholder.svg",
    date: "2023-10-17T14:30:00",
    duration: "60 min",
    participants: 3,
    type: "group",
  },
];

const SessionsOverview = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const isTeacherOrMentor = user?.role === 'teacher' || user?.role === 'mentor' || user?.role === 'mentor_admin';
  
  // Get video sessions from localStorage
  const storedSessions = JSON.parse(localStorage.getItem('videoSessions') || '[]');
  
  // Combine mock and stored sessions
  const allSessions = [...upcomingSessions, ...storedSessions].map(session => {
    // Convert date strings to Date objects for consistent formatting
    const sessionDate = new Date(session.date || session.scheduled || Date.now());
    return {
      ...session,
      formattedDate: sessionDate.toLocaleDateString(),
      formattedTime: sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });
  
  // Sort sessions by date (recent first)
  allSessions.sort((a, b) => {
    const dateA = new Date(a.date || a.scheduled || Date.now());
    const dateB = new Date(b.date || b.scheduled || Date.now());
    return dateA.getTime() - dateB.getTime();
  });
  
  // Filter to show only upcoming sessions (today or future)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const upcomingFilteredSessions = allSessions.filter(session => {
    const sessionDate = new Date(session.date || session.scheduled || Date.now());
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate >= now;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>
            Your scheduled mentor or group sessions.
          </CardDescription>
        </div>
        <Button 
          size="sm" 
          className="bg-mentor hover:bg-mentor-dark"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Video className="mr-2 h-4 w-4" />
          Schedule Session
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingFilteredSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingFilteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={session.mentorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {(session.mentor || session.instructor || "").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold">
                      {session.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {session.mentor || session.instructor} • {session.duration || "45 min"}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {session.formattedDate}
                      </span>
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {session.formattedTime}
                      </span>
                      {session.participants && (
                        <span className="flex items-center text-xs text-muted-foreground">
                          <Users className="mr-1 h-3 w-3" />
                          {typeof session.participants === 'number' ? session.participants : session.participants.length}
                        </span>
                      )}
                      {session.type && (
                        <Badge variant="outline" className="text-xs">
                          {session.type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <Link to={`/video-session/${session.id}`}>
                    <Video className="mr-2 h-4 w-4" />
                    Join
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No upcoming sessions scheduled.</p>
            <p className="mt-1 text-sm">
              Schedule a session with a mentor to get started.
            </p>
          </div>
        )}
      </CardContent>
      
      <CreateSessionModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Card>
  );
};

export default SessionsOverview;
