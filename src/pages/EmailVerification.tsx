
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Logo from '../components/brand/Logo';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Extract token types from the URL
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });
          
          if (error) {
            setVerificationStatus('error');
            setErrorMessage(error.message);
            console.error('Verification error:', error.message);
          } else {
            setVerificationStatus('success');
            
            // Redirect after a short delay to show success message
            setTimeout(() => {
              navigate('/auth?verification=success');
            }, 3000);
          }
        } else {
          setVerificationStatus('error');
          setErrorMessage('URL de verificação inválida ou incompleta.');
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Ocorreu um erro durante a verificação.');
        console.error('Verification error:', error);
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  // Redirect immediately if no parameters are present
  if (!searchParams.get('token_hash') && !searchParams.get('type')) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-gray-600 mt-2">Verificação de email</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Verificação de Email</CardTitle>
            <CardDescription className="text-center">
              {verificationStatus === 'loading'
                ? 'Estamos verificando o seu email...'
                : verificationStatus === 'success'
                ? 'Seu email foi verificado com sucesso!'
                : 'Ocorreu um problema na verificação'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {verificationStatus === 'loading' && (
              <div className="flex flex-col items-center space-y-4 py-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p>Por favor, aguarde enquanto confirmamos seu email...</p>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle>Email verificado com sucesso!</AlertTitle>
                <AlertDescription>
                  Sua conta foi ativada. Você será redirecionado para a página de login em instantes.
                </AlertDescription>
              </Alert>
            )}
            
            {verificationStatus === 'error' && (
              <>
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle>Falha na verificação</AlertTitle>
                  <AlertDescription>
                    {errorMessage || 'Não foi possível verificar seu email. O link pode ter expirado ou já foi utilizado.'}
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col w-full space-y-2 mt-4">
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="w-full"
                  >
                    Ir para login
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
