import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WealthBackgroundCanvas } from './components/WealthBackgroundCanvas';
import { UsdLiveTicker } from './components/UsdLiveTicker';

// Public pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { HowItWorks } from './pages/HowItWorks';
import { ReferralProgram } from './pages/ReferralProgram';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { RiskDisclosure } from './pages/RiskDisclosure';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Customer pages
import { Overview } from './pages/customer/Overview';
import { Deposit } from './pages/customer/Deposit';
import { Referrals } from './pages/customer/Referrals';
import { Wallet } from './pages/customer/Wallet';
import { Withdrawals } from './pages/customer/Withdrawals';
import { Notifications } from './pages/customer/Notifications';
import { Support } from './pages/customer/Support';
import { Settings } from './pages/customer/Settings';

// Admin pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminDeposits } from './pages/admin/AdminDeposits';
import { AdminWithdrawals } from './pages/admin/AdminWithdrawals';
import { AdminRules } from './pages/admin/AdminRules';
import { AdminMonthlyCycle } from './pages/admin/AdminMonthlyCycle';
import { AdminAudit } from './pages/admin/AdminAudit';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route wrapper
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export const App: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#0A0B0E] text-slate-100'
    }`}>
      {/* Dynamic Animated Wealth Particle Canvas */}
      <WealthBackgroundCanvas />

      {/* Institutional USD Forex Live Ticker */}
      <UsdLiveTicker />

      {/* Main Corporate Navigation */}
      <Navbar />

      <main className="flex-1 relative z-10">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/referral-program" element={<ReferralProgram />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/risk-disclosure" element={<RiskDisclosure />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer Portal */}
          <Route path="/dashboard" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/withdrawals" element={<ProtectedRoute><Withdrawals /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Admin Console */}
          <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/deposits" element={<AdminRoute><AdminDeposits /></AdminRoute>} />
          <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
          <Route path="/admin/rules" element={<AdminRoute><AdminRules /></AdminRoute>} />
          <Route path="/admin/monthly-cycles" element={<AdminRoute><AdminMonthlyCycle /></AdminRoute>} />
          <Route path="/admin/audit" element={<AdminRoute><AdminAudit /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
