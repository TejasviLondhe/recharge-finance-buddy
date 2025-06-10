
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useSupabaseAuth = () => {
  const [loading, setLoading] = useState(false);

  // Send OTP via Supabase (which uses Twilio)
  const sendOtp = async (phoneNumber: string) => {
    setLoading(true);
    
    try {
      // Format phone number to E.164 format
      let formattedNumber = phoneNumber;
      if (!formattedNumber.startsWith('+')) {
        formattedNumber = `+${formattedNumber}`;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedNumber,
      });

      if (error) throw error;
      
      toast.success("OTP sent to your phone");
      return true;
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast.error(`Error sending OTP: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (phoneNumber: string, otp: string) => {
    setLoading(true);
    
    try {
      // Format phone number to E.164 format
      let formattedNumber = phoneNumber;
      if (!formattedNumber.startsWith('+')) {
        formattedNumber = `+${formattedNumber}`;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedNumber,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;
      
      toast.success("Phone number verified successfully");
      return true;
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast.error(`Verification failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  return {
    sendOtp,
    verifyOtp,
    signOutUser,
    loading,
  };
};
