
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PasswordEmailType = 'changed' | 'reset';

interface RequestPayload {
  email: string;
  type: PasswordEmailType;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Cria um cliente Supabase usando as variáveis de ambiente
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload = await req.json() as RequestPayload;
    const { email, type } = payload;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Busca o perfil do usuário pelo email
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    const user = users.users?.find(u => u.email === email);
    
    const { data: profile, error: userError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user?.id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
    }

    const userName = profile?.full_name || 'Usuário';
    
    let subject = '';
    let content = '';

    if (type === 'changed') {
      subject = 'Sua senha foi alterada';
      content = `
        <h2>Olá ${userName},</h2>
        <p>Sua senha foi alterada com sucesso.</p>
        <p>Se você não realizou esta alteração, entre em contato com nosso suporte imediatamente.</p>
        <p>Esta alteração desconectou todas as suas sessões ativas por razões de segurança.</p>
        <p>Atenciosamente,<br>Equipe Sobrou</p>
      `;
    } else if (type === 'reset') {
      subject = 'Sua senha foi redefinida';
      content = `
        <h2>Olá ${userName},</h2>
        <p>Sua senha foi redefinida com sucesso.</p>
        <p>Se você não realizou esta ação, entre em contato com nosso suporte imediatamente.</p>
        <p>Atenciosamente,<br>Equipe Sobrou</p>
      `;
    }

    // Enviar email usando o serviço de email do Supabase
    const { error: emailError } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject,
        html: content
      }
    });

    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending password email:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
