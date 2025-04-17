
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/AuthContext";
import PublicLanding from "./pages/PublicLanding";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import React from "react";

const App = () => {
  const queryClient = React.useMemo(() => new QueryClient(), []);
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Index />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/integration"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <WhatsAppIntegration />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
