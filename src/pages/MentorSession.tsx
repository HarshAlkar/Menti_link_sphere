
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Database } from 'lucide-react';

// Temporary mock data for the mentor
const mockMentor = {
  id: '1',
  name: 'Dr. Maria Garcia',
  expertise: ['Data Science', 'Machine Learning', 'Python'],
  avatar: '/placeholder.svg',
};

// Database for messages and sessions
let sessionDatabase: {
  sessionId: string;
  messages: { sender: string; text: string; timestamp: Date }[];
  startTime: Date;
  endTime: Date | null;
  participants: string[];
}[] = [];

const MentorSession = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: Date }[]>([]);
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    startTime: Date;
    participants: string[];
  }>({
    sessionId: '',
    startTime: new Date(),
    participants: [],
  });
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize session
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Generate a session ID
    const sessionId = `session_${id}_${Date.now()}`;
    
    // Check if session exists in database
    const existingSession = sessionDatabase.find(s => s.sessionId === sessionId);
    
    if (existingSession) {
      setMessages(existingSession.messages);
      setSessionData({
        sessionId,
        startTime: existingSession.startTime,
        participants: existingSession.participants
      });
    } else {
      // Create new session in database
      const newSession = {
        sessionId,
        messages: [],
        startTime: new Date(),
        endTime: null,
        participants: [user.username, mockMentor.name]
      };
      sessionDatabase.push(newSession);
      setSessionData({
        sessionId,
        startTime: newSession.startTime,
        participants: newSession.participants
      });
    }

    // Initialize webcam and microphone
    startStream();

    return () => {
      // End the session and cleanup when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const session = sessionDatabase.find(s => s.sessionId === sessionId);
      if (session) {
        session.endTime = new Date();
      }
    };
  }, [id, user, navigate]);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      toast({
        title: "Video call connected",
        description: "Your camera and microphone are now active.",
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        variant: "destructive",
        title: "Failed to connect",
        description: "Could not access camera or microphone. Please check permissions."
      });
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Update session in database
    const session = sessionDatabase.find(s => s.sessionId === sessionData.sessionId);
    if (session) {
      session.endTime = new Date();
    }
    
    toast({
      title: "Call ended",
      description: "Your session has been saved to the database."
    });
    
    navigate(`/mentors/${id}`);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      sender: user?.username || 'You',
      text: message,
      timestamp: new Date()
    };
    
    // Update local state
    setMessages(prev => [...prev, newMessage]);
    
    // Update database
    const session = sessionDatabase.find(s => s.sessionId === sessionData.sessionId);
    if (session) {
      session.messages.push(newMessage);
    }
    
    setMessage('');
  };

  const saveSessionData = () => {
    // In a real app, this would save to a server or localStorage
    console.log('Session data saved:', {
      sessionId: sessionData.sessionId,
      mentor: mockMentor.name,
      student: user?.username,
      duration: session => {
        const endTime = session.endTime || new Date();
        return Math.round((endTime.getTime() - session.startTime.getTime()) / 60000);
      },
      messages
    });
    
    toast({
      title: "Session data saved",
      description: "Your session data has been stored in the database."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-6 px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={mockMentor.avatar} alt={mockMentor.name} />
                <AvatarFallback>{mockMentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{mockMentor.name}</h1>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mockMentor.expertise.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Badge className="bg-green-500">Live Session</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardContent className="p-0 overflow-hidden">
                  <div className="relative bg-black aspect-video w-full">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted={!isAudioOn}
                      className={`w-full h-full object-cover ${isVideoOn ? '' : 'hidden'}`}
                    />
                    {!isVideoOn && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="h-32 w-32">
                          <AvatarFallback className="text-4xl">{user?.username?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 mb-6">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={isAudioOn ? 'bg-slate-100' : 'bg-slate-200 text-red-500'} 
                  onClick={toggleAudio}
                >
                  {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={isVideoOn ? 'bg-slate-100' : 'bg-slate-200 text-red-500'} 
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                </Button>
                <Button 
                  size="lg" 
                  variant="destructive" 
                  className="bg-red-500 hover:bg-red-600" 
                  onClick={endCall}
                >
                  <Phone size={24} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-mentor text-white hover:bg-mentor-dark"
                  onClick={saveSessionData}
                >
                  <Database size={24} />
                </Button>
              </div>
            </div>

            <div className="h-full">
              <Card className="h-full flex flex-col">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-lg">Session Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-auto p-4 pt-0">
                  <div className="space-y-4 h-[calc(100vh-22rem)] overflow-y-auto">
                    {messages.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === user?.username ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === user?.username ? 'bg-mentor text-white' : 'bg-gray-100'}`}>
                            <p className="text-sm font-medium">{msg.sender}</p>
                            <p>{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-grow px-3 py-2 border rounded-md"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <MessageSquare size={20} />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentorSession;
