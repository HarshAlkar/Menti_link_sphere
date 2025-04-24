
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ThumbsUp, MessageSquare, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock document data
const mockDocuments = [
  {
    id: 'doc1',
    title: 'Introduction to Web Development',
    courseId: '1',
    fileName: 'Introduction_to_Web_Dev.pdf',
    fileType: 'application/pdf',
    fileSize: '3.2 MB',
    uploadDate: '2023-09-15',
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', // Example public PDF
    author: 'Dr. Maria Garcia',
    description: 'A comprehensive guide to web development basics including HTML, CSS, and JavaScript fundamentals.',
  },
  {
    id: 'doc2',
    title: 'Advanced CSS Techniques',
    courseId: '1',
    fileName: 'Advanced_CSS_Techniques.pdf',
    fileType: 'application/pdf',
    fileSize: '2.8 MB',
    uploadDate: '2023-09-18',
    url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', // Example public PDF
    author: 'Dr. Maria Garcia',
    description: 'Learn advanced CSS techniques including Flexbox, Grid, and CSS animations.',
  },
];

const DocumentPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Simulate loading document
    setLoading(true);
    setTimeout(() => {
      const foundDocument = mockDocuments.find(doc => doc.id === documentId);
      setDocument(foundDocument || null);
      setLoading(false);
    }, 500);
  }, [documentId]);

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
                    Please log in to view this document.
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
                  <h2 className="text-2xl font-bold mb-4">Loading Document...</h2>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
                  <p className="text-muted-foreground mb-6">
                    The document you're looking for doesn't exist or you don't have permission to view it.
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to={`/courses/${document.courseId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Course
              </Link>
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">
                  {document.title}
                </h1>
                <p className="text-muted-foreground">
                  Uploaded by {document.author} • {document.uploadDate} • {document.fileSize}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="mb-6">
                <CardContent className="p-0">
                  <iframe 
                    src={document.url} 
                    className="w-full h-[calc(100vh-300px)] rounded-md border border-border"
                    title={document.title}
                  />
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Document Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="text-sm text-muted-foreground mt-1">{document.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">File Details</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Type: {document.fileType}<br />
                        Size: {document.fileSize}<br />
                        Uploaded: {document.uploadDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockDocuments
                      .filter(doc => doc.id !== documentId && doc.courseId === document.courseId)
                      .map(doc => (
                        <Link to={`/document/${doc.id}`} key={doc.id}>
                          <div className="flex items-center p-2 rounded-md hover:bg-muted transition-colors">
                            <FileText className="h-5 w-5 text-blue-500 mr-3" />
                            <div>
                              <h4 className="text-sm font-medium">{doc.title}</h4>
                              <p className="text-xs text-muted-foreground">{doc.fileSize}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentPage;
