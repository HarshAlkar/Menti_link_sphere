import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to role-specific dashboards
      switch (user.role) {
        case 'mentor':
          navigate('/mentor/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'mentor_admin':
          navigate('/mentor-admin/dashboard');
          break;
        default:
          // Keep on generic dashboard
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

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
                    Please log in to access your dashboard.
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <div className="container py-8 px-4 md:px-6">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Redirecting...</h2>
                <p className="text-muted-foreground">
                  You're being redirected to your role-specific dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
