
import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Sahind Technologies</h3>
            <p className="text-sm text-gray-400 mb-6">
              Creating high-quality, affordable, and flexible software solutions for computer, mobile, and web applications.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#howitworks" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-white transition-colors">Our Process</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Phone size={16} className="mr-2 mt-0.5" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-start">
                <Mail size={16} className="mr-2 mt-0.5" />
                <span>contact@sahindtechnologies.com</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-0.5" />
                <span>123 Tech Park, Bengaluru, Karnataka, India</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Download App</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get our mobile recharge app with EMI option on your smartphone now.
            </p>
            <div className="flex flex-col space-y-2">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded text-sm flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6l18 0"></path>
                  <path d="M3 12l18 0"></path>
                  <path d="M3 18l18 0"></path>
                </svg>
                Google Play Store
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-500">
          <p>© {currentYear} Sahind Technologies Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
