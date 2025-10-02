import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainNavbar from "@/components/navigation/MainNavbar";
import { Home, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

const Error = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [errorInfo, setErrorInfo] = useState({
    message: "Ocorreu um erro inesperado",
    source: "unknown",
    details: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    const source = params.get('source');
    const details = params.get('details');

    let errorMessage = "Ocorreu um erro inesperado";
    
    switch (message) {
      case 'auth_failed':
        errorMessage = source === 'google' 
          ? "Falha na autenticação com Google. A conexão pode ter sido recusada ou cancelada."
          : "Falha na autenticação. Tente novamente.";
        break;
      case 'auth_error':
        errorMessage = "Erro durante a autenticação. Verifique sua conexão e tente novamente.";
        break;
      case 'network_error':
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
        break;
      case 'permission_denied':
        errorMessage = "Acesso negado. Você não tem permissão para acessar este recurso.";
        break;
      default:
        errorMessage = details || "Ocorreu um erro inesperado";
    }

    setErrorInfo({
      message: errorMessage,
      source: source || "unknown",
      details: details || ""
    });

    // Log error for debugging
    console.error("Error page accessed:", {
      message,
      source,
      details,
      pathname: location.pathname,
      search: location.search
    });
  }, [location]);

  const handleRetry = () => {
    if (errorInfo.source === 'google') {
      navigate('/?auth=1');
    } else {
      // Try to go back or refresh
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl font-semibold">Ops! Algo deu errado</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {errorInfo.message}
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")} 
                size="lg"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para Home
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar novamente
                </Button>
                
                {isAuthenticated ? (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/suporte/novo")}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Abrir ticket
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/suporte")}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ajuda
                  </Button>
                )}
              </div>
            </div>

            {errorInfo.details && (
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">
                  Detalhes técnicos
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {errorInfo.details}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Error;