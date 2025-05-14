
import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About Sahind Technologies</h2>
            <p className="text-gray-500 mb-6">
              We create first-rate and superior software for computer, mobile, and web. We produce high-quality software that is affordable and flexible.
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  To produce high-quality, affordable, and flexible service to our clients, making technology accessible to everyone.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To make our clients happy by creating world-class mobile apps that help in their marketing and branding, delivering affordable and flexible services.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Tech Stack for the Recharge App</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-brand-purple mb-2">Frontend</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• React Native</li>
                  <li>• NativeWind</li>
                  <li>• TypeScript</li>
                  <li>• Expo Router</li>
                  <li>• React Hook Form</li>
                  <li>• Zustand</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-brand-purple mb-2">Backend</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Node.js + Express</li>
                  <li>• TypeScript</li>
                  <li>• Prisma ORM</li>
                  <li>• tRPC</li>
                  <li>• MySQL</li>
                  <li>• Zod</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-brand-purple mb-2">Admin Panel</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• React</li>
                <li>• HeroUI</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Vite</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
