import React, { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  MessageCircle, 
  Users, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  ScreenShare, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Settings,
  Share2,
  Copy,
  Check,
  Phone,
  MoreVertical,
  Maximize,
  Minimize,
  ScreenShareOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  time: string;
  isInstructor: boolean;
}

interface SessionParticipant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isOnline: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
}

interface VideoSession {
  id: string;
  title: string;
  courseId: string;
  instructor: string;
  thumbnail: string;
  description: string;
  duration: string;
  scheduled: string;
  participants: SessionParticipant[];
}

const VideoSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<VideoSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [participants, setParticipants] = useState<SessionParticipant[]>([]);
  const { isAuthenticated, user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tab synchronization using BroadcastChannel
  const broadcastChannel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Initialize broadcast channel for tab synchronization
    broadcastChannel.current = new BroadcastChannel('video-session');
    
    broadcastChannel.current.onmessage = (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'TAB_CHANGE':
          setActiveTab(data.tab);
          break;
        case 'CHAT_MESSAGE':
          setChatMessages(prev => [...prev, data.message]);
          break;
        case 'PARTICIPANT_UPDATE':
          setParticipants(data.participants);
          break;
      }
    };

    return () => {
      broadcastChannel.current?.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    // Simulate loading session
    setLoading(true);
    setTimeout(() => {
      // First check local storage for sessions
      const storedSessions = JSON.parse(localStorage.getItem('videoSessions') || '[]');
      let foundSession = storedSessions.find((s: VideoSession) => s.id === sessionId);
      
      // If not found in localStorage, check mock data
      if (!foundSession) {
        // Mock video session data
        const mockVideoSessions: VideoSession[] = [
          {
            id: 'video1',
            title: 'CSS Grid & Flexbox Masterclass',
            courseId: '1',
            instructor: 'HARSH ALKAR',
            thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
            description: 'Master modern CSS layout techniques with Grid and Flexbox.',
            duration: '45:00',
            scheduled: '2023-10-15T15:00:00Z',
            participants: [
              { id: 'user1', name: 'Alex Chen', avatar: '/placeholder.svg', role: 'student', isOnline: true, isVideoOn: true, isAudioOn: true },
              { id: 'user2', name: 'Sarah Johnson', avatar: '/placeholder.svg', role: 'student', isOnline: true, isVideoOn: true, isAudioOn: true },
              { id: 'user3', name: 'HARSH ALKAR', avatar: '/placeholder.svg', role: 'instructor', isOnline: true, isVideoOn: true, isAudioOn: true },
            ]
          },
          {
            id: 'video2',
            title: 'JavaScript Promises & Async/Await',
            courseId: '1',
            instructor: 'SHREYAS MANE',
            thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
            description: 'Learn how to work with asynchronous JavaScript using Promises and async/await.',
            duration: '60:00',
            scheduled: '2023-10-20T14:00:00Z',
            participants: [
              { id: 'user1', name: 'Alex Chen', avatar: '/placeholder.svg', role: 'student', isOnline: true, isVideoOn: true, isAudioOn: true },
              { id: 'user4', name: 'SHREYAS MANE', avatar: '/placeholder.svg', role: 'instructor', isOnline: true, isVideoOn: true, isAudioOn: true },
            ]
          },
        ];
        
        foundSession = mockVideoSessions.find(s => s.id === sessionId);
      }
      
      setSession(foundSession || null);
      setParticipants(foundSession?.participants || []);
      setLoading(false);
      
      if (foundSession) {
        // Simulate a welcome message from the instructor
        if (foundSession.instructor && user?.username !== foundSession.instructor) {
          setTimeout(() => {
            const welcomeMessage: ChatMessage = {
              id: `msg${Date.now()}`,
              user: foundSession.instructor,
              message: `Welcome to the ${foundSession.title} session! Let me know if you have any questions.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isInstructor: true,
            };
            setChatMessages(prev => [...prev, welcomeMessage]);
            
            // Broadcast the message to other tabs
            broadcastChannel.current?.postMessage({
              type: 'CHAT_MESSAGE',
              data: { message: welcomeMessage }
            });
          }, 2000);
        }
      }
    }, 500);
  }, [sessionId, user?.username]);

  useEffect(() => {
    // Initialize video stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing media devices:', err));

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: `msg${Date.now()}`,
      user: user?.username || 'Anonymous',
      message: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstructor: user?.role === 'teacher' || user?.role === 'mentor',
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Broadcast the message to other tabs
    broadcastChannel.current?.postMessage({
      type: 'CHAT_MESSAGE',
      data: { message }
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Broadcast tab change to other tabs
    broadcastChannel.current?.postMessage({
      type: 'TAB_CHANGE',
      data: { tab: value }
    });
  };

  const copySessionLink = () => {
    const sessionLink = window.location.href;
    navigator.clipboard.writeText(sessionLink).then(() => {
      setIsCopied(true);
      toast({
        title: "Link copied",
        description: "Session link has been copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleEndCall = () => {
    const confirmEnd = window.confirm("Are you sure you want to end this session?");
    if (confirmEnd) {
      toast({
        title: "Session ended",
        description: "Your video session has been ended successfully."
      });
      navigate('/dashboard');
    }
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
                    Please log in to join this video session.
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
                  <h2 className="text-2xl font-bold mb-4">Loading Session...</h2>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    The video session you're looking for doesn't exist or you don't have permission to join it.
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

  return (
    <div className="h-screen flex flex-col bg-gray-900" ref={containerRef}>
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map(participant => (
            <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              {participant.isVideoOn ? (
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  playsInline
                  muted={participant.id === "1"}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-sm font-medium">{participant.name}</span>
                  {!participant.isAudioOn && <MicOff className="w-4 h-4" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Participants Tab */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">People ({participants.length})</h3>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Chat Tab */}
          <div className="flex-1 overflow-y-auto p-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{msg.user}</span>
                      <span className="text-gray-400 text-sm">{msg.time}</span>
                    </div>
                    <p className="text-gray-300">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Send a message"
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isAudioOn ? 'text-white' : 'text-red-500'}`}
          onClick={() => setIsAudioOn(!isAudioOn)}
        >
          {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isVideoOn ? 'text-white' : 'text-red-500'}`}
          onClick={() => setIsVideoOn(!isVideoOn)}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full ${isScreenSharing ? 'text-green-500' : 'text-white'}`}
          onClick={toggleScreenShare}
        >
          {isScreenSharing ? <ScreenShareOff className="w-6 h-6" /> : <ScreenShare className="w-6 h-6" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-white"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-white"
        >
          <Users className="w-6 h-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-white"
        >
          <Share2 className="w-6 h-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-white"
        >
          <Settings className="w-6 h-6" />
        </Button>
        
        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-full"
          onClick={handleEndCall}
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideoSession;
