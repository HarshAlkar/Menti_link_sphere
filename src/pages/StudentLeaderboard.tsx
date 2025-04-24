
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock leaderboard data
const mockLeaderboardData = [
  { rank: 1, name: 'Emma Johnson', points: 1250, streak: 48, badges: ['All-star', 'Course Master', 'Problem Solver'] },
  { rank: 2, name: 'Alex Chen', points: 1180, streak: 36, badges: ['Quick Learner', 'Problem Solver'] },
  { rank: 3, name: 'Michael Brown', points: 1050, streak: 52, badges: ['Consistent', 'Team Player'] },
  { rank: 4, name: 'Sarah Davis', points: 985, streak: 28, badges: ['Code Wizard', 'Course Master'] },
  { rank: 5, name: 'HARSH', points: 940, streak: 21, badges: ['Rising Star'] },
  { rank: 6, name: 'David Kim', points: 890, streak: 19, badges: ['Fast Learner'] },
  { rank: 7, name: 'Jessica Wang', points: 845, streak: 26, badges: ['Dedicated Learner'] },
  { rank: 8, name: 'John Smith', points: 820, streak: 15, badges: ['Course Completer'] },
  { rank: 9, name: 'MAITREYA CHANNE', points: 780, streak: 23, badges: ['Problem Solver'] },
  { rank: 10, name: 'SHALAKA SONAWANE', points: 750, streak: 18, badges: ['Quick Learner'] },
];

// Mock achievement data
const mockTopAchievements = [
  { name: 'Course Master', count: 32, description: 'Complete 5 courses with 90% or higher' },
  { name: 'Problem Solver', count: 28, description: 'Solve 50 challenging problems' },
  { name: 'Quick Learner', count: 26, description: 'Complete course sections ahead of schedule' },
  { name: 'Consistent', count: 24, description: 'Maintain a 30+ day learning streak' },
];

const StudentLeaderboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <div className="container py-8 px-4 md:px-6">
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                  <p className="text-muted-foreground">
                    Please log in to view the leaderboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Find current user's rank
  const currentUserRank = mockLeaderboardData.find(item => item.name === user?.username)?.rank || '—';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow bg-gray-50">
        <div className="container py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Student Leaderboard
              </h1>
              <p className="text-muted-foreground mt-1">
                See how you compare to other students
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-amber-700">
                  <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">#{currentUserRank}</div>
                <p className="text-sm text-amber-600 mt-1">Keep learning to improve your rank!</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-blue-700">
                  <Star className="mr-2 h-5 w-5 text-blue-500" />
                  Your Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">
                  {mockLeaderboardData.find(item => item.name === user?.username)?.points || 0}
                </div>
                <p className="text-sm text-blue-600 mt-1">Earn more by completing courses and challenges</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center text-green-700">
                  <Award className="mr-2 h-5 w-5 text-green-500" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">
                  {mockLeaderboardData.find(item => item.name === user?.username)?.streak || 0} days
                </div>
                <p className="text-sm text-green-600 mt-1">Your longest continuous learning streak</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead className="hidden md:table-cell">Streak</TableHead>
                        <TableHead className="hidden md:table-cell">Badges</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeaderboardData.map((student) => (
                        <TableRow key={student.rank} className={student.name === user?.username ? "bg-primary/10" : ""}>
                          <TableCell className="font-medium">
                            {student.rank <= 3 ? (
                              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-amber-100 text-amber-700">
                                {student.rank}
                              </div>
                            ) : (
                              <div className="pl-3">{student.rank}</div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-muted-foreground" />
                              {student.name} {student.name === user?.username ? "(You)" : ""}
                            </div>
                          </TableCell>
                          <TableCell>{student.points}</TableCell>
                          <TableCell className="hidden md:table-cell">{student.streak} days</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {student.badges.map((badge, i) => (
                                <Badge key={i} variant="outline">{badge}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Top Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTopAchievements.map((achievement, i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        <div className="bg-primary/10 rounded-full p-2 mt-0.5">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Earned by {achievement.count} students</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentLeaderboard;
