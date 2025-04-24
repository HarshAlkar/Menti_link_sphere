import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Video, BookOpen, ClipboardList } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CourseUpdate {
  id: string;
  type: 'material' | 'quiz' | 'video' | 'assignment';
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  createdAt: Date;
  url?: string;
}

interface CourseUpdatesProps {
  updates: CourseUpdate[];
  onUpdateClick?: (update: CourseUpdate) => void;
}

const getUpdateIcon = (type: CourseUpdate['type']) => {
  switch (type) {
    case 'material':
      return <FileText className="h-5 w-5" />;
    case 'quiz':
      return <ClipboardList className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'assignment':
      return <BookOpen className="h-5 w-5" />;
    default:
      return null;
  }
};

const getUpdateTypeLabel = (type: CourseUpdate['type']) => {
  switch (type) {
    case 'material':
      return 'New Material';
    case 'quiz':
      return 'New Quiz';
    case 'video':
      return 'New Video Lesson';
    case 'assignment':
      return 'New Assignment';
    default:
      return 'Update';
  }
};

export const CourseUpdates: React.FC<CourseUpdatesProps> = ({ updates, onUpdateClick }) => {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <Card 
          key={update.id}
          className="hover:bg-accent cursor-pointer transition-colors"
          onClick={() => onUpdateClick?.(update)}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              {getUpdateIcon(update.type)}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{update.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {getUpdateTypeLabel(update.type)} in {update.courseName}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{update.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 