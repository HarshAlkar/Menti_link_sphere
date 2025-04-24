import { CourseUpdates } from '@/components/course/CourseUpdates';
import { courseUpdatesService } from '@/services/courseUpdates';
import { useEffect, useState } from 'react';
import { CourseUpdate } from '@/services/courseUpdates';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const [updates, setUpdates] = useState<CourseUpdate[]>([]);
  const courseId = params.id;

  useEffect(() => {
    const unsubscribe = courseUpdatesService.subscribe((newUpdates) => {
      const courseUpdates = newUpdates.filter(update => update.courseId === courseId);
      setUpdates(courseUpdates);
    });

    return () => {
      unsubscribe();
    };
  }, [courseId]);

  const handleUpdateClick = (update: CourseUpdate) => {
    // Navigate to the specific content based on type
    switch (update.type) {
      case 'material':
        window.location.href = `/courses/${courseId}/materials/${update.id}`;
        break;
      case 'quiz':
        window.location.href = `/courses/${courseId}/quizzes/${update.id}`;
        break;
      case 'video':
        window.location.href = `/courses/${courseId}/videos/${update.id}`;
        break;
      case 'assignment':
        window.location.href = `/courses/${courseId}/assignments/${update.id}`;
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Course Updates</h2>
        <p className="text-muted-foreground">
          Stay up to date with the latest course content and activities.
        </p>
      </div>

      <div className="grid gap-4">
        <CourseUpdates 
          updates={updates} 
          onUpdateClick={handleUpdateClick}
        />
      </div>
    </div>
  );
} 