
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SitesPage } from './pages/SitesPage';
import { LeadsKanban } from './pages/LeadsKanban';
import { Templates } from './pages/Templates';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Clients } from './pages/Clients';
import { Company } from './pages/Company';
import { CalendarPage } from './pages/CalendarPage';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { PricingPage } from './pages/PricingPage';
import { AxonautCheckout } from './pages/AxonautCheckout'; // Import
import { ToastProvider } from './components/ui/Toast';
import { useAuth } from './contexts/AuthContext';

// Protected Route Guard
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/axonaut-checkout" element={<AxonautCheckout />} /> {/* New Route */}
          
          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/leads" element={<LeadsKanban />} />
             <Route path="/calendar" element={<CalendarPage />} />
             <Route path="/sites" element={<SitesPage />} />
             <Route path="/clients" element={<Clients />} />
             <Route path="/templates" element={<Templates />} />
             <Route path="/settings" element={<Company />} />
             <Route path="/profile" element={<ProfilePage />} />
             
             {/* Redirect old routes */}
             <Route path="/kanban" element={<Navigate to="/sites" replace />} />
             <Route path="/map" element={<Navigate to="/sites" replace />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
