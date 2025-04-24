import { CourseUpdates } from '@/components/course/CourseUpdates';
import { courseUpdatesService } from '@/services/courseUpdates';
import { useEffect, useState } from 'react';
import { CourseUpdate } from '@/services/courseUpdates';

export default function DashboardPage() {
  const [updates, setUpdates] = useState<CourseUpdate[]>([]);

  useEffect(() => {
    const unsubscribe = courseUpdatesService.subscribe((newUpdates) => {
      setUpdates(newUpdates);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateClick = (update: CourseUpdate) => {
    // Navigate to the course or specific content
    window.location.href = `/courses/${update.courseId}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here are the latest updates from your courses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full">
          <h3 className="text-lg font-medium mb-4">Recent Course Updates</h3>
          <CourseUpdates 
            updates={updates.slice(0, 5)} 
            onUpdateClick={handleUpdateClick}
          />
        </div>
      </div>
    </div>
  );
} 