import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MessageSquare, Smartphone, TrendingUp, Target, Repeat, Lock, Zap, BarChart2, ArrowRight, CheckCircle2, Brain, PieChart, Globe } from 'lucide-react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from '../hooks/use-mobile';

const PublicLanding: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header isPublic={true} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-5 md:px-8 pt-16 pb-24">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 max-w-screen-xl mx-auto">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              Organize suas finanças só digitando.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Com o Sobrou, você registra seus gastos por texto, visualiza gráficos automáticos e controla tudo com uma conta segura — até pelo WhatsApp.
            </p>
            <div className="pt-4">
              <Link to="/auth">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-8 py-3 shadow-sm transition-all">
                  Crie sua conta grátis
                </Button>
              </Link>
              <div className="flex items-center gap-2 mt-4">
                <CheckCircle2 className="text-green-500 h-5 w-5" />
                <span className="text-gray-700 font-medium">Simples. Rápido. Seguro.</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-lg shadow-xl overflow-hidden border border-gray-200 bg-white">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" alt="Sobrou app interface" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Você digita. A IA entende. E tudo se organiza.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Você escreve</h3>
                <p className="text-gray-600">
                  "Gastei R$ 50 com mercado ontem"
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">A IA entende</h3>
                <p className="text-gray-600">
                  Valor, categoria e data são processados automaticamente
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Tudo aparece</h3>
                <p className="text-gray-600">
                  Nos seus gráficos e histórico financeiro
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 bg-white shadow-sm hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-green-600 font-bold text-lg">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Via WhatsApp</h3>
                <p className="text-gray-600">
                  Mande sua transação por mensagem e pronto
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-green-50 py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades principais
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uma nova maneira de gerenciar suas finanças, com tecnologia que trabalha para você.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="text-green-600 mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrada por texto com linguagem natural</h3>
              <p className="text-gray-600">
                Digite ou fale como você normalmente se comunica, sem precisar aprender formatos específicos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="text-green-600 mb-4">
                <PieChart size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gráficos automáticos de gastos e saldo</h3>
              <p className="text-gray-600">
                Visualize para onde seu dinheiro está indo com gráficos intuitivos que se atualizam automaticamente.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="text-green-600 mb-4">
                <Target size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Metas financeiras com progresso visual</h3>
              <p className="text-gray-600">
                Defina objetivos e acompanhe seu progresso com indicadores visuais que mantêm você motivado.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="text-green-600 mb-4">
                <Repeat size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Lançamentos recorrentes</h3>
              <p className="text-gray-600">
                Configure pagamentos e recebimentos que se repetem, como salário, aluguel e assinaturas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="text-green-600 mb-4">
                <Globe size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiplataforma</h3>
              <p className="text-gray-600">
                Acesse pelo navegador, aplicativo ou pelo WhatsApp, sempre com seus dados sincronizados.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="text-green-600 mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Conta protegida com login seguro</h3>
              <p className="text-gray-600">
                Seus dados financeiros estão protegidos por sistemas de segurança avançados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Demonstrations */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Veja o Sobrou em ação
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dê uma olhada em como o Sobrou facilita sua vida financeira.
            </p>
          </div>
          
          <div className="mt-10">
            <Carousel className="max-w-4xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <div className="border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2071" alt="Dashboard financeiro" className="w-full h-auto object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold">Dashboard intuitivo e completo</h3>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" alt="Entrada por texto" className="w-full h-auto object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold">Registre gastos com texto natural</h3>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1583752028088-91e3e9880b46?auto=format&fit=crop&q=80&w=2067" alt="Integração com WhatsApp" className="w-full h-auto object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold">Integração direta com WhatsApp</h3>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="bg-green-50 py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Para quem é o Sobrou?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ideal para pessoas que querem uma nova relação com suas finanças.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ter controle do dinheiro sem perder tempo</h3>
                  <p className="text-gray-600">
                    Registre suas transações em segundos, sem formulários complexos.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Abandonar as planilhas e controlar por texto</h3>
                  <p className="text-gray-600">
                    Esqueça as planilhas complexas e use linguagem natural para registrar tudo.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ver para onde o dinheiro vai</h3>
                  <p className="text-gray-600">
                    Visualize padrões de gastos e entenda melhor seus hábitos financeiros.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Criar o hábito de gastar melhor e economizar</h3>
                  <p className="text-gray-600">
                    Desenvolva consciência financeira e atinja seus objetivos mais rapidamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Diferenciais do Sobrou
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              O que torna o Sobrou especial e diferente das outras soluções.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="text-green-600 mb-4">
                <Zap size={48} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comece em menos de 2 minutos</h3>
              <p className="text-gray-600">
                Cadastro simples e rápido para começar a usar imediatamente.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="text-green-600 mb-4">
                <Lock size={48} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Seus dados estão seguros</h3>
              <p className="text-gray-600">
                Login obrigatório para garantir a proteção dos seus dados financeiros.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="text-green-600 mb-4">
                <Brain size={48} />
              </div>
              <h3 className="text-lg font-semibold mb-2">IA que entende seus textos</h3>
              <p className="text-gray-600">
                Tecnologia que interpreta o que você escreve com precisão.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="text-green-600 mb-4">
                <MessageSquare size={48} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Entrada via WhatsApp</h3>
              <p className="text-gray-600">
                Registre gastos e receba relatórios diretamente no seu WhatsApp.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="text-green-600 mb-4">
                <BarChart2 size={48} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tudo organizado em gráficos</h3>
              <p className="text-gray-600">
                Visualize seus dados financeiros de forma clara e intuitiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-green-600 py-16 md:py-24 text-white">
        <div className="container mx-auto px-5 md:px-8 max-w-screen-xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Pronto pra entender suas finanças de verdade?
            </h2>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-medium rounded-lg px-8 py-3 shadow-sm transition-all mb-4">
                Criar minha conta agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4">
              É rápido e seguro. Você só precisa se cadastrar para começar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900">Sobrou</h3>
            </div>
            <div className="flex flex-wrap gap-6 text-gray-600 mb-6 md:mb-0">
              <a href="#" className="hover:text-green-600 transition-colors">Sobre</a>
              <a href="#" className="hover:text-green-600 transition-colors">Termos</a>
              <a href="#" className="hover:text-green-600 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-green-600 transition-colors">Contato</a>
            </div>
          </div>
          
        </div>
      </footer>
    </div>;
};
export default PublicLanding;
