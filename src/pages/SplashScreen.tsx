
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // After 3 seconds, navigate to the onboarding screen
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-emerald-500 dark:bg-emerald-700">
      <div className="relative">
        <div className="absolute left-0 top-0 w-16 h-16 bg-black rounded-full"></div>
        <div className="absolute right-0 top-0 w-16 h-16 bg-white rounded-full flex items-center justify-center ml-8">
          <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-5xl font-bold text-white mt-20 mb-2">You PI</h1>
      <p className="text-white text-lg">Your Best Money Transfer Partner.</p>
    </div>
  );
};

export default SplashScreen;
