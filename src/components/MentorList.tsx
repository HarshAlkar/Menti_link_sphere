import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MentorForm from './MentorForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Mentor {
  id: number;
  name: string;
  expertise: string;
  bio: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export default function MentorList() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<Mentor | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/mentors/');
      if (!response.ok) throw new Error('Failed to fetch mentors');
      const data = await response.json();
      setMentors(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load mentors');
      setLoading(false);
    }
  };

  const handleCreateMentor = async (mentor: Omit<Mentor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/mentors/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mentor),
      });
      if (!response.ok) throw new Error('Failed to create mentor');
      await fetchMentors();
      setIsFormOpen(false);
    } catch (err) {
      setError('Failed to create mentor');
    }
  };

  const handleUpdateMentor = async (mentor: Mentor) => {
    try {
      const response = await fetch(`/api/mentors/${mentor.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mentor),
      });
      if (!response.ok) throw new Error('Failed to update mentor');
      await fetchMentors();
      setIsFormOpen(false);
      setSelectedMentor(null);
    } catch (err) {
      setError('Failed to update mentor');
    }
  };

  const handleDeleteMentor = async () => {
    if (!mentorToDelete) return;
    try {
      const response = await fetch(`/api/mentors/${mentorToDelete.id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete mentor');
      await fetchMentors();
      setIsDeleteDialogOpen(false);
      setMentorToDelete(null);
    } catch (err) {
      setError('Failed to delete mentor');
    }
  };

  if (loading) return <div>Loading mentors...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mentors</h2>
        <Button onClick={() => {
          setSelectedMentor(null);
          setIsFormOpen(true);
        }}>
          Add New Mentor
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentors.map((mentor) => (
            <TableRow key={mentor.id}>
              <TableCell>{mentor.name}</TableCell>
              <TableCell>{mentor.expertise}</TableCell>
              <TableCell>{mentor.email}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setIsFormOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setMentorToDelete(mentor);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MentorForm
        mentor={selectedMentor || undefined}
        onSubmit={selectedMentor ? handleUpdateMentor : handleCreateMentor}
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the mentor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMentor}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 