
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: '',
      phone_number: '',
    },
  });

  // Load user profile data
  useEffect(() => {
    if (user && isOpen) {
      const userData = {
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        phone_number: user.phone || '',
      };
      
      setProfileData(userData);
      form.reset({
        full_name: userData.full_name,
        phone_number: userData.phone_number || '',
      });
    }
  }, [user, isOpen, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update Supabase user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: values.full_name,
        }
      });

      if (error) throw error;

      await refreshSession();
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
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
                <AvatarFallback className="bg-emerald-100">
                  <User className="h-12 w-12 text-emerald-500" />
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-sm text-gray-500">Profile picture from your authentication provider</p>
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
                      <Input 
                        placeholder="Your phone number" 
                        {...field} 
                        value={field.value || ''} 
                        disabled 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">Phone number is managed by your authentication provider</p>
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
