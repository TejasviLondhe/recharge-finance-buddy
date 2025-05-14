
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-brand-purple/10 px-3 py-1 text-sm text-brand-purple mb-4">
              New Mobile Recharge Experience
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Pay Your Recharge in <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">Easy Installments</span>
            </h1>
            <p className="text-gray-500 md:text-xl max-w-[600px]">
              Get 3 months of mobile recharge at a lower cost, paid in 3 easy installments with our NBFC financing option.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 transition-opacity py-6 text-base">
                Download App <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple/10 py-6 text-base">
                Learn More
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand-purple h-5 w-5" />
                <span className="text-sm text-gray-600">Save on recharges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand-purple h-5 w-5" />
                <span className="text-sm text-gray-600">Pay in 3 installments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand-purple h-5 w-5" />
                <span className="text-sm text-gray-600">Earn wallet rewards</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative w-[280px] h-[560px] md:w-[320px] md:h-[640px]">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-blue to-brand-purple rounded-3xl blur-3xl opacity-20 animate-float"></div>
              <div className="relative bg-white border-8 border-gray-800 rounded-[40px] h-full w-full overflow-hidden shadow-xl">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-lg"></div>
                <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <Smartphone className="w-20 h-20 text-brand-purple opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
