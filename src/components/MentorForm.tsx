import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Mentor {
  id?: number;
  name: string;
  expertise: string;
  bio: string;
  email: string;
}

interface MentorFormProps {
  mentor?: Mentor;
  onSubmit: (mentor: Mentor) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MentorForm({ mentor, onSubmit, isOpen, onOpenChange }: MentorFormProps) {
  const [formData, setFormData] = useState<Mentor>({
    name: '',
    expertise: '',
    bio: '',
    email: '',
  });

  useEffect(() => {
    if (mentor) {
      setFormData(mentor);
    }
  }, [mentor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', expertise: '', bio: '', email: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mentor ? 'Edit Mentor' : 'Add New Mentor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise</Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {mentor ? 'Update Mentor' : 'Add Mentor'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 