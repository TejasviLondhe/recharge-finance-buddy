
import React from 'react';
import { CreditCard, Wallet, PhoneCall, Calendar, Shield, Users } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex flex-col bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="bg-brand-purple/10 p-3 rounded-xl w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <CreditCard className="h-6 w-6 text-brand-purple" />,
      title: "EMI Recharge Financing",
      description: "Get 3-month recharges at lower costs, paid in three equal installments for better affordability."
    },
    {
      icon: <Wallet className="h-6 w-6 text-brand-purple" />,
      title: "NBFC Wallet Rewards",
      description: "Receive INR 40-50 in your NBFC wallet for every 3-month recharge, usable for future transactions."
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-brand-purple" />,
      title: "Multiple Operator Support",
      description: "Recharge across all major telecom operators including Jio, Airtel, and Vi with unified experience."
    },
    {
      icon: <Calendar className="h-6 w-6 text-brand-purple" />,
      title: "Flexible Payment Options",
      description: "Choose between upfront payment or 3-month installment plans based on your financial preference."
    },
    {
      icon: <Shield className="h-6 w-6 text-brand-purple" />,
      title: "Secure Authentication",
      description: "OTP-based mobile verification ensures your account remains protected and accessible."
    },
    {
      icon: <Users className="h-6 w-6 text-brand-purple" />,
      title: "Transparent Pricing",
      description: "Clear breakdown of costs including EMIs, GST and processing charges with no hidden fees."
    }
  ];

  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-500">
            Our telecom recharge app offers innovative features to make mobile recharges more affordable and convenient.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
