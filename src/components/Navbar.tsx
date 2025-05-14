
import React from 'react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-10 bg-white/90 backdrop-blur-sm border-b">
      <div className="container flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            Sahind Technologies
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Features
          </a>
          <a href="#howitworks" className="text-sm font-medium hover:text-brand-purple transition-colors">
            How It Works
          </a>
          <a href="#process" className="text-sm font-medium hover:text-brand-purple transition-colors">
            Process
          </a>
          <a href="#about" className="text-sm font-medium hover:text-brand-purple transition-colors">
            About Us
          </a>
        </div>

        <div>
          <Button className="bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 transition-opacity">
            Download App
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
