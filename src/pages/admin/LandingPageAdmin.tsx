import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { toast } from "sonner";
import HeroEditor from '@/components/admin/landing/HeroEditor';
import ModulesEditor from '@/components/admin/landing/ModulesEditor';
import SectionVisibilityManager from '@/components/admin/landing/SectionVisibilityManager';
import FAQEditor from '@/components/admin/landing/FAQEditor';
import WhatsAppEditor from '@/components/admin/landing/WhatsAppEditor';
import StatementImportEditor from '@/components/admin/landing/StatementImportEditor';
import AutomationEditor from '@/components/admin/landing/AutomationEditor';
import SecurityEditor from '@/components/admin/landing/SecurityEditor';
import CtaEditor from '@/components/admin/landing/CtaEditor';

const LandingPageAdmin: React.FC = () => {
  const { configs, loading, refreshConfigs } = useLandingPage();
  const [activeTab, setActiveTab] = useState('hero');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshConfigs();
      toast("Configurações recarregadas com sucesso.");
    } catch (error) {
      toast("Não foi possível recarregar as configurações.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const previewUrl = window.location.origin;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Configuração da Landing Page</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            onClick={() => window.open(previewUrl, '_blank')}
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Landing Page
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="statement">Extratos</TabsTrigger>
          <TabsTrigger value="automation">IA</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="visibility">Visibilidade</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Seção Hero</CardTitle>
            </CardHeader>
            <CardContent>
              <HeroEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle>Módulos de Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ModulesEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>Seção WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <WhatsAppEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statement">
          <Card>
            <CardHeader>
              <CardTitle>Seção Importação de Extratos</CardTitle>
            </CardHeader>
            <CardContent>
              <StatementImportEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Seção IA e Automação</CardTitle>
            </CardHeader>
            <CardContent>
              <AutomationEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Seção Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <SecurityEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <FAQEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>Seção Call-to-Action Final</CardTitle>
            </CardHeader>
            <CardContent>
              <CtaEditor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visibility">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Visibilidade das Seções</CardTitle>
            </CardHeader>
            <CardContent>
              <SectionVisibilityManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LandingPageAdmin;