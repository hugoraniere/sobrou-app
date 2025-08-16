import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, Users, Building2, Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import { toast } from "sonner";
const PricingSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Obrigado! Você será notificado quando os planos estiverem disponíveis.");
    setEmail('');
    setIsSubmitting(false);
  };
  const plans = [{
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar a organizar suas finanças",
    features: ["Até 100 transações por mês", "Categorização automática básica", "Dashboard financeiro", "Relatórios mensais simples", "Suporte por email"],
    current: true,
    cta: "Começar grátis",
    popular: false
  }, {
    name: "Pro",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para quem quer máximo controle financeiro",
    features: ["Transações ilimitadas", "IA avançada para insights", "Integração WhatsApp Premium", "Relatórios detalhados e personalizados", "Planejamento financeiro avançado", "Metas de economia inteligentes", "Suporte prioritário", "Exportação de dados"],
    current: false,
    cta: "Entrar na lista",
    popular: true
  }, {
    name: "Business",
    price: "R$ 49,90",
    period: "/mês",
    description: "Ideal para pequenas empresas e empreendedores",
    features: ["Tudo do plano Pro", "Múltiplas contas e cartões", "Controle de contas a pagar/receber", "Calculadora de custos para restaurantes", "Relatórios fiscais e contábeis", "API para integrações", "Usuários colaboradores (até 5)", "Suporte dedicado"],
    current: false,
    cta: "Entrar na lista",
    popular: false
  }];
  const addOns = [{
    name: "WhatsApp Business API",
    price: "R$ 9,90/mês",
    description: "Integração oficial do WhatsApp para empresas",
    icon: <Zap className="h-5 w-5" />
  }, {
    name: "Consultoria Financeira",
    price: "R$ 99,90/hora",
    description: "Sessões individuais com especialistas financeiros",
    icon: <TrendingUp className="h-5 w-5" />
  }, {
    name: "Auditoria Premium",
    price: "R$ 199,90/mês",
    description: "Análise detalhada e recomendações personalizadas",
    icon: <Shield className="h-5 w-5" />
  }];
  return <section id="pricing" className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-background via-background to-muted/20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Star className="h-4 w-4 mr-2" />
            Em breve - Lista de espera
          </Badge>
          <h2 className="font-outfit text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Planos que crescem com você
          </h2>
          <p className="font-outfit text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comece grátis e evolua conforme suas necessidades. Nossos planos premium estarão disponíveis em breve com recursos avançados de IA e automação.
          </p>
        </div>

        {/* Marketing Triggers */}
        

        {/* Pricing Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
              {plan.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Mais popular
                </Badge>}
              <CardHeader className="text-center pb-8">
                <CardTitle className="font-outfit text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="font-outfit">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>)}
                </ul>
                <Button className="w-full" variant={plan.current ? "outline" : plan.popular ? "default" : "outline"} disabled={!plan.current}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>)}
        </div>

        {/* Add-ons */}
        

        {/* Waitlist */}
        
      </div>
    </section>;
};
export default PricingSection;