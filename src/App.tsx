import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import CourseLearningPage from "./pages/CourseLearningPage";
import Mentors from "./pages/Mentors";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MentorRequest from "./pages/MentorRequest";
import MentorSession from "./pages/MentorSession";
import MentorDashboard from "./pages/MentorDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import MentorAdminDashboard from "./pages/MentorAdminDashboard";
import CourseManagement from "./pages/CourseManagement";
import MentorManagement from "./pages/MentorManagement";
import DocumentPage from "./pages/DocumentPage";
import StudentLeaderboard from "./pages/StudentLeaderboard";
import VideoSession from "./pages/VideoSession";
import QuizPage from "./pages/QuizPage";
import AssignmentPage from "./pages/AssignmentPage";
import Certificates from "./pages/Certificates";
import APITest from './components/APITest';
import MentorList from './components/MentorList';
import CourseLearningPage1 from "./pages/CourseLearningPage1";
import CourseLearningPage2 from "./pages/CourseLearningPage2";
import ChatBot from "./components/ChatBot";
const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/courses/:id/learn" element={<CourseLearningPage />} />
            <Route path="/courses/1" element={<CourseLearningPage1 />} />
            <Route path="/courses/2" element={<CourseLearningPage2 />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/mentors/:id/request" element={<MentorRequest />} />
            <Route path="/mentors/:id/session" element={<MentorSession />} />
            
            {/* Role-specific routes */}
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
            <Route path="/mentor-admin/dashboard" element={<MentorAdminDashboard />} />
            
            {/* Course and content management routes */}
            <Route path="/course-management" element={<CourseManagement />} />
            <Route path="/mentor-management" element={<MentorManagement />} />

            {/* Content type routes */}
            <Route path="/document/:documentId" element={<DocumentPage />} />
            <Route path="/video-session/:sessionId" element={<VideoSession />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/assignment/:assignmentId" element={<AssignmentPage />} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
