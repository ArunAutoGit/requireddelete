import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, AlertCircle, RefreshCw, Globe, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { LoginProps } from '../../admin/types/login';



const VerifyOtp: React.FC<LoginProps> = ({ isDark = false, language = 'en', onLanguageToggle }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email || '';
  const { isLoading, error, validateOtp, requestOtp, resetState, clearError } = useAuth();

  const texts = {
    en: {
      companyName: 'TVSSCS',
      title: 'Verify OTP',
      subtitle: `Enter the OTP sent to ${email || 'your email'}`,
      verify: 'Verify OTP',
      verifying: 'Verifying...',
      back: 'Back',
      resend: 'Resend OTP',
      resending: 'Resending...',
      resendIn: 'Resend in',
      seconds: 'seconds',
      emailMissing: 'Email address is missing. Please start over.'
    },
    hi: {
      companyName: 'TVSSCS',
      title: 'OTP सत्यापित करें',
      subtitle: `${email || 'आपके ईमेल'} पर भेजा गया OTP दर्ज करें`,
      verify: 'OTP सत्यापित करें',
      verifying: 'सत्यापित कर रहे...',
      back: 'वापस',
      resend: 'OTP फिर भेजें',
      resending: 'भेज रहे...',
      resendIn: 'फिर भेजें',
      seconds: 'सेकंड में',
      emailMissing: 'ईमेल पता गुम है। कृपया फिर से शुरू करें।'
    }
  } as const;

  const t = texts[language];
  const otpString = otp.join('');

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clear errors when OTP changes
  useEffect(() => {
    if (error && otpString.length > 0) {
      clearError();
    }
  }, [otpString, error, clearError]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otpString)) return;
    
    try {
      await validateOtp(email, otpString);
      // Navigate immediately after successful validation
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    await handleVerify();
  };

  const handleResendOtp = async () => {
    try {
      await requestOtp(email);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const next = [...otp];
        next[index - 1] = '';
        setOtp(next);
        inputsRef.current[index - 1]?.focus();
      } else {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      }
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (!pastedData) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputsRef.current[lastFilledIndex]?.focus();
  };

  // Focus first input on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!email) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl border`}>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.emailMissing}
            </h2>
            <Link 
              to="/forgot-password" 
              className="inline-block mt-4 px-6 py-2 bg-[#0066cc] text-white rounded-lg hover:bg-[#0052a3] transition-colors"
            >
              {t.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl border relative`}>
        {/* Language Toggle - Top Right Corner */}
        {onLanguageToggle && (
          <button
            onClick={onLanguageToggle}
            disabled={isLoading}
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

        <div className="mb-6 text-center">
          {/* < className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#0066cc]' : 'text-[#0066cc]'}`} /> */}
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.title}</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>{t.subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            {otp.map((digit, idx) => (
              <div key={idx} className="w-12 h-12">
                <input
                  ref={el => (inputsRef.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-full h-full text-center rounded-lg border-2 text-xl font-semibold focus:outline-none focus:ring-2 transition-all ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-[#0066cc] focus:ring-[#0066cc]/20' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-[#0066cc] focus:ring-[#0066cc]/20'
                  } ${digit ? (isDark ? 'border-[#0066cc]' : 'border-[#0066cc]') : ''}`}
                  aria-label={`OTP Digit ${idx + 1}`}
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || otpString.length !== 6}
            className="w-full py-3 px-4 rounded-lg font-medium bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
          >
            {isLoading ? t.verifying : t.verify}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-6 text-center">
          {countdown > 0 ? (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.resendIn} {countdown} {t.seconds}
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                isDark ? 'text-[#0066cc] hover:text-[#0052a3]' : 'text-[#0066cc] hover:text-[#0052a3]'
              } disabled:opacity-50`}
            >
              <RefreshCw className="w-4 h-4" />
              {isLoading ? t.resending : t.resend}
            </button>
          )}
        </div>

        <div className="mt-6">
          <Link 
            to="/forgot-password" 
            className={`inline-flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-[#0066cc] hover:text-[#0052a3]' : 'text-[#0066cc] hover:text-[#0052a3]'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
