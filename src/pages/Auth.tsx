
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'otp' | 'phone' | 'forgot-password';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login'); // Changed default to 'login' instead of 'phone'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        // Login with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast.success("Login successful!");
        navigate('/dashboard');
      } else if (mode === 'signup') {
        // Validate passwords match
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        
        // Sign up with email and password
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phoneNumber
            }
          }
        });
        
        if (error) throw error;
        
        toast.success("Signup successful! Please check your email for verification link.");
        setMode('login');
      } else if (mode === 'phone') {
        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10) {
          toast.error("Please enter a valid phone number");
          setLoading(false);
          return;
        }
        
        // Send OTP via SMS
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
        });
        
        if (error) throw error;
        
        toast.success("OTP sent to your phone number!");
        setMode('otp');
      } else if (mode === 'otp') {
        // Verify OTP
        if (!otp || otp.length !== 6) {
          toast.error("Please enter a valid OTP");
          setLoading(false);
          return;
        }
        
        // Verify OTP
        const { error } = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otp,
          type: 'sms'
        });
        
        if (error) throw error;
        
        toast.success("Phone number verified successfully!");
        navigate('/dashboard');
      } else if (mode === 'forgot-password') {
        // Reset password
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/auth/reset-password',
        });
        
        if (error) throw error;
        
        toast.success("If an account exists with this email, we've sent reset instructions.");
        setMode('login');
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderLogo = () => (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center">
        <div className="bg-emerald-500 w-10 h-10 rounded-full -mr-2"></div>
        <div className="bg-black w-10 h-10 rounded-full z-10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
  
  const renderLogin = () => (
    <>
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Log in</h1>
      {renderLogo()}
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
          <Input 
            type="email" 
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-6"
            required
          />
        </div>
        
        <div className="relative">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 py-6"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit"
          className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode('forgot-password')}
            className="text-sm text-emerald-500"
          >
            Forgot your password?
          </button>
        </div>
        
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="absolute bg-white dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
        </div>
        
        <div className="flex justify-center space-x-6">
          <button type="button" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full">
            <img src="/assets/google.svg" alt="Google" className="w-6 h-6" />
          </button>
          <button type="button" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full">
            <img src="/assets/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </button>
        </div>

        <Alert variant="info">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Phone authentication unavailable</AlertTitle>
          <AlertDescription className="text-sm">
            Phone authentication requires a Supabase project with an SMS provider configured. Please use email authentication for now.
          </AlertDescription>
        </Alert>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? 
          <button 
            type="button"
            onClick={() => setMode('signup')}
            className="text-emerald-500 ml-1"
          >
            Sign Up
          </button>
        </p>
      </form>
    </>
  );
  
  const renderSignup = () => (
    <>
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Sign Up</h1>
      {renderLogo()}
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="py-6"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
          <Input 
            type="email" 
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-6"
            required
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Phone Number (Optional)</label>
          <Input 
            type="tel" 
            placeholder="+1 234 567 8900"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="py-6"
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Password</label>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 py-6"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Confirm Password</label>
          <div className="relative">
            <Input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pr-10 py-6"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit"
          className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
        
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="absolute bg-white dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
        </div>
        
        <div className="flex justify-center space-x-6">
          <button type="button" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full">
            <img src="/assets/google.svg" alt="Google" className="w-6 h-6" />
          </button>
          <button type="button" className="p-3 border border-gray-300 dark:border-gray-700 rounded-full">
            <img src="/assets/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? 
          <button 
            type="button"
            onClick={() => setMode('login')}
            className="text-emerald-500 ml-1"
          >
            Login
          </button>
        </p>
      </form>
    </>
  );
  
  const renderForgotPassword = () => (
    <>
      <div className="w-full max-w-sm">
        <button 
          onClick={() => setMode('login')}
          className="flex items-center mb-4 bg-emerald-500 text-white p-2 rounded-full w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Forgot Password</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your email to receive reset instructions</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
            <Input 
              type="email" 
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-6"
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
            disabled={loading}
          >
            {loading ? "Sending instructions..." : "Send Reset Instructions"}
          </Button>
        </form>
      </div>
    </>
  );
  
  const renderPhoneAuth = () => (
    <>
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Login with Phone</h1>
      {renderLogo()}
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
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
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Want to use email instead? 
          <button 
            type="button"
            onClick={() => setMode('login')}
            className="text-emerald-500 ml-1"
          >
            Login with Email
          </button>
        </p>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? 
          <button 
            type="button"
            onClick={() => setMode('signup')}
            className="text-emerald-500 ml-1"
          >
            Sign Up
          </button>
        </p>
      </form>
    </>
  );

  const renderOtpVerification = () => (
    <>
      <div className="w-full max-w-sm">
        <button 
          onClick={() => setMode('phone')}
          className="flex items-center mb-4 bg-emerald-500 text-white p-2 rounded-full w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Verify OTP</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Enter the 6-digit code sent to {phoneNumber}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              onClick={() => {
                setLoading(true);
                supabase.auth.signInWithOtp({
                  phone: phoneNumber,
                }).then(({ error }) => {
                  if (error) {
                    toast.error(error.message);
                  } else {
                    toast.success("OTP resent to your phone number!");
                  }
                  setLoading(false);
                });
              }}
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
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8 flex flex-col items-center justify-center">
      {mode === 'login' && renderLogin()}
      {mode === 'signup' && renderSignup()}
      {mode === 'forgot-password' && renderForgotPassword()}
      {mode === 'phone' && renderPhoneAuth()}
      {mode === 'otp' && renderOtpVerification()}
    </div>
  );
};

export default Auth;
