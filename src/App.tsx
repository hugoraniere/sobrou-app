import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { AvatarProvider } from "./contexts/AvatarContext";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Goals from "./pages/Goals";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PasswordReset from "./pages/PasswordReset";
import PublicLanding from "./pages/PublicLanding";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import EmailVerification from "./pages/EmailVerification";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import WhatsAppChatButton from "./components/chat/WhatsAppChatButton";

const App = () => {
  const queryClient = React.useMemo(() => new QueryClient(), []);
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ShadcnToaster />
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <AvatarProvider>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/verify" element={<EmailVerification />} />
                  <Route path="/reset-password" element={<PasswordReset />} />
                  
                  {/* Rota principal - redireciona com base na autenticação */}
                  <Route 
                    path="/" 
                    element={<Navigate to="/dashboard" replace />} 
                  />
                  
                  {/* Rotas protegidas */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Index />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/transactions"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Transactions />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/goals"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Goals />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Settings />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path="/whatsapp-integration"
                    element={
                      <ProtectedRoute>
                        <AppLayout>
                          <WhatsAppIntegration />
                        </AppLayout>
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <WhatsAppChatButton />
              </AvatarProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
