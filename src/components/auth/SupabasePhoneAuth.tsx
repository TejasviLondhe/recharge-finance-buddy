
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

type AuthStep = 'phone' | 'otp';

interface SupabasePhoneAuthProps {
  onBackToEmail: () => void;
}

const SupabasePhoneAuth: React.FC<SupabasePhoneAuthProps> = ({ onBackToEmail }) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loading } = useSupabaseAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    const success = await sendOtp(phoneNumber);
    if (success) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    const success = await verifyOtp(phoneNumber, otp);
    if (success) {
      navigate('/dashboard');
    }
  };

  const renderPhoneInput = () => (
    <>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Login with Phone</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        We'll send you a verification code via Twilio
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSendCode} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Phone Number</label>
          <Input 
            type="tel" 
            placeholder="+1 234 567 8900"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="py-6"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter your phone number with country code (e.g., +1 for USA)
          </p>
        </div>
        
        <Button 
          type="submit"
          className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
        
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="absolute bg-white dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
        </div>
        
        <Button 
          type="button"
          variant="outline"
          onClick={onBackToEmail}
          className="w-full"
        >
          Login with Email
        </Button>
      </form>
    </>
  );

  const renderOtpVerification = () => (
    <>
      <div className="w-full max-w-sm">
        <button 
          onClick={() => setStep('phone')}
          className="flex items-center mb-4 bg-emerald-500 text-white p-2 rounded-full w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Verify OTP</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Enter the 6-digit code sent to {phoneNumber}</p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm text-gray-500 dark:text-gray-400 self-start mb-1">OTP Code</label>
            <InputOTP 
              value={otp} 
              onChange={setOtp} 
              maxLength={6}
              pattern="^[0-9]+$"
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-12 w-12 text-xl" />
                <InputOTPSlot index={1} className="h-12 w-12 text-xl" />
                <InputOTPSlot index={2} className="h-12 w-12 text-xl" />
                <InputOTPSlot index={3} className="h-12 w-12 text-xl" />
                <InputOTPSlot index={4} className="h-12 w-12 text-xl" />
                <InputOTPSlot index={5} className="h-12 w-12 text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => handleSendCode({ preventDefault: () => {} } as React.FormEvent)}
              className="text-sm text-emerald-500"
              disabled={loading}
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div>
      {step === 'phone' && renderPhoneInput()}
      {step === 'otp' && renderOtpVerification()}
    </div>
  );
};

export default SupabasePhoneAuth;
