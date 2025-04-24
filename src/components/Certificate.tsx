
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface CertificateProps {
  userName: string;
  courseName: string;
  completionDate: Date;
  certificateId: string;
}

const Certificate: React.FC<CertificateProps> = ({
  userName,
  courseName,
  completionDate,
  certificateId,
}) => {
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF certificate
    alert('Certificate download functionality would be implemented here');
  };

  const handleShare = () => {
    // In a real implementation, this would share the certificate
    alert('Certificate sharing functionality would be implemented here');
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-3xl border-2 border-primary/20 my-4">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="border-b border-t border-gray-200 py-6">
              <h1 className="text-3xl font-bold text-primary mb-2">Certificate of Completion</h1>
              <div className="text-lg text-gray-600">MentorLink Learning Platform</div>
            </div>
            
            <div className="py-8 space-y-4">
              <p className="text-lg">This is to certify that</p>
              <h2 className="text-2xl font-bold">{userName}</h2>
              <p className="text-lg">has successfully completed the course</p>
              <h3 className="text-xl font-semibold">{courseName}</h3>
              <p className="text-md text-gray-600">
                on {completionDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500">Certificate ID: {certificateId}</p>
              <p className="text-sm text-gray-500">Verify this certificate at mentorlink.example.com/verify</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4 mt-4">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download size={16} />
          Download Certificate
        </Button>
        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
          <Share2 size={16} />
          Share
        </Button>
      </div>
    </div>
  );
};

export default Certificate;
