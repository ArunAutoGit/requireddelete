import React, { useState } from 'react';
import { Lock, Globe, Mail, AlertCircle, Eye, EyeOff, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LoginProps } from '../../admin/types/login';

// interface LoginProps {
//   isDark?: boolean;
//   language?: 'en' | 'hi';
//   onLanguageToggle?: () => void;
// }

export const UniversalLogin: React.FC<LoginProps> = ({ 

  isDark = false, 
  language = 'en', 
  onLanguageToggle 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { login, isLoading } = useAuth();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (emailValue && !validateEmail(emailValue)) {
      setEmailError(texts[language].invalidEmail);
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError(texts[language].invalidEmail);
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError(texts[language].invalidCredentials);
    }
  };

  const texts = {
    en: {
      companyName: 'TVSSCS',
      title: 'Welcome Back',
      subtitle: 'Please sign in to your account',
      email: 'Email Address',
      password: 'Password',
      emailPlaceholder: 'Enter your email address',
      passwordPlaceholder: 'Enter your password',
      signIn: 'Sign In',
      signingIn: 'Signing In...',
      invalidEmail: 'Please enter a valid email address',
      invalidCredentials: 'Invalid credentials. Please try again.',
      showPassword: 'Show password',
      hidePassword: 'Hide password'
    },
    hi: {
      companyName: 'TVSSCS',
      title: 'फिर से स्वागत है',
      subtitle: 'कृपया अपने खाते में साइन इन करें',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      signIn: 'साइन इन करें',
      signingIn: 'साइन इन हो रहा है...',
      invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      invalidCredentials: 'अमान्य क्रेडेंशियल्स। कृपया पुनः प्रयास करें।',
      showPassword: 'पासवर्ड दिखाएं',
      hidePassword: 'पासवर्ड छुपाएं'
    }
  };

  const currentTexts = texts[language];

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`
        max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl relative
        ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
      `}>
        {/* Language Toggle - Top Right Corner */}
        {onLanguageToggle && (
          <button
            onClick={onLanguageToggle}
            className={`
              absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 z-10
              ${isDark 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600' 
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
              }
            `}
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'EN' : 'हिंदी'}
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ffff4d] flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className={`text-xl font-semibold mb-1 ${isDark ? 'text-[#ffff4d]' : 'text-[#0066cc]'}`}>
            {currentTexts.companyName}
          </h2>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentTexts.title}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentTexts.subtitle}
          </p>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentTexts.email}
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`
                  w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200
                  ${emailError 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#0066cc]' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0066cc]'
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20
                `}
                placeholder={currentTexts.emailPlaceholder}
                required
              />
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentTexts.password}
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full pl-10 pr-12 py-3 rounded-lg border transition-colors duration-200
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#0066cc]' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0066cc]'
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20
                `}
                placeholder={currentTexts.passwordPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                title={showPassword ? currentTexts.hidePassword : currentTexts.showPassword}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!emailError}
            className={`
              w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20
              ${isLoading || emailError
                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                : 'bg-[#0066cc] hover:bg-[#0052a3] text-white'
              }
            `}
          >
            {isLoading ? currentTexts.signingIn : currentTexts.signIn}
          </button>

          <div className="text-right">
            <Link to="/forgot-password" className={`${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'} text-sm`}>
              {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};