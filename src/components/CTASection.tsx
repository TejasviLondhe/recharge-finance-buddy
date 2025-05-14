
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-brand-blue to-brand-purple text-white">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Save on Your Mobile Recharges?</h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Download our app now and experience the future of telecom recharges with EMI options and wallet rewards.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-brand-purple hover:bg-white/90 py-6 text-base">
            <Download className="mr-2 h-5 w-5" /> Download App
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 py-6 text-base">
            Contact Us <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
