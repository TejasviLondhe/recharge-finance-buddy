
import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

// Animation utility for slides
const slideVariants = {
  hidden: 'opacity-0 translate-x-[100px]',
  visible: 'opacity-100 translate-x-0',
  exit: 'opacity-0 -translate-x-[100px]'
};

type OnboardingSlide = {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const slides: OnboardingSlide[] = [
    {
      title: "Stay connected, Stay Charged",
      description: "Stay connected, Stay Charged. One tap, Instant Recharge.",
      imageSrc: "/assets/recharge-cards.svg",
      imageAlt: "Recharge cards"
    },
    {
      title: "Your Money Your Way",
      description: "Your money, your way—save, invest, and spend with total control and flexibility! With Sahind Technologies",
      imageSrc: "/assets/saving-money.svg",
      imageAlt: "Man saving money"
    },
    {
      title: "Secure, fast, and seamless",
      description: "Secure, fast, and seamless your smarter way to manage money starts here!",
      imageSrc: "/assets/secure-payment.svg",
      imageAlt: "Woman with credit card and phone"
    },
    {
      title: "Where speed meet Security & Trust",
      description: "Fast, safe, and reliable financial solutions at your fingertips!",
      imageSrc: "/assets/payment-security.svg",
      imageAlt: "Woman with payment terminal"
    },
    {
      title: "No Fee, No Friction",
      description: "No Fee, No Friction Just Effortless Payment with Sahind Technologies.",
      imageSrc: "/assets/no-fee.svg",
      imageAlt: "Man with wallet"
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/auth');
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className={`max-w-md w-full transition-all duration-500 transform ${slideVariants.visible}`}>
          {/* Image */}
          <div className="mb-12 flex justify-center">
            <div className="relative h-64 w-64">
              {slides[currentSlide].imageSrc && (
                <img 
                  src={slides[currentSlide].imageSrc}
                  alt={slides[currentSlide].imageAlt}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
          
          {/* Text content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {slides[currentSlide].title}
            </h1>
            <p className="text-gray-600">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 my-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index 
                ? "w-6 bg-emerald-500" 
                : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Button */}
      <div className="p-6">
        <Button 
          onClick={handleNext}
          className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
        >
          {currentSlide < slides.length - 1 ? "Continue" : "Get Started"}
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
