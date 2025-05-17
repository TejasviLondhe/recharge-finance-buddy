
import { useState, useEffect } from 'react';
import { PhoneAuthProvider, RecaptchaVerifier, signInWithCredential, signOut } from 'firebase/auth';
import { firebaseAuth } from '@/integrations/firebase/client';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useFirebaseAuth = () => {
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Initialize reCAPTCHA verifier
  const initRecaptcha = (containerId: string) => {
    if (!recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log("reCAPTCHA verified");
          },
          'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            toast.error("reCAPTCHA expired. Please try again.");
          }
        });
        setRecaptchaVerifier(verifier);
        return verifier;
      } catch (error: any) {
        console.error("reCAPTCHA initialization error:", error);
        toast.error(`reCAPTCHA error: ${error.message}`);
        return null;
      }
    }
    return recaptchaVerifier;
  };

  // Send verification code
  const sendVerificationCode = async (phoneNumber: string, containerId: string) => {
    setLoading(true);
    
    try {
      const verifier = initRecaptcha(containerId);
      if (!verifier) {
        throw new Error("Could not initialize reCAPTCHA");
      }

      const provider = new PhoneAuthProvider(firebaseAuth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, verifier);
      
      setVerificationId(verificationId);
      toast.success("Verification code sent!");
      return true;
    } catch (error: any) {
      console.error("Send code error:", error);
      toast.error(`Error sending code: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and sign in
  const verifyOtp = async (otp: string) => {
    setLoading(true);
    
    try {
      if (!verificationId) {
        throw new Error("No verification ID found. Please request a new code.");
      }

      // Create credential with verification ID and OTP
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      
      // Sign in with credential
      const userCredential = await signInWithCredential(firebaseAuth, credential);
      const user = userCredential.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Sign in to Supabase with custom token
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'phone',
        token: idToken,
      });
      
      if (error) throw error;
      
      toast.success("Phone number verified successfully!");
      return true;
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(`Verification failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign out from both Firebase and Supabase
  const signOutUser = async () => {
    try {
      await signOut(firebaseAuth);
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [recaptchaVerifier]);

  return {
    sendVerificationCode,
    verifyOtp,
    signOutUser,
    loading,
    verificationId,
  };
};
