import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Globe, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { LoginProps } from '../../admin/types/login';

const ForgotPassword: React.FC<LoginProps> = ({ isDark = false, language = 'en', onLanguageToggle }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { isLoading, error, success, requestOtp, resetState, clearError } = useAuth();

  const texts = {
    en: {
      companyName: 'TVSSCS',
      title: 'Forgot Password',
      subtitle: 'Enter your email to receive an OTP',
      email: 'Email Address',
      emailPlaceholder: 'Enter your registered email',
      sendOtp: 'Send OTP',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      invalidEmail: 'Please enter a valid email address',
      emailRequired: 'Email is required',
      sent: 'OTP has been sent to your email if it exists in our system.'
    },
    hi: {
      companyName: 'TVSSCS',
      title: 'पासवर्ड भूल गए',
      subtitle: 'OTP प्राप्त करने के लिए अपना ईमेल दर्ज करें',
      email: 'ईमेल पता',
      emailPlaceholder: 'अपना पंजीकृत ईमेल दर्ज करें',
      sendOtp: 'OTP भेजें',
      sending: 'भेज रहे...',
      backToLogin: 'लॉगिन पर वापस जाएं',
      invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      emailRequired: 'ईमेल आवश्यक है',
      sent: 'यदि सिस्टम में होगा तो OTP आपके ईमेल पर भेज दिया गया है।'
    }
  } as const;

  const t = texts[language];

  // Clear errors when user starts typing
  useEffect(() => {
    if (email && (error || emailError)) {
      clearError();
      setEmailError('');
    }
  }, [email, error, emailError, clearError]);

  // Navigate to OTP page when success is true
  useEffect(() => {
    if (success && email) {
      const timer = setTimeout(() => {
        navigate('/verify-otp', { state: { email } });
      }, 1500); // Give user time to see success message
      
      return () => clearTimeout(timer);
    }
  }, [success, email, navigate]);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError) setEmailError('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setEmailError('');
    
    // Client-side validation
    if (!email.trim()) {
      setEmailError(t.emailRequired);
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError(t.invalidEmail);
      return;
    }

    try {
      await requestOtp(email);
      // Navigation will happen automatically via useEffect when success becomes true
    } catch (err) {
      // Error is handled in the hook
      console.error('Failed to send OTP:', err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl border relative`}>
        {/* Language Toggle - Top Right Corner */}
        {onLanguageToggle && (
          <button
            onClick={onLanguageToggle}
            disabled={isLoading || success}
            className={`
              absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 z-10
              ${isDark 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600' 
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
              } disabled:opacity-50
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
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-[#ffff4d]' : 'text-[#0066cc]'}`}>
            {t.companyName}
          </h2>
        </div>

        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.title}</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>{t.subtitle}</p>
        </div>

        {(error || emailError) && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm">{error || emailError}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm">{t.sent}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.email}
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                  error || emailError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#0066cc] focus:ring-[#0066cc]/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0066cc] focus:ring-[#0066cc]/20'
                }`}
                placeholder={t.emailPlaceholder}
                disabled={isLoading || success}
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || success || !email.trim()}
            className="w-full py-3 px-4 rounded-lg font-medium bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
          >
            {isLoading ? t.sending : success ? 'Redirecting...' : t.sendOtp}
          </button>
        </form>

        {!success && (
          <div className="mt-6">
            <Link 
              to="/" 
              className={`inline-flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToLogin}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;