
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.username || '');
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateProfile = () => {
    updateUserProfile({
      username,
      avatar: profileImage,
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage} alt="Profile" />
              <AvatarFallback className="bg-gray-200">
                {user?.username?.charAt(0) || <User />}
              </AvatarFallback>
            </Avatar>
            <Button 
              type="button" 
              size="icon" 
              variant="outline" 
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-primary text-white hover:bg-primary/90"
              onClick={triggerFileInput}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Click the camera icon to upload a new profile picture
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={user?.email} 
            disabled 
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input 
            id="role" 
            value={user?.role} 
            disabled 
          />
          <p className="text-xs text-muted-foreground">
            Role cannot be changed
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateProfile} className="w-full">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;
