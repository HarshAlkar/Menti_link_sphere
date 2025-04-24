
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, Users, Home, Menu, X, User, LogOut, Award, BarChart4, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get role-specific dashboard link
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'mentor':
        return '/mentor/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'mentor_admin':
        return '/mentor-admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-mentor to-mentee rounded-md p-1">
              <div className="bg-white rounded-sm p-1">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-mentor to-mentee">
                  ML
                </span>
              </div>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">MentorLink Sphere</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/courses" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link to="/mentors" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Users size={18} />
              <span>Mentors</span>
            </Link>
            <Link to="/schedule" className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Calendar size={18} />
              <span>Schedule</span>
            </Link>
            {isAuthenticated && user?.role === 'student' && (
              <Link to="/student/leaderboard" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Award size={18} />
                <span>Leaderboard</span>
              </Link>
            )}
            {isAuthenticated && (user?.role === 'teacher' || user?.role === 'mentor_admin') && (
              <Link to="/course-management" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <Settings size={18} />
                <span>Manage Courses</span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'mentor_admin' && (
              <Link to="/mentor-management" className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <BarChart4 size={18} />
                <span>Manage Mentors</span>
              </Link>
            )}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <Link to={getDashboardLink()} className="text-sm font-medium hover:text-primary">
                  Dashboard
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="/placeholder.svg" alt={user?.username} />
                    <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer flex w-full items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-mentor to-mentee hover:from-mentor-dark hover:to-mentee-dark" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="animate-fade-in absolute top-16 left-0 right-0 bg-white shadow-md z-50 border-b">
          <nav className="flex flex-col py-4">
            <Link 
              to="/" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/courses" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <BookOpen size={18} />
              <span>Courses</span>
            </Link>
            <Link 
              to="/mentors" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <Users size={18} />
              <span>Mentors</span>
            </Link>
            <Link 
              to="/schedule" 
              className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
              onClick={toggleMobileMenu}
            >
              <Calendar size={18} />
              <span>Schedule</span>
            </Link>
            
            {isAuthenticated && user?.role === 'student' && (
              <Link 
                to="/student/leaderboard" 
                className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
                onClick={toggleMobileMenu}
              >
                <Award size={18} />
                <span>Leaderboard</span>
              </Link>
            )}
            
            {isAuthenticated && (user?.role === 'teacher' || user?.role === 'mentor_admin') && (
              <Link 
                to="/course-management" 
                className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
                onClick={toggleMobileMenu}
              >
                <Settings size={18} />
                <span>Manage Courses</span>
              </Link>
            )}
            
            {isAuthenticated && user?.role === 'mentor_admin' && (
              <Link 
                to="/mentor-management" 
                className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
                onClick={toggleMobileMenu}
              >
                <BarChart4 size={18} />
                <span>Manage Mentors</span>
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <Home size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button 
                  className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2 w-full text-left text-destructive"
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-6 py-3 text-sm font-medium hover:bg-muted flex items-center gap-2"
                  onClick={toggleMobileMenu}
                >
                  <span>Sign In</span>
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 text-sm font-medium bg-primary text-white hover:bg-primary/90 flex items-center gap-2 mx-6 justify-center rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
