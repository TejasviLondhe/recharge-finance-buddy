
import React from 'react';
import { Smartphone, Wallet, CreditCard } from 'lucide-react';

const StepCard = ({ number, icon, title, description }: 
  { number: number; icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple flex items-center justify-center mb-6 text-white text-xl font-bold">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const HowItWorksSection = () => {
  return (
    <section id="howitworks" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-500">
            Enjoy a hassle-free recharge experience with EMI financing in three simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          <div className="absolute top-24 left-0 w-full h-0.5 bg-gradient-to-r from-brand-blue to-brand-purple hidden md:block"></div>
          
          <StepCard 
            number={1}
            icon={<Smartphone className="h-5 w-5 text-brand-purple" />}
            title="Select Your Plan"
            description="Choose from monthly or 3-month recharge plans from all major telecom operators."
          />

          <StepCard 
            number={2}
            icon={<CreditCard className="h-5 w-5 text-brand-purple" />}
            title="Pay First Installment"
            description="Pay only the first installment (e.g., INR 310) to activate your 3-month recharge immediately."
          />

          <StepCard 
            number={3}
            icon={<Wallet className="h-5 w-5 text-brand-purple" />}
            title="Receive Wallet Rewards"
            description="Get INR 40-50 in your NBFC wallet and enjoy your recharge while paying remaining installments monthly."
          />
        </div>

        <div className="mt-12 bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Savings Example</h3>
              <p className="text-gray-600 mb-4">
                For a Jio 349 monthly plan that normally costs INR 1,047 for three months:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-red-100 text-red-600 p-1 rounded mr-2 text-xs">Regular</span>
                  <span>3 months × INR 349 = <span className="line-through">INR 1,047</span></span>
                </li>
                <li className="flex items-center">
                  <span className="bg-green-100 text-green-600 p-1 rounded mr-2 text-xs">Our App</span>
                  <span>3 monthly installments = <span className="font-semibold">INR 900 total</span></span>
                </li>
                <li className="flex items-center mt-2">
                  <span className="bg-purple-100 text-purple-600 p-1 rounded mr-2 text-xs">You Save</span>
                  <span className="font-bold text-green-600">INR 147 + Wallet Rewards</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3">Payment Schedule</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>1st Installment</span>
                  <span className="font-semibold">INR 310</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>2nd Installment</span>
                  <span className="font-semibold">INR 295 <span className="text-xs text-gray-500">(after 30 days)</span></span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>3rd Installment</span>
                  <span className="font-semibold">INR 295 <span className="text-xs text-gray-500">(after 60 days)</span></span>
                </div>
                <div className="flex justify-between items-center p-3 bg-brand-purple/10 rounded">
                  <span className="font-medium">Wallet Reward</span>
                  <span className="font-semibold text-brand-purple">+INR 50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
