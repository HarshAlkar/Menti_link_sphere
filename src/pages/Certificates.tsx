
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Certificate from '@/components/Certificate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, BookOpen } from 'lucide-react';

// Mock certificate data
const mockCertificates = [
  {
    id: 'cert-001',
    courseName: 'Introduction to Web Development',
    completionDate: new Date('2023-10-15'),
    courseId: '1'
  },
  {
    id: 'cert-002',
    courseName: 'Data Science Fundamentals with Python',
    completionDate: new Date('2023-11-05'),
    courseId: '2'
  }
];

// Mock courses in progress
const mockCoursesInProgress = [
  {
    id: '3',
    title: 'UX/UI Design Principles',
    progress: 65,
    estimatedCompletion: '2 weeks'
  },
  {
    id: '4',
    title: 'Machine Learning Essentials',
    progress: 30,
    estimatedCompletion: '1 month'
  }
];

const Certificates = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const viewCertificate = (certId: string) => {
    setSelectedCertificate(certId);
  };

  const closeCertificate = () => {
    setSelectedCertificate(null);
  };

  const getCertificateById = (certId: string) => {
    return mockCertificates.find(cert => cert.id === certId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Your Achievements</h1>
          <p className="text-gray-600 mb-6">Track your progress and showcase your accomplishments</p>
          
          {selectedCertificate ? (
            <div className="mb-6">
              <Button variant="outline" onClick={closeCertificate} className="mb-4">
                Back to Certificates
              </Button>
              
              {(() => {
                const cert = getCertificateById(selectedCertificate);
                if (cert) {
                  return (
                    <Certificate
                      userName={user?.username || 'Student'}
                      courseName={cert.courseName}
                      completionDate={cert.completionDate}
                      certificateId={cert.id}
                    />
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <Tabs defaultValue="certificates">
              <TabsList className="mb-6">
                <TabsTrigger value="certificates">Certificates ({mockCertificates.length})</TabsTrigger>
                <TabsTrigger value="progress">In Progress ({mockCoursesInProgress.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="certificates">
                {mockCertificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockCertificates.map((cert) => (
                      <Card key={cert.id} className="border border-primary/20">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{cert.courseName}</CardTitle>
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <CardDescription>
                            Completed on {cert.completionDate.toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Certificate ID: {cert.id}</span>
                            <Button onClick={() => viewCertificate(cert.id)} size="sm">
                              View Certificate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Award className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
                      <p className="text-gray-500 text-center mb-4">
                        Complete courses to earn your first certificate
                      </p>
                      <Button>Explore Courses</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="space-y-4">
                  {mockCoursesInProgress.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-lg p-2 mt-1">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{course.title}</h3>
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-700">{course.progress}% complete</span>
                                  <span className="text-sm text-gray-500">Est. completion: {course.estimatedCompletion}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" className="shrink-0">Continue Learning</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificates;
