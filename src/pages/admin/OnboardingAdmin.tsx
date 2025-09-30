import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Eye, 
  Settings,
  Users,
  MessageSquare,
  BarChart3,
  Palette
} from 'lucide-react';
import { OnboardingConfigService } from '@/services/OnboardingConfigService';
import { GetStartedEditor } from '@/components/admin/onboarding/GetStartedEditor';
import { GetStartedStepper } from '@/components/onboarding/GetStartedStepper';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';

const OnboardingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'welcome' | 'stepper'>('welcome');
  const [configs, setConfigs] = useState<any>({});

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = async () => {
    try {
      const allConfigs = await OnboardingConfigService.getAllConfigs();
      const configMap = allConfigs.reduce((acc, config) => {
        acc[config.section_key] = config;
        return acc;
      }, {} as any);
      setConfigs(configMap);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    }
  };

  const handlePreview = (type: 'welcome' | 'stepper') => {
    setPreviewType(type);
    setIsPreviewOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administração do Onboarding</h1>
          <p className="text-muted-foreground">
            Configure a experiência de onboarding dos novos usuários
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => handlePreview('welcome')} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Modal
          </Button>
          <Button onClick={() => handlePreview('stepper')} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Stepper
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="product-tour" className="flex items-center gap-2 relative">
            <Users className="w-4 h-4" />
            Product Tour
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
              Em breve
            </span>
          </TabsTrigger>
          <TabsTrigger value="release-notes" className="flex items-center gap-2 relative">
            <Settings className="w-4 h-4" />
            Release Notes
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
              Em breve
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <GetStartedEditor />
        </TabsContent>

        <TabsContent value="product-tour" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Product Tour</h3>
                <p className="text-muted-foreground mb-4">
                  Configure tours guiados para ajudar novos usuários a descobrir funcionalidades
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                  🚧 Em desenvolvimento
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="release-notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Release Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Release Notes</h3>
                <p className="text-muted-foreground mb-4">
                  Gerencie notas de versão e novidades para manter usuários informados
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                  🚧 Em desenvolvimento
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        type={previewType}
      />
    </div>
  );
};

const VisibilityManager: React.FC<{configs: any, onUpdate: () => void}> = ({ configs, onUpdate }) => {
  const handleToggleVisibility = async (sectionKey: string, isVisible: boolean) => {
    try {
      await OnboardingConfigService.updateVisibility(sectionKey, isVisible);
      toast.success('Visibilidade atualizada');
      onUpdate();
    } catch (error) {
      toast.error('Erro ao atualizar visibilidade');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Visibilidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Modal de Boas-vindas</h4>
            <p className="text-sm text-muted-foreground">Mostrar modal para novos usuários</p>
          </div>
          <Switch
            checked={configs.welcome_modal?.is_visible ?? true}
            onCheckedChange={(checked) => handleToggleVisibility('welcome_modal', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Get Started Stepper</h4>
            <p className="text-sm text-muted-foreground">Mostrar stepper de primeiros passos</p>
          </div>
          <Switch
            checked={configs.get_started_stepper?.is_visible ?? true}
            onCheckedChange={(checked) => handleToggleVisibility('get_started_stepper', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const PreviewDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: 'welcome' | 'stepper';
}> = ({ isOpen, onClose, type }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Preview - {type === 'welcome' ? 'Modal de Boas-vindas' : 'Get Started Stepper'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="bg-muted/30 p-4 rounded-lg">
        {type === 'welcome' ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-muted-foreground">Preview do modal em desenvolvimento</div>
          </div>
        ) : (
          <GetStartedStepper />
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default OnboardingAdmin;