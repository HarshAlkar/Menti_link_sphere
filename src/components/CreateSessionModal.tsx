
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { database } from '@/services/database';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dummy student data for demo purposes
const dummyStudents = [
  { id: 'student1', name: 'Alex Chen', role: 'student' },
  { id: 'student2', name: 'Sarah Johnson', role: 'student' },
  { id: 'student3', name: 'Michael Brown', role: 'student' },
  { id: 'student4', name: 'Jessica Lee', role: 'student' },
];

// Dummy teachers data for demo purposes
const dummyTeachers = [
  { id: 'teacher1', name: 'Dr. Maria Garcia', role: 'teacher' },
  { id: 'teacher2', name: 'Robert Johnson', role: 'teacher' },
  { id: 'mentor1', name: 'David Smith', role: 'mentor' },
  { id: 'mentor2', name: 'Lisa Thompson', role: 'mentor' },
];

type CreateSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateSessionModal = ({ isOpen, onClose }: CreateSessionModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  
  const isTeacherOrMentor = user?.role === 'teacher' || user?.role === 'mentor' || user?.role === 'mentor_admin';
  
  const handleCreateSession = () => {
    if (!title || !date || !time || !selectedParticipantId) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Format date and time
    const formattedDate = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    formattedDate.setHours(hours, minutes);
    
    // Determine who's the student and who's the teacher based on user role
    let mentorId = '';
    let studentId = '';
    
    if (isTeacherOrMentor) {
      mentorId = user?.id || '';
      studentId = selectedParticipantId;
    } else {
      mentorId = selectedParticipantId;
      studentId = user?.id || '';
    }
    
    // Create a new session
    const sessionId = `video${Date.now()}`;
    
    // Get participant information
    const participants = [];
    
    // Add current user to participants
    if (user) {
      participants.push({
        id: user.id,
        name: user.username,
        avatar: user.avatar || '/placeholder.svg',
        role: user.role
      });
    }
    
    // Add selected participant
    const participantPool = isTeacherOrMentor ? dummyStudents : dummyTeachers;
    const selectedParticipant = participantPool.find(p => p.id === selectedParticipantId);
    
    if (selectedParticipant) {
      participants.push({
        id: selectedParticipant.id,
        name: selectedParticipant.name,
        avatar: '/placeholder.svg',
        role: selectedParticipant.role
      });
    }
    
    // Store session data in mock database
    const session = {
      id: sessionId,
      title,
      mentorId,
      studentId,
      instructor: isTeacherOrMentor ? user?.username : selectedParticipant?.name,
      scheduled: formattedDate.toISOString(),
      participants,
      thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
      description: `One-to-one session: ${title}`,
      duration: '45:00',
      courseId: '1'
    };
    
    // Store in localStorage for demo purposes
    const existingSessions = JSON.parse(localStorage.getItem('videoSessions') || '[]');
    localStorage.setItem('videoSessions', JSON.stringify([...existingSessions, session]));
    
    toast({
      title: "Session created",
      description: `Your session has been scheduled for ${formattedDate.toLocaleDateString()} at ${time}`
    });
    
    onClose();
    
    // Ask user if they want to start the session now
    const startNow = window.confirm("Do you want to start this session now?");
    if (startNow) {
      navigate(`/video-session/${sessionId}`);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Video Session</DialogTitle>
          <DialogDescription>
            Create a one-to-one video session with a {isTeacherOrMentor ? 'student' : 'mentor/teacher'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Session title"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <div className="col-span-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md pointer-events-auto"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              className="col-span-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="participant" className="text-right">
              {isTeacherOrMentor ? 'Student' : 'Mentor/Teacher'}
            </Label>
            <Select 
              onValueChange={setSelectedParticipantId}
              value={selectedParticipantId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={`Select a ${isTeacherOrMentor ? 'student' : 'mentor/teacher'}`} />
              </SelectTrigger>
              <SelectContent>
                {(isTeacherOrMentor ? dummyStudents : dummyTeachers).map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.name} ({participant.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateSession}>Create Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
