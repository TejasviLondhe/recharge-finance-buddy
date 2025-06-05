import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth } from "@/integrations/firebase/client";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        toast.success("Login successful!");
        navigate('/dashboard');
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        
        // Update user profile with full name
        if (fullName) {
          await updateProfile(userCredential.user, {
            displayName: fullName
          });
        }
        
        toast.success("Account created successfully!");
        navigate('/dashboard');
      } else if (mode === 'forgot-password') {
        await sendPasswordResetEmail(firebaseAuth, email);
        toast.success("Password reset email sent!");
        setMode('login');
      }
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      console.error("Firebase Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      toast.success("Google login successful!");
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      toast.success("Facebook login successful!");
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      console.error("Facebook login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completion.';
      case 'auth/cancelled-popup-request':
        return 'Only one popup request is allowed at a time.';
      default:
        return 'An error occurred during authentication.';
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
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-6 mb-2">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button 
              type="button" 
              onClick={handleFacebookLogin}
              disabled={loading}
              className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"/>
              </svg>
            </button>
          </div>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSwitchToPhone} 
            className="w-full"
          >
            Login with Phone Number
          </Button>
        </div>
        
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
        
        <div className="relative flex items-center justify-center">
          <hr className="w-full border-t border-gray-300 dark:border-gray-700" />
          <span className="absolute bg-white dark:bg-gray-900 px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
        </div>
        
        <div className="flex justify-center space-x-6">
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          <button 
            type="button" 
            onClick={handleFacebookLogin}
            disabled={loading}
            className="p-3 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"/>
            </svg>
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

// Add missing import
import { ArrowLeft } from 'lucide-react';
