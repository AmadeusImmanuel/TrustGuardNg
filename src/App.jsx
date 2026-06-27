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

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0D1F3C" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#00A651] rounded-full animate-spin" />
          <span className="text-white/60 text-sm">Loading TrustGuard...</span>
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
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
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