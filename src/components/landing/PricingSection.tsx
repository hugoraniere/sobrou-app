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

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar a organizar suas finanças",
      features: [
        "Até 100 transações por mês",
        "Categorização automática básica",
        "Dashboard financeiro",
        "Relatórios mensais simples",
        "Suporte por email"
      ],
      current: true,
      cta: "Começar grátis",
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 19,90",
      period: "/mês",
      description: "Para quem quer máximo controle financeiro",
      features: [
        "Transações ilimitadas",
        "IA avançada para insights",
        "Integração WhatsApp Premium",
        "Relatórios detalhados e personalizados",
        "Planejamento financeiro avançado",
        "Metas de economia inteligentes",
        "Suporte prioritário",
        "Exportação de dados"
      ],
      current: false,
      cta: "Entrar na lista",
      popular: true
    },
    {
      name: "Business",
      price: "R$ 49,90",
      period: "/mês",
      description: "Ideal para pequenas empresas e empreendedores",
      features: [
        "Tudo do plano Pro",
        "Múltiplas contas e cartões",
        "Controle de contas a pagar/receber",
        "Calculadora de custos para restaurantes",
        "Relatórios fiscais e contábeis",
        "API para integrações",
        "Usuários colaboradores (até 5)",
        "Suporte dedicado"
      ],
      current: false,
      cta: "Entrar na lista",
      popular: false
    }
  ];

  const addOns = [
    {
      name: "WhatsApp Business API",
      price: "R$ 9,90/mês",
      description: "Integração oficial do WhatsApp para empresas",
      icon: <Zap className="h-5 w-5" />
    },
    {
      name: "Consultoria Financeira",
      price: "R$ 99,90/hora",
      description: "Sessões individuais com especialistas financeiros",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      name: "Auditoria Premium",
      price: "R$ 199,90/mês",
      description: "Análise detalhada e recomendações personalizadas",
      icon: <Shield className="h-5 w-5" />
    }
  ];

  return (
    <section id="pricing" className="w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-background via-background to-muted/20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Star className="h-4 w-4 mr-2" />
            Em breve - Lista de espera
          </Badge>
          <h2 className="font-alliance-n2 text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Planos que crescem com você
          </h2>
          <p className="font-alliance text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comece grátis e evolua conforme suas necessidades. Nossos planos premium estarão disponíveis em breve com recursos avançados de IA e automação.
          </p>
        </div>

        {/* Marketing Triggers */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 rounded-lg bg-card border">
            <Users className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-alliance-n2 text-lg font-semibold mb-2">+10.000 usuários</h3>
            <p className="text-sm text-muted-foreground">já organizaram suas finanças</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-alliance-n2 text-lg font-semibold mb-2">87% economizam mais</h3>
            <p className="text-sm text-muted-foreground">após 30 dias de uso</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-card border">
            <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-alliance-n2 text-lg font-semibold mb-2">5 horas/mês</h3>
            <p className="text-sm text-muted-foreground">economizadas em controle financeiro</p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Mais popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="font-alliance-n2 text-xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription className="font-alliance">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                  disabled={!plan.current}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h3 className="font-alliance-n2 text-2xl font-bold text-center mb-8">Serviços Adicionais</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {addon.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-alliance-n2 font-semibold mb-1">{addon.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                    <p className="font-semibold text-primary">{addon.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Waitlist */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-card border rounded-2xl p-8">
            <Building2 className="h-12 w-12 text-primary mx-auto mb-6" />
            <h3 className="font-alliance-n2 text-2xl font-bold mb-4">
              Seja o primeiro a saber quando lançarmos
            </h3>
            <p className="text-muted-foreground mb-6">
              Entre na nossa lista de espera e ganhe <strong>30 dias grátis</strong> do plano Pro quando os recursos premium estiverem disponíveis.
            </p>
            <form onSubmit={handleWaitlistSubmit} className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Entrar na lista"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              Não enviaremos spam. Apenas notificações importantes sobre o lançamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;