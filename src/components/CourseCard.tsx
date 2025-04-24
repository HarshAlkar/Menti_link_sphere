
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  category: string;
  thumbnail?: string;
  description: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  instructor,
  category,
  thumbnail,
  description,
}) => {
  return (
    <Link to={`/courses/${id}`}>
      <Card className="h-full course-card overflow-hidden">
        <div className="aspect-video w-full relative overflow-hidden">
          <img
            src={thumbnail || '/placeholder.svg'}
            alt={title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-mentor hover:bg-mentor-dark">{category}</Badge>
          </div>
        </div>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={instructor.avatar} alt={instructor.name} />
              <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{instructor.name}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
