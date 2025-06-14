
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EmailAuth from '@/components/auth/EmailAuth';
import SupabasePhoneAuth from '@/components/auth/SupabasePhoneAuth';

type AuthMode = 'email' | 'phone';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('email');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8 flex flex-col items-center justify-center">
      {mode === 'email' ? (
        <EmailAuth onSwitchToPhone={() => setMode('phone')} />
      ) : (
        <SupabasePhoneAuth onBackToEmail={() => setMode('email')} />
      )}
    </div>
  );
};

export default Auth;
