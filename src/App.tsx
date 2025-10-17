import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UniversalLogin } from "./component/auth/Login";
import { RoleBasedRoute } from "./component/auth/RoleBasedRoute";
import AppAdmin from "./admin/AppAdmin";
import AppPrint from "./labelPrinter/AppPrint";
import AppFinance from "./finance/AppFinance";
import ForgotPassword from "./component/auth/ForgotPassword";
import VerifyOtp from "./component/auth/VerifyOtp";
import ResetPassword from "./component/auth/ResetPassword";
import "leaflet/dist/leaflet.css";


function AppRouter() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  
  if (!user) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <UniversalLogin
              isDark={isDark}
              // onThemeToggle={() => setIsDark(!isDark)}
              language={language}
              onLanguageToggle={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword
              isDark={isDark}
              // onThemeToggle={() => setIsDark(!isDark)}
              language={language}
              onLanguageToggle={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            />
          }
        />
        <Route
          path="/verify-otp"
          element={
            <VerifyOtp
              isDark={isDark}
              // onThemeToggle={() => setIsDark(!isDark)}
              language={language}
              onLanguageToggle={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            />
          }
        />
        <Route
          path="/reset-password"
          element={
            <ResetPassword
              isDark={isDark}
              // onThemeToggle={() => setIsDark(!isDark)}
              language={language}
              onLanguageToggle={() => setLanguage(prev => prev === 'en' ? 'hi' : 'en')}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <RoleBasedRoute allowedRoles={['Admin']}>
            <AppAdmin />
          </RoleBasedRoute>
        }
      />

      {/* Print Routes */}
      <Route
        path="/print/*"
        element={
          <RoleBasedRoute allowedRoles={['PrinterUser']}>
            <AppPrint />
          </RoleBasedRoute>
        }
      />

      {/* Finance Routes */}
      <Route
        path="/finance/*"
        element={
          <RoleBasedRoute allowedRoles={['Finance']}>
            <AppFinance />
          </RoleBasedRoute>
        }
      />

      {/* Root redirect based on user role */}
      <Route
        path="/"
        element={
          user.role === 'Admin' ? <Navigate to="/admin" replace /> :
          user.role === 'Finance' ? <Navigate to="/finance" replace /> :
          user.role === 'PrinterUser' ? <Navigate to="/print" replace /> :
          <Navigate to="/unauthorized" replace />
        }
      />

      {/* Unauthorized page */}
      <Route 
        path="/unauthorized" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
              <p className="mt-2 text-gray-600">You don't have permission to access this resource.</p>
              <p className="mt-2 text-sm text-gray-500">Your role: {user?.role}</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Go Back
              </button>
            </div>
          </div>
        } 
      />
      
      {/* Catch all - redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
