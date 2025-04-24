
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, PlusCircle, CheckCircle, XCircle, Edit, User, Users, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock mentors data
const mockMentors = [
  {
    id: '1',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@example.com',
    expertise: ['Data Science', 'Machine Learning', 'Python'],
    bio: 'Senior Data Scientist with 8+ years of experience in machine learning and AI. PhD in Computer Science from Stanford.',
    availability: 'Available Mon-Wed',
    status: 'active',
    students: 8,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    expertise: ['Web Development', 'React', 'Node.js'],
    bio: 'Full-stack developer with 10+ years experience. Specializing in modern JavaScript frameworks and responsive design.',
    availability: 'Available weekends',
    status: 'active',
    students: 12,
    rating: 4.7,
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    expertise: ['UX Design', 'UI Design', 'Figma'],
    bio: 'Lead UX/UI designer with experience at top tech companies. Passionate about creating accessible and beautiful digital experiences.',
    availability: 'Available Tue-Thu',
    status: 'pending',
    students: 0,
    rating: 0,
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    expertise: ['AI', 'Machine Learning', 'Computer Vision'],
    bio: 'AI researcher with focus on computer vision and deep learning. Previously worked at Google AI and published papers at top conferences.',
    availability: 'Available evenings',
    status: 'pending',
    students: 0,
    rating: 0,
  },
];

// Mock applications
const mockApplications = [
  {
    id: '1',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    expertise: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
    experience: '15+ years in cybersecurity, certified ethical hacker with industry certifications.',
    motivation: 'I want to help students understand the critical importance of security in modern software development.',
    status: 'pending',
    submittedAt: '2023-09-10T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Thompson',
    email: 'sarah.thompson@example.com',
    expertise: ['Digital Marketing', 'SEO', 'Content Strategy'],
    experience: '10 years as marketing executive, helped scale multiple startups.',
    motivation: 'Passionate about teaching the next generation of marketers how to thrive in the digital landscape.',
    status: 'pending',
    submittedAt: '2023-09-15T14:15:00Z',
  },
];

const MentorManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [mentors, setMentors] = useState(mockMentors);
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [addMentorDialogOpen, setAddMentorDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  
  const isAuthorized = isAuthenticated && user?.role === 'mentor_admin';
  
  if (!isAuthorized) {
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
                    You need to be logged in as an admin to access this page.
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

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApproveMentor = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      // Add to mentors list
      const newMentor = {
        id: `mentor_${Date.now()}`,
        name: application.name,
        email: application.email,
        expertise: application.expertise,
        bio: application.experience,
        availability: 'Not specified',
        status: 'active',
        students: 0,
        rating: 0,
      };
      setMentors([...mentors, newMentor]);
      
      // Remove from applications
      setApplications(applications.filter(app => app.id !== applicationId));
      
      toast({
        title: "Mentor approved",
        description: `${application.name} has been approved as a mentor`,
      });
    }
  };

  const handleRejectApplication = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    setApplications(applications.filter(app => app.id !== applicationId));
    
    if (application) {
      toast({
        title: "Application rejected",
        description: `${application.name}'s application has been rejected`,
      });
    }
  };

  const handleViewMentor = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    if (mentor) {
      setSelectedMentor(mentor);
      setAddMentorDialogOpen(true);
    }
  };

  const handleAddMentor = () => {
    // Implementation for adding a mentor manually
    toast({
      title: "Not implemented",
      description: "This feature is not implemented in the demo",
    });
    setAddMentorDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Mentor Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Approve, manage, and monitor mentors
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Search mentors..." 
                  className="pl-10 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => {
                setSelectedMentor(null);
                setAddMentorDialogOpen(true);
              }}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Mentor
              </Button>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Mentors</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="applications">New Applications {applications.length > 0 && `(${applications.length})`}</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Active Mentors</h2>
                <div className="space-y-4">
                  {filteredMentors
                    .filter(mentor => mentor.status === 'active')
                    .map((mentor) => (
                      <Card key={mentor.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-4 md:mb-0 md:pr-6">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 rounded-full p-2">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium">{mentor.name}</h3>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Mail className="h-3 w-3 mr-1" /> {mentor.email}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1">
                                {mentor.expertise.map((exp, i) => (
                                  <Badge key={i} variant="secondary">{exp}</Badge>
                                ))}
                              </div>
                              <p className="text-sm mt-3">{mentor.bio}</p>
                              <div className="flex flex-wrap gap-x-6 mt-3 text-sm">
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{mentor.students} students</span>
                                </div>
                                {mentor.rating > 0 && (
                                  <div className="flex items-center">
                                    <div className="flex mr-1">
                                      {[...Array(5)].map((_, i) => (
                                        <svg 
                                          key={i} 
                                          className={`w-4 h-4 ${i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                          fill="currentColor" 
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <span>{mentor.rating}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-muted-foreground">{mentor.availability}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewMentor(mentor.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                  
                  {filteredMentors.filter(mentor => mentor.status === 'active').length === 0 && (
                    <Card>
                      <CardContent className="py-6">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            No active mentors found.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Pending Approval</h2>
                <div className="space-y-4">
                  {filteredMentors
                    .filter(mentor => mentor.status === 'pending')
                    .map((mentor) => (
                      <Card key={mentor.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-4 md:mb-0 md:pr-6">
                              <h3 className="text-lg font-medium">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.email}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {mentor.expertise.map((exp, i) => (
                                  <Badge key={i} variant="secondary">{exp}</Badge>
                                ))}
                              </div>
                              <p className="text-sm mt-2">{mentor.bio}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewMentor(mentor.id)}
                              >
                                View Profile
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  setMentors(mentors.filter(m => m.id !== mentor.id));
                                  toast({
                                    title: "Mentor rejected",
                                    description: `${mentor.name} has been rejected`,
                                  });
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setMentors(mentors.map(m => 
                                    m.id === mentor.id ? {...m, status: 'active'} : m
                                  ));
                                  toast({
                                    title: "Mentor approved",
                                    description: `${mentor.name} has been approved`,
                                  });
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                  
                  {filteredMentors.filter(mentor => mentor.status === 'pending').length === 0 && (
                    <Card>
                      <CardContent className="py-6">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            No pending mentor approvals.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">New Applications</h2>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-4 md:mb-0 md:pr-6">
                              <h3 className="text-lg font-medium">{application.name}</h3>
                              <p className="text-sm text-muted-foreground">{application.email}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {application.expertise.map((exp, i) => (
                                  <Badge key={i} variant="secondary">{exp}</Badge>
                                ))}
                              </div>
                              <div className="mt-3 space-y-2">
                                <div>
                                  <h4 className="text-sm font-medium">Experience:</h4>
                                  <p className="text-sm">{application.experience}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">Motivation:</h4>
                                  <p className="text-sm">{application.motivation}</p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Applied on {new Date(application.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRejectApplication(application.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleApproveMentor(application.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
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
                        <p className="text-muted-foreground">
                          No new applications to review.
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

      <Dialog open={addMentorDialogOpen} onOpenChange={setAddMentorDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMentor ? `Edit Mentor: ${selectedMentor.name}` : "Add New Mentor"}
            </DialogTitle>
            <DialogDescription>
              {selectedMentor 
                ? "Make changes to the mentor's information." 
                : "Fill in the details to add a new mentor to the platform."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input 
                id="name" 
                className="col-span-3"
                defaultValue={selectedMentor?.name || ''} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input 
                id="email" 
                type="email"
                className="col-span-3"
                defaultValue={selectedMentor?.email || ''} 
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="expertise" className="text-right text-sm font-medium pt-2">
                Expertise
              </label>
              <div className="col-span-3">
                <Select defaultValue="select">
                  <SelectTrigger>
                    <SelectValue placeholder="Select expertise area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Select expertise area</SelectItem>
                    <SelectItem value="webdev">Web Development</SelectItem>
                    <SelectItem value="dataScience">Data Science</SelectItem>
                    <SelectItem value="design">UI/UX Design</SelectItem>
                    <SelectItem value="ai">AI & Machine Learning</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                  </SelectContent>
                </Select>
                {selectedMentor && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedMentor.expertise.map((exp: string, i: number) => (
                      <Badge key={i} variant="secondary">{exp}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="bio" className="text-right text-sm font-medium pt-2">
                Bio
              </label>
              <Textarea 
                id="bio" 
                className="col-span-3 min-h-[100px]"
                defaultValue={selectedMentor?.bio || ''}
                placeholder="Professional background, teaching experience, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="availability" className="text-right text-sm font-medium">
                Availability
              </label>
              <Input 
                id="availability" 
                className="col-span-3"
                defaultValue={selectedMentor?.availability || ''}
                placeholder="e.g., Weekdays, evenings, etc." 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddMentorDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMentor}>
              {selectedMentor ? "Save Changes" : "Add Mentor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MentorManagement;
