import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff, Globe, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { LoginProps } from '../../admin/types/login';

// interface Props {
//   isDark?: boolean;
//   language?: 'en' | 'hi';
//   onLanguageToggle?: () => void;
// }

const ResetPassword: React.FC<LoginProps> = ({ isDark = false, language = 'en', onLanguageToggle }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email || '';
  const { isLoading, error, success, setNewPassword, resetState, clearError } = useAuth();

  const texts = {
    en: {
      companyName: 'TVSSCS',
      title: 'Reset Password',
      subtitle: 'Create a new password for your account',
      password: 'New Password',
      confirmPassword: 'Confirm Password',
      placeholderPwd: 'Enter new password',
      placeholderConfirm: 'Re-enter new password',
      save: 'Save Password',
      saving: 'Saving...',
      back: 'Back',
      backToLogin: 'Back to Login',
      mismatch: 'Passwords do not match',
      success: 'Password reset successful! You can now login with your new password.',
      redirecting: 'Redirecting to login page...',
      requirements: 'Must contain: 8+ chars, A-Z, a-z, 0-9, special char',
      emailMissing: 'Session expired. Please start over.'
    },
    hi: {
      companyName: 'TVSSCS',
      title: 'पासवर्ड रीसेट करें',
      subtitle: 'अपने खाते के लिए नया पासवर्ड बनाएं',
      password: 'नया पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      placeholderPwd: 'नया पासवर्ड दर्ज करें',
      placeholderConfirm: 'नया पासवर्ड पुनः दर्ज करें',
      save: 'पासवर्ड सेव करें',
      saving: 'सेव हो रहा...',
      back: 'वापस',
      backToLogin: 'लॉगिन पर वापस जाएं',
      mismatch: 'पासवर्ड मेल नहीं खाते',
      success: 'पासवर्ड रीसेट सफल! अब आप नए पासवर्ड से लॉगिन कर सकते हैं।',
      redirecting: 'लॉगिन पेज पर रीडायरेक्ट हो रहे...',
      requirements: 'आवश्यक: 8+ अक्षर, A-Z, a-z, 0-9, विशेष वर्ण',
      emailMissing: 'सत्र समाप्त हो गया। कृपया फिर से शुरू करें।'
    }
  } as const;

  const t = texts[language];

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Navigate to login after successful password reset
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Clear errors when user types
  useEffect(() => {
    if (password && (error || passwordError)) {
      clearError();
      setPasswordError('');
    }
  }, [password, error, passwordError, clearError]);

  useEffect(() => {
    if (confirmPassword && confirmError) {
      setConfirmError('');
    }
  }, [confirmPassword, confirmError]);

  const validatePasswordStrength = (pwd: string) => {
    const requirements = [];
    if (pwd.length < 8) requirements.push('At least 8 characters required');
    if (!/[A-Z]/.test(pwd)) requirements.push('One uppercase letter required');
    if (!/[a-z]/.test(pwd)) requirements.push('One lowercase letter required');
    if (!/\d/.test(pwd)) requirements.push('One number required');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) requirements.push('One special character required');
    return requirements;
  };

  const getPasswordStrengthIndicator = (pwd: string) => {
    const checks = [
      pwd.length >= 8,
      /[A-Z]/.test(pwd),
      /[a-z]/.test(pwd),
      /\d/.test(pwd),
      /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    ];
    const score = checks.filter(Boolean).length;
    
    return { score, checks };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (passwordError) setPasswordError('');
    if (confirmPassword && confirmError) setConfirmError('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (confirmError) setConfirmError('');
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setPasswordError('');
    setConfirmError('');
    
    // Validate password strength
    const strengthErrors = validatePasswordStrength(password);
    if (strengthErrors.length > 0) {
      setPasswordError(strengthErrors.join(', '));
      return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
      setConfirmError(t.mismatch);
      return;
    }
    
    try {
      await setNewPassword(email, password);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  if (!email) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl border relative`}>
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

  const passwordStrength = getPasswordStrengthIndicator(password);

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

        {(error || passwordError || confirmError) && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-red-700 text-sm">
              {error || passwordError || confirmError}
            </span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm">{t.success}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.password}
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                  passwordError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#0066cc] focus:ring-[#0066cc]/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0066cc] focus:ring-[#0066cc]/20'
                }`}
                placeholder={t.placeholderPwd}
                disabled={isLoading || success}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                disabled={isLoading || success}
              >
                {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Compact Password Requirements */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength.checks[i]
                          ? 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.requirements}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.confirmPassword}
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${
                  confirmError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                    : isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-[#0066cc] focus:ring-[#0066cc]/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#0066cc] focus:ring-[#0066cc]/20'
                }`}
                placeholder={t.placeholderConfirm}
                disabled={isLoading || success}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                disabled={isLoading || success}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {success ? (
            <div className="text-center py-4">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.redirecting}
              </p>
            </div>
          ) : (
            <button 
              type="submit" 
              disabled={isLoading || !password || !confirmPassword}
              className="w-full py-3 px-4 rounded-lg font-medium bg-[#0066cc] hover:bg-[#0052a3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
            >
              {isLoading ? t.saving : t.save}
            </button>
          )}
        </form>

        <div className="mt-6">
          <Link 
            to="/verify-otp" 
            state={{ email }} 
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

export default ResetPassword;
