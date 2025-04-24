import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TestContent {
  id: string;
  type: 'document' | 'video';
  title: string;
  description: string;
  url: string;
  createdAt: Date;
}

interface TestContentProps {
  content: TestContent[];
  onDownload?: (content: TestContent) => void;
  onView?: (content: TestContent) => void;
}

export const TestContent: React.FC<TestContentProps> = ({ content, onDownload, onView }) => {
  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card key={item.id} className="hover:bg-accent transition-colors">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              {item.type === 'document' ? (
                <FileText className="h-5 w-5" />
              ) : (
                <Video className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {item.type === 'document' ? 'Document' : 'Video'}
              </p>
            </div>
            <div className="flex gap-2">
              {item.type === 'document' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload?.(item)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={() => onView?.(item)}
              >
                View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 