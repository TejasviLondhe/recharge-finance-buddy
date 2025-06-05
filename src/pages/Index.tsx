
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          {/* Black circle with wallet icon */}
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center relative z-10">
            <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
          {/* Emerald circle overlapping */}
          <div className="w-20 h-20 bg-emerald-500 rounded-full absolute top-0 -right-4"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to</h1>
        <h2 className="text-5xl font-bold text-emerald-500 mb-6">You PI</h2>
        <p className="text-gray-600 text-lg mb-12">Your Best Telecom Recharge Partner.</p>
        
        {/* Get Started Button */}
        <Button 
          onClick={() => navigate('/onboarding')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 text-lg rounded-full font-medium"
        >
          Get Started
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-400 text-sm">Secured by You PI</p>
      </div>
    </div>
  );
};

export default Index;
