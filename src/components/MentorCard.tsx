
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

interface MentorCardProps {
  id: string;
  name: string;
  expertise: string[];
  avatar?: string;
  bio: string;
  availability: string;
}

const MentorCard: React.FC<MentorCardProps> = ({
  id,
  name,
  expertise,
  avatar,
  bio,
  availability,
}) => {
  return (
    <Card className="h-full mentor-card">
      <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {expertise.slice(0, 2).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {expertise.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{expertise.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{bio}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>{availability}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/mentors/${id}`}>Profile</Link>
        </Button>
        <Button size="sm" className="flex-1 bg-mentor hover:bg-mentor-dark" asChild>
          <Link to={`/mentors/${id}/request`}>Request</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
