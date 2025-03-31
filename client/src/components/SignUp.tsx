import React, { useState } from 'react';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Signup = ({ toggleToLogin }: { toggleToLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', result.user);
      toast.success('Account created successfully!');
      // Clear the form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Redirect to homepage
      navigate('/');
    } catch (error: any) {
      toast.error('Signup failed: ' + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-purple-100 p-3 rounded-full">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-purple-600 ml-4">EduNexus</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Create your account</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
            </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            onClick={toggleToLogin}
            className="text-purple-600 font-medium mt-1 hover:text-purple-800 transition-colors"
          >
            Sign in instead
          </button>
        </div>
      </div>
    </div>
  );
};

const Login = ({ toggleToSignup }: { toggleToSignup: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', result.user);
      toast.success('Logged in successfully!');
      // Clear the form
      setEmail('');
      setPassword('');
      // Redirect to homepage
      navigate('/');
    } catch (error: any) {
      toast.error('Login failed: ' + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-purple-100 p-3 rounded-full">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-purple-600 ml-4">EduNexus</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Sign in to your account</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-4 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={toggleToSignup}
            className="text-purple-600 font-medium mt-1 hover:text-purple-800 transition-colors"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => setIsLoginMode(prev => !prev);

  return isLoginMode ? (
    <Login toggleToSignup={toggleMode} />
  ) : (
    <Signup toggleToLogin={toggleMode} />
  );
};

export default Auth;
