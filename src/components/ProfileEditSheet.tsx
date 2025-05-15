
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(50),
  phone_number: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditSheet({ isOpen, onClose }: ProfileEditSheetProps) {
  const { user, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<{ full_name: string; phone_number: string | null }>({
    full_name: '',
    phone_number: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      phone_number: '',
    },
  });

  // Load user profile data
  useEffect(() => {
    async function loadProfile() {
      if (user) {
        setLoading(true);
        try {
          // Get profile data
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, phone_number')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            setProfileData(data);
            form.reset({
              full_name: data.full_name || '',
              phone_number: data.phone_number || '',
            });
          }

          // Get avatar
          const { data: avatarData } = await supabase
            .storage
            .from('avatars')
            .download(`${user.id}`);

          if (avatarData) {
            const url = URL.createObjectURL(avatarData);
            setAvatarUrl(url);
          }
        } catch (error: any) {
          console.error('Error loading profile:', error.message);
        } finally {
          setLoading(false);
        }
      }
    }

    if (isOpen) {
      loadProfile();
    }
  }, [user, isOpen, form]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          phone_number: values.phone_number || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Upload avatar if changed
      if (avatarFile) {
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(`${user.id}`, avatarFile, {
            upsert: true,
            contentType: avatarFile.type,
          });

        if (uploadError) throw uploadError;
      }

      await refreshSession();
      toast.success('Profile updated successfully');
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        
        <div className="py-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-emerald-100">
                    <User className="h-12 w-12 text-emerald-500" />
                  </AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 text-white cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-sm text-gray-500">Click the edit icon to change your profile picture</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your phone number" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
