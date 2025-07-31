
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { AvatarProvider } from "./contexts/AvatarContext";
import { AIChatProvider } from "./contexts/AIChatContext";
import { WhatsAppButtonProvider } from "./contexts/WhatsAppButtonContext";
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
import FinancialPlanning from "./pages/FinancialPlanning";
import RestaurantCalculator from "./pages/RestaurantCalculator";
import MonthlySummary from "./pages/MonthlySummary";
import BillsToPay from "./pages/BillsToPay";
import { NavigationProvider } from '@/contexts/NavigationContext';
import InstallPrompt from './components/pwa/InstallPrompt';

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
                <AIChatProvider>
                  <WhatsAppButtonProvider>
                    <NavigationProvider>
                      <div className="min-h-screen bg-gray-50">
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<PublicLanding />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/verify" element={<EmailVerification />} />
                          <Route path="/reset-password" element={<PasswordReset />} />
                          
                          {/* Protected routes */}
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
                            path="/bills-to-pay"
                            element={
                              <ProtectedRoute>
                                <AppLayout>
                                  <BillsToPay />
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
                          
                          <Route
                            path="/financial-planning"
                            element={
                              <ProtectedRoute>
                                <AppLayout>
                                  <FinancialPlanning />
                                </AppLayout>
                              </ProtectedRoute>
                            }
                          />
                          
                          <Route
                            path="/restaurant-calculator"
                            element={
                              <ProtectedRoute>
                                <AppLayout>
                                  <RestaurantCalculator />
                                </AppLayout>
                              </ProtectedRoute>
                            }
                          />
                          
                          <Route
                            path="/monthly-summary"
                            element={
                              <ProtectedRoute>
                                <AppLayout>
                                  <MonthlySummary />
                                </AppLayout>
                              </ProtectedRoute>
                            }
                          />
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        
                        <WhatsAppChatButton />
                        <InstallPrompt />
                      </div>
                    </NavigationProvider>
                  </WhatsAppButtonProvider>
                </AIChatProvider>
              </AvatarProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
