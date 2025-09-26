import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, MapPin, BarChart3 } from 'lucide-react';
import OnboardingStepsAdmin from '@/components/admin/onboarding/OnboardingStepsAdmin';
import ProductTourAdmin from '@/components/admin/product-tour/ProductTourAdmin';

const OnboardingManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('steps');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Gestão de Onboarding
          </h1>
          <p className="text-text-secondary mt-2">
            Configure experiências de onboarding e product tours para novos usuários
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurações
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="steps" className="gap-2">
            <Users className="h-4 w-4" />
            Passos de Onboarding
          </TabsTrigger>
          <TabsTrigger value="product-tour" className="gap-2">
            <MapPin className="h-4 w-4" />
            Product Tour
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2" disabled>
            <BarChart3 className="h-4 w-4" />
            Analytics
            <Badge variant="secondary" className="ml-2 text-xs">
              Em breve
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2" disabled>
            <Settings className="h-4 w-4" />
            Configurações
            <Badge variant="secondary" className="ml-2 text-xs">
              Em breve
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Passos de Onboarding Existentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OnboardingStepsAdmin />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="product-tour" className="space-y-6">
          <ProductTourAdmin />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Analytics em Desenvolvimento
            </h3>
            <p className="text-text-secondary">
              Métricas detalhadas sobre o engajamento do onboarding estarão disponíveis em breve
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Configurações Avançadas
            </h3>
            <p className="text-text-secondary">
              Configurações globais do sistema de onboarding estarão disponíveis em breve
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnboardingManager;