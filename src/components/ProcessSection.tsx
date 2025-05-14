
import React from 'react';
import { Check } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    "Meeting and formally offering the proposal",
    "Acknowledgment and signing of contracts",
    "Research and data analysis",
    "Creating the first mockup and approval",
    "Proceed with building the app using wireframes",
    "Create the front-end technology of the app",
    "Improve visual UI design",
    "Produce the backend technology of the app",
    "Perform UX (User Experience) QA Testing",
    "Perform further testing with the client",
    "Launch the app in the App Store and Play Store",
    "Launch the landing page"
  ];

  return (
    <section id="process" className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Development Process</h2>
          <p className="text-gray-500">
            We follow a structured approach to ensure high-quality app development with consistent communication
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-gray-100"
            >
              <div className="bg-brand-purple/10 rounded-full p-1 mr-3">
                <Check className="h-4 w-4 text-brand-purple" />
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2 text-brand-purple">{index + 1}.</span>
                <span className="text-gray-700">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
