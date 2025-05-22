
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SplashScreen from "./pages/SplashScreen";
import Wallet from "./pages/Wallet";
import Plans from "./pages/Plans";
import { AuthProvider } from "./contexts/AuthContext";
import BottomNav from "./components/BottomNav";
import { useLocation } from "react-router-dom";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Layout component to handle the bottom navigation
const Layout = ({ children }) => {
  const location = useLocation();
  const shouldShowBottomNav = !['/auth', '/onboarding', '/'].includes(location.pathname);
  
  return (
    <>
      {children}
      {shouldShowBottomNav && <BottomNav />}
      {/* Add padding to prevent content from being hidden behind bottom nav */}
      {shouldShowBottomNav && <div className="pb-16"></div>}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout>
                    <Settings />
                  </Layout>
                }
              />
              <Route
                path="/wallet"
                element={
                  <Layout>
                    <Wallet />
                  </Layout>
                }
              />
              <Route
                path="/plans"
                element={
                  <Layout>
                    <Plans />
                  </Layout>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
