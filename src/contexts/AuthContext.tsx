
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { firebaseAuth } from '../integrations/firebase/client';
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: User | null; // For compatibility with existing code
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    }
  };

  // Refresh session function
  const refreshSession = async () => {
    try {
      await firebaseAuth.currentUser?.reload();
      setUser(firebaseAuth.currentUser);
    } catch (error: any) {
      console.error('Error refreshing session:', error);
    }
  };

  // Setup auth listeners for Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log("Firebase auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session: user, // For compatibility 
      loading, 
      signOut,
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
