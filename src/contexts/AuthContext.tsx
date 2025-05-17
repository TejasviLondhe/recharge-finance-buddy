
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../integrations/supabase/client';
import { firebaseAuth } from '@/integrations/firebase/client';
import { onAuthStateChanged as firebaseOnAuthStateChanged } from 'firebase/auth';
import { Session, User } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign out function from both Firebase and Supabase
  const signOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Sign out from Firebase if it's initialized
      if (firebaseAuth) {
        await firebaseAuth.signOut();
      }
      
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  // Refresh session function
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error: any) {
      toast.error(error.message || "Error refreshing session");
    }
  };

  // Setup auth listeners for both Firebase and Supabase
  useEffect(() => {
    // Set up Supabase auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Supabase auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Set up Firebase auth state listener
    const firebaseUnsubscribe = firebaseOnAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        console.log("Firebase auth state changed:", firebaseUser ? "SIGNED_IN" : "SIGNED_OUT");
        // If Firebase user exists but no Supabase session, we can authenticate with Supabase here
        // This is handled in the useFirebaseAuth hook for now
      }
    );

    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      firebaseUnsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
