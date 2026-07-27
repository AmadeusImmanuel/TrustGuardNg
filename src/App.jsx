import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Trades from './pages/Trades';
import NewTrade from './pages/NewTrade';
import TradeDetail from './pages/TradeDetail';
import Disputes from './pages/Disputes';
import Wallet from './pages/Wallet';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDisputes from './pages/AdminDisputes';
import AdminWebhooks from './pages/AdminWebhooks';
import AdminAllTrades from './pages/AdminAllTrades';
import AdminSettings from './pages/AdminSettings';
import About from './pages/About';
import Help from './pages/Help';
import Security from './pages/Security';
import Blog from './pages/Blog';
import Reputation from './pages/Reputation';
import Profile from './pages/Profile';
import NotificationsPage from './pages/NotificationsPage';
import DisputeDetail from './pages/DisputeDetail';
import AdminKYC from './pages/AdminKYC';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminSupport from './pages/AdminSupport';
import AdminFraud from './pages/AdminFraud';
import Settings from './pages/Settings';
import Support from './pages/Support';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading TrustGuard...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* App */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trades" element={<Trades />} />
      <Route path="/trades/new" element={<NewTrade />} />
      <Route path="/trades/:id" element={<TradeDetail />} />
      <Route path="/disputes" element={<Disputes />} />
      <Route path="/wallet" element={<Wallet />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/trades" element={<AdminAllTrades />} />
      <Route path="/admin/disputes" element={<AdminDisputes />} />
      <Route path="/admin/webhooks" element={<AdminWebhooks />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/about" element={<About />} />
      <Route path="/help" element={<Help />} />
      <Route path="/security" element={<Security />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<Blog />} />
      <Route path="/reputation" element={<Reputation />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/disputes/:id" element={<DisputeDetail />} />
      <Route path="/support" element={<Support />} />
      <Route path="/admin/kyc" element={<AdminKYC />} />
      <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
      <Route path="/admin/support" element={<AdminSupport />} />
      <Route path="/admin/fraud" element={<AdminFraud />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App