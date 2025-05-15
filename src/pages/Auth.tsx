
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

type AuthMode = 'login' | 'signup' | 'otp' | 'phone';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
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
        // Login with phone and OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber
        });
        
        if (error) throw error;
        
        toast.success("OTP sent successfully");
        setMode('otp');
      } else if (mode === 'signup') {
        // Validate passwords match
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
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
        
        toast.success("Signup successful! Verify your email to continue.");
        setMode('login');
      } else if (mode === 'phone') {
        // Send OTP for phone verification
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber
        });
        
        if (error) throw error;
        
        toast.success("OTP sent successfully");
        setMode('otp');
      } else if (mode === 'otp') {
        // Verify OTP
        const { error, data } = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otp,
          type: 'sms'
        });
        
        if (error) throw error;
        
        toast.success("Authentication successful!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
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
      <h1 className="text-2xl font-bold mb-8">Log in</h1>
      {renderLogo()}
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
          <Input 
            type="tel" 
            placeholder="+1 234 567 8900"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="py-6"
          />
        </div>
        
        <Button 
          type="submit"
          className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Log In"}
        </Button>
        
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-t border-gray-300" />
          <span className="absolute bg-white px-3 text-sm text-gray-500">or</span>
        </div>
        
        <div className="flex justify-center space-x-6">
          <button type="button" className="p-3 border rounded-full">
            <img src="/assets/google.svg" alt="Google" className="w-6 h-6" />
          </button>
          <button type="button" className="p-3 border rounded-full">
            <img src="/assets/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-500">
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
      <h1 className="text-2xl font-bold mb-8">Sign Up</h1>
      {renderLogo()}
      
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="py-6"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 mb-1 block">Email Address</label>
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
          <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
          <Input 
            type="tel" 
            placeholder="+1 234 567 8900"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="py-6"
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-500 mb-1 block">Password</label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="relative">
          <label className="text-sm text-gray-500 mb-1 block">Confirm Password</label>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
          {loading ? "Creating Account..." : "Continue"}
        </Button>
        
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-t border-gray-300" />
          <span className="absolute bg-white px-3 text-sm text-gray-500">or</span>
        </div>
        
        <div className="flex justify-center space-x-6">
          <button type="button" className="p-3 border rounded-full">
            <img src="/assets/google.svg" alt="Google" className="w-6 h-6" />
          </button>
          <button type="button" className="p-3 border rounded-full">
            <img src="/assets/facebook.svg" alt="Facebook" className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-500">
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
  
  const renderPhone = () => (
    <>
      <div className="w-full max-w-sm">
        <button 
          onClick={() => setMode('signup')}
          className="flex items-center mb-4 bg-emerald-500 text-white p-2 rounded-full w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Phone Number</h1>
        <p className="text-gray-500 mb-8">Please add your mobile phone number</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">* Phone Number</label>
            <Input 
              type="tel" 
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="py-6"
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Continue"}
          </Button>
        </form>
      </div>
    </>
  );
  
  const renderOtp = () => (
    <>
      <div className="w-full max-w-sm">
        <button 
          onClick={() => setMode(mode === 'phone' ? 'signup' : 'login')}
          className="flex items-center mb-4 bg-emerald-500 text-white p-2 rounded-full w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-gray-500 mb-8">Please enter your OTP</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Enter Pin Code (5-digit)</label>
            <div className="flex justify-center my-4">
              <InputOTP maxLength={5} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {/* Number pad UI representation */}
            <div className="grid grid-cols-3 gap-4 mt-8 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setOtp(otp.length < 5 ? otp + num.toString() : otp)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium border-2 
                    ${otp.includes(num.toString()) ? 'bg-emerald-500 text-white' : 'border-gray-300 text-gray-700'}`}
                >
                  {num}
                </button>
              ))}
              <div className="w-14 h-14 flex items-center justify-center">
                <span role="img" aria-label="Smile" className="text-2xl">☺️</span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(otp.length < 5 ? otp + '0' : otp)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-medium border-2 
                  ${otp.includes('0') ? 'bg-emerald-500 text-white' : 'border-gray-300 text-gray-700'}`}
              >
                0
              </button>
              <div className="w-14 h-14 flex items-center justify-center">
                <span role="img" aria-label="Fingerprint" className="text-2xl">👆</span>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full py-6 text-lg bg-emerald-500 hover:bg-emerald-600 rounded-xl"
            disabled={otp.length !== 5 || loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </>
  );
  
  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center justify-center">
      {mode === 'login' && renderLogin()}
      {mode === 'signup' && renderSignup()}
      {mode === 'phone' && renderPhone()}
      {mode === 'otp' && renderOtp()}
    </div>
  );
};

export default Auth;
