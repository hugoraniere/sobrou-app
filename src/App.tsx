
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { LandingPageProvider } from './contexts/LandingPageContext';
import { AuthProvider } from "./contexts/AuthContext";
import { AvatarProvider } from "./contexts/AvatarContext";
import { AIChatProvider } from "./contexts/AIChatContext";
import { WhatsAppButtonProvider } from "./contexts/WhatsAppButtonContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ProductTourProvider } from "./contexts/ProductTourProvider";
import { OnboardingVisibilityProvider } from "./contexts/OnboardingVisibilityContext";
import { TourDevOverlay, useTourDevMode } from './components/dev/TourDevOverlay';
import { TourAnchorHighlighter } from './components/dev/TourAnchorHighlighter';
import { TourManager } from './components/tour/TourManager';
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Goals from "./pages/Goals";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PasswordReset from "./pages/PasswordReset";
import PublicLanding from "./pages/PublicLanding";
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogPostLegacyRedirect from './components/blog/BlogPostLegacyRedirect';
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContent from "./pages/AdminContent";
import AdminSupport from "./pages/AdminSupport";
import AdminLandingPage from "./pages/admin/LandingPageAdmin";
import AdminUsers from "./pages/AdminUsers";
import OnboardingAdmin from "./pages/admin/OnboardingAdmin";
import { ProductTourAdmin } from "./pages/admin/ProductTourAdmin";
import EmailVerification from "./pages/EmailVerification";
import WhatsAppIntegration from "./pages/WhatsAppIntegration";
import WhatsAppChatButton from "./components/chat/WhatsAppChatButton";
import FinancialPlanning from "./pages/FinancialPlanning";
import RestaurantCalculator from "./pages/RestaurantCalculator";
import MonthlySummary from "./pages/MonthlySummary";
import BillsToPay from "./pages/BillsToPay";
import { NavigationProvider } from '@/contexts/NavigationContext';
import InstallPrompt from './components/pwa/InstallPrompt';
import Error from "./pages/Error";
import SupportCenter from "./pages/support/SupportCenter";
import SupportArticle from "./pages/support/SupportArticle";
import NewTicket from "./pages/support/NewTicket";
const MyTickets = React.lazy(() => import("./pages/support/MyTickets"));


const App = () => {
  const queryClient = React.useMemo(() => new QueryClient(), []);
  const { isDevMode } = useTourDevMode();
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ShadcnToaster />
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <OnboardingVisibilityProvider>
                <OnboardingProvider>
                  <ProductTourProvider>
                  <LandingPageProvider>
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
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPost />} />
                          <Route path="/blog/post/:id" element={<BlogPostLegacyRedirect />} />
                          <Route path="/suporte" element={<SupportCenter />} />
                          <Route path="/suporte/artigo/:slug" element={<SupportArticle />} />
          <Route path="/suporte/novo" element={
            <ProtectedRoute>
              <NewTicket />
            </ProtectedRoute>
          } />
          <Route path="/suporte/meus-tickets" element={
            <ProtectedRoute>
              <React.Suspense fallback={null}><MyTickets /></React.Suspense>
            </ProtectedRoute>
          } />
                          <Route path="/erro" element={<Error />} />
                          
                          {/* Admin routes */}
                          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                          <Route path="/admin-blog" element={<Navigate to="/admin/dashboard" replace />} />
                          <Route 
                            path="/admin/dashboard" 
                            element={
                              <ProtectedRoute>
                                <AdminLayout>
                                  <AdminDashboard />
                                </AdminLayout>
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/admin/content" 
                            element={
                              <ProtectedRoute>
                                <AdminLayout>
                                  <AdminContent />
                                </AdminLayout>
                              </ProtectedRoute>
                            } 
                          />
                           <Route 
                             path="/admin/support" 
                             element={
                               <ProtectedRoute>
                                 <AdminLayout>
                                   <AdminSupport />
                                 </AdminLayout>
                               </ProtectedRoute>
                             } 
                           />
                           <Route 
                             path="/admin/landing" 
                             element={
                               <ProtectedRoute>
                                 <AdminLayout>
                                   <AdminLandingPage />
                                 </AdminLayout>
                               </ProtectedRoute>
                             } 
                           />
                            <Route 
                              path="/admin/onboarding" 
                              element={
                                <ProtectedRoute>
                                  <AdminLayout>
                                    <OnboardingAdmin />
                                  </AdminLayout>
                                </ProtectedRoute>
                              } 
                            />
                            <Route 
                              path="/admin/product-tour" 
                              element={
                                <ProtectedRoute>
                                  <AdminLayout>
                                    <ProductTourAdmin />
                                  </AdminLayout>
                                </ProtectedRoute>
                              } 
                            />
                           <Route 
                             path="/admin/users" 
                             element={
                               <ProtectedRoute>
                                 <AdminLayout>
                                   <AdminUsers />
                                 </AdminLayout>
                               </ProtectedRoute>
                             } 
                           />
                          
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
                        <TourManager />
                        <InstallPrompt />
                        {isDevMode && (
                          <>
                            <TourDevOverlay enabled={isDevMode} />
                            <TourAnchorHighlighter />
                          </>
                        )}
                      </div>
                      </NavigationProvider>
                    </WhatsAppButtonProvider>
                  </AIChatProvider>
                    </AvatarProvider>
                  </LandingPageProvider>
                  </ProductTourProvider>
                </OnboardingProvider>
              </OnboardingVisibilityProvider>
              </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
