import { TestContent } from '@/components/course/TestContent';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestContent {
  id: string;
  type: 'document' | 'video';
  title: string;
  description: string;
  url: string;
  createdAt: Date;
}

export default function TestPage() {
  const [content, setContent] = useState<TestContent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContent, setNewContent] = useState<Partial<TestContent>>({
    type: 'document',
    title: '',
    description: '',
    url: ''
  });

  useEffect(() => {
    // Load initial content
    const initialContent: TestContent[] = [
      {
        id: '1',
        type: 'document',
        title: 'Sample Document',
        description: 'This is a sample document for testing.',
        url: '/sample.pdf',
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'video',
        title: 'Sample Video',
        description: 'This is a sample video for testing.',
        url: '/sample.mp4',
        createdAt: new Date()
      }
    ];
    setContent(initialContent);
  }, []);

  const handleAddContent = () => {
    if (newContent.title && newContent.description && newContent.url) {
      const contentToAdd: TestContent = {
        id: Date.now().toString(),
        type: newContent.type as 'document' | 'video',
        title: newContent.title,
        description: newContent.description,
        url: newContent.url,
        createdAt: new Date()
      };
      setContent([contentToAdd, ...content]);
      setNewContent({
        type: 'document',
        title: '',
        description: '',
        url: ''
      });
      setIsDialogOpen(false);
    }
  };

  const handleDownload = (item: TestContent) => {
    // Implement download logic
    console.log('Downloading:', item);
    window.open(item.url, '_blank');
  };

  const handleView = (item: TestContent) => {
    // Implement view logic
    console.log('Viewing:', item);
    window.open(item.url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test Content</h2>
          <p className="text-muted-foreground">
            View and manage test documents and videos.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newContent.type}
                  onValueChange={(value) => setNewContent({ ...newContent, type: value as 'document' | 'video' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={newContent.url}
                  onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                  placeholder="Enter URL"
                />
              </div>
              <Button onClick={handleAddContent} className="w-full">
                Add Content
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <TestContent
        content={content}
        onDownload={handleDownload}
        onView={handleView}
      />
    </div>
  );
} 