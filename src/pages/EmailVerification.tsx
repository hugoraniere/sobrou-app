
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
        console.log('Verification parameters:', Object.fromEntries(searchParams.entries()));
        
        // Suporte para parâmetros no hash fragment (nova abordagem do Supabase)
        // A URL pode conter #access_token=xxx&refresh_token=xxx&...
        const hashFragment = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hashFragment);
        
        // Extrair tokens do hash ou dos query parameters
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('Hash and parameters:', { 
          hashFragment,
          accessToken: accessToken ? "present (not showing full token)" : null,
          refreshToken: refreshToken ? "present (not showing full token)" : null,
          type
        });
        
        // Token do link tradicional (antigo formato)
        const tokenHash = searchParams.get('token_hash');
        const typeParam = searchParams.get('type');
        
        if ((tokenHash && typeParam) || accessToken) {
          if (accessToken) {
            // Abordagem com token no hash (novo formato Supabase)
            console.log('Trying to set session with access token from hash fragment');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (error) {
              setVerificationStatus('error');
              setErrorMessage(error.message);
              console.error('Session error:', error.message);
            } else {
              setVerificationStatus('success');
              
              // Redirecionar após um pequeno atraso para exibir a mensagem de sucesso
              setTimeout(() => {
                navigate('/auth?verification=success');
              }, 3000);
            }
          } else {
            // Abordagem tradicional com OTP (antigo formato)
            console.log('Trying traditional OTP verification with token_hash');
            const { error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash!,
              type: typeParam as any,
            });
            
            if (error) {
              setVerificationStatus('error');
              setErrorMessage(error.message);
              console.error('Verification error:', error.message);
            } else {
              setVerificationStatus('success');
              
              // Redirecionar após um pequeno atraso para exibir a mensagem de sucesso
              setTimeout(() => {
                navigate('/auth?verification=success');
              }, 3000);
            }
          }
        } else {
          setVerificationStatus('error');
          setErrorMessage('URL de verificação inválida ou incompleta.');
          console.error('Missing verification parameters:', { tokenHash, typeParam, accessToken });
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Ocorreu um erro durante a verificação.');
        console.error('Verification error:', error);
      }
    };

    handleEmailVerification();
  }, [searchParams, navigate]);

  // Caso especial - para URLs com apenas hash e sem outros parâmetros
  useEffect(() => {
    const handleHashOnly = () => {
      const hashWithoutParams = window.location.hash;
      // Detectar um formato específico de hash que pode conter a URL de redirecionamento
      if (hashWithoutParams && hashWithoutParams.includes('supabase.co/') && !hashWithoutParams.includes('access_token=')) {
        console.error('Detected malformed URL with only hash:', hashWithoutParams);
        setVerificationStatus('error');
        setErrorMessage('URL de redirecionamento malformada. Por favor, contacte o suporte ou tente se registrar novamente.');
      }
    };
    
    handleHashOnly();
  }, []);

  // Redirect immediately if no parameters are present and no hash
  if (!searchParams.get('token_hash') && !searchParams.get('type') && !window.location.hash) {
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
