
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EmailAuth from '@/components/auth/EmailAuth';
import PhoneAuth from '@/components/auth/PhoneAuth';

type AuthMode = 'email' | 'phone';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('email');
  const navigate = useNavigate();
  const { session } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8 flex flex-col items-center justify-center">
      {mode === 'email' ? (
        <EmailAuth onSwitchToPhone={() => setMode('phone')} />
      ) : (
        <PhoneAuth onBackToEmail={() => setMode('email')} />
      )}
    </div>
  );
};

export default Auth;
