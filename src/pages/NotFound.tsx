import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import MainNavbar from "@/components/navigation/MainNavbar";
import { Home, LogIn, LayoutDashboard } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Página não encontrada</h2>
            <p className="text-muted-foreground">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/")} 
              size="lg"
              className="w-full"
            >
              <Home className="h-5 w-5 mr-2" />
              Voltar para Home
            </Button>
            
            <div className="flex gap-3">
              {!isAuthenticated ? (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/auth")}
                  className="flex-1"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
