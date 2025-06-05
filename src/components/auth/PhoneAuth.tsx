
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { firebaseAuth } from "@/integrations/firebase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthStep = 'phone' | 'otp';

interface PhoneAuthProps {
  onBackToEmail: () => void;
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onBackToEmail }) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    const initRecaptcha = () => {
      if (!recaptchaVerifier) {
        try {
          const verifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log("reCAPTCHA verified");
            },
            'expired-callback': () => {
              toast.error("reCAPTCHA expired. Please try again.");
            }
          });
          setRecaptchaVerifier(verifier);
        } catch (error: any) {
          console.error("reCAPTCHA initialization error:", error);
          setError("Failed to initialize reCAPTCHA. Please refresh the page.");
        }
      }
    };

    initRecaptcha();

    // Cleanup
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (!recaptchaVerifier) {
      setError("reCAPTCHA not initialized. Please refresh the page.");
      return;
    }
    
    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = `+${formattedNumber}`;
    }
    
    setLoading(true);
    
    try {
      const confirmationResult = await signInWithPhoneNumber(
        firebaseAuth, 
        formattedNumber, 
        recaptchaVerifier
      );
      
      setVerificationId(confirmationResult.verificationId);
      toast.success("OTP sent to your phone");
      setStep('otp');
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setError(getFirebaseErrorMessage(error.code));
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    if (!verificationId) {
      setError("No verification ID found. Please request a new code.");
      return;
    }
    
    setLoading(true);
    
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(firebaseAuth, credential);
      
      toast.success("Phone number verified successfully");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError(getFirebaseErrorMessage(error.code));
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later.';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code.';
      case 'auth/invalid-verification-id':
        return 'Invalid verification ID.';
      case 'auth/code-expired':
        return 'Verification code has expired.';
      case 'auth/missing-verification-code':
        return 'Missing verification code.';
      case 'auth/missing-verification-id':
        return 'Missing verification ID.';
      default:
        return 'An error occurred during phone verification.';
    }
  };

  const renderPhoneInput = () => (
    <>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Login with Phone</h1>
      
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
      
      {/* reCAPTCHA container - invisible */}
      <div id="recaptcha-container"></div>
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

export default PhoneAuth;
