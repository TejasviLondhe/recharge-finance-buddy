
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ProcessSection from '../components/ProcessSection';
import AboutSection from '../components/AboutSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection />
        <ProcessSection />
        <AboutSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
