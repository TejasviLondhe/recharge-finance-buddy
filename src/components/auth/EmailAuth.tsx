
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type EmailAuthMode = 'login' | 'signup' | 'forgot-password';

interface EmailAuthProps {
  onSwitchToPhone: () => void;
}

const EmailAuth: React.FC<EmailAuthProps> = ({ onSwitchToPhone }) => {
  const [mode, setMode] = useState<EmailAuthMode>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Login successful!"
        });
        navigate('/dashboard');
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        // Format phone number to E.164 format if provided
        let formattedPhone = phoneNumber;
        if (phoneNumber && !phoneNumber.startsWith('+')) {
          formattedPhone = `+${phoneNumber}`;
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              phone_number: formattedPhone
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email for verification."
        });
        navigate('/dashboard');
      } else if (mode === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Password reset email sent!"
        });
        setMode('login');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderLogo = () => <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center">
        <div className="bg-emerald-500 w-10 h-10 rounded-full -mr-2"></div>
        <div className="bg-black w-10 h-10 rounded-full z-10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>;

  const renderLogin = () => <>
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Log in</h1>
      {renderLogo()}
      
      <form onSubmit={handleEmailAuth} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
          <Input 
            type="email" 
            placeholder="your.email@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
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
              onChange={e => setPassword(e.target.value)} 
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
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSwitchToPhone} 
          className="w-full"
        >
          Login with Phone Number
        </Button>
        
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
    </>;

  const renderSignup = () => <>
      <h1 className="text-2xl font-bold mb-8 dark:text-white">Sign Up</h1>
      {renderLogo()}
      
      <form onSubmit={handleEmailAuth} className="space-y-6 w-full max-w-sm">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe" 
            value={fullName} 
            onChange={e => setFullName(e.target.value)} 
            className="py-6" 
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Phone Number (Optional)</label>
          <Input 
            type="tel" 
            placeholder="+1 234 567 8900" 
            value={phoneNumber} 
            onChange={e => setPhoneNumber(e.target.value)} 
            className="py-6" 
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Add your phone number to enable phone login later
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
          <Input 
            type="email" 
            placeholder="your.email@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
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
              onChange={e => setPassword(e.target.value)} 
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
              onChange={e => setConfirmPassword(e.target.value)} 
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
    </>;

  const renderForgotPassword = () => <>
      <div className="w-full max-w-sm">
        <button 
          onClick={() => setMode('login')} 
          className="flex items-center mb-4 bg-emerald-500 text-white p-2 rounded-full w-fit"
        >
          <ArrowLeft size={18} />
        </button>
        
        <h1 className="text-2xl font-bold mb-2 dark:text-white">Forgot Password</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your email to receive reset instructions</p>
        
        <form onSubmit={handleEmailAuth} className="space-y-8">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Email Address</label>
            <Input 
              type="email" 
              placeholder="your.email@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
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
    </>;

  return (
    <div>
      {mode === 'login' && renderLogin()}
      {mode === 'signup' && renderSignup()}
      {mode === 'forgot-password' && renderForgotPassword()}
    </div>
  );
};

export default EmailAuth;
