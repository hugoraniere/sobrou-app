import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Eye, 
  Route,
  List,
  MessageSquare
} from 'lucide-react';

// Import section components
import { ProductTourAdmin } from '@/components/admin/onboarding/ProductTourAdmin';
import { StepperAdmin } from '@/components/admin/onboarding/StepperAdmin';
import { ModalInformativoAdmin } from '@/components/admin/onboarding/ModalInformativoAdmin';
import { OnboardingSummaryBar } from '@/components/admin/onboarding/OnboardingSummaryBar';
import { UnifiedOnboardingControl } from '@/components/admin/UnifiedOnboardingControl';
import { ReleaseNotesModal } from '@/components/admin/modals/ReleaseNotesModal';

// Import onboarding components for preview
import { GetStartedStepper } from '@/components/onboarding/GetStartedStepper';
import { TourManager } from '@/components/tour/TourManager';
import { OnboardingGate } from '@/components/onboarding/OnboardingGate';
import { useProductTour } from '@/contexts/ProductTourProvider';
import { useOnboardingState } from '@/hooks/useOnboardingVisibility';
import { toast } from 'sonner';

const OnboardingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product-tour');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'stepper' | 'tour' | 'modal'>('stepper');
  const { startTour, isActive } = useProductTour();
  const { resetUserStates } = useOnboardingState();

  // Mock status data - in real app, fetch from your state management
  const tourStatus = {
    enabled: true,
    visibility: 'first_login',
    audience: 'new_users', 
    version: '1.0',
    lastPublished: '2024-01-15'
  };

  const stepperStatus = {
    enabled: true,
    visibility: 'until_complete',
    audience: 'all_users',
    version: '1.0', 
    lastPublished: '2024-01-15'
  };

  const handlePreview = (type: 'stepper' | 'tour' | 'modal') => {
    if (type === 'tour') {
      // Open tour in preview mode
      const previewUrl = `${window.location.origin}?tour=preview`;
      window.open(previewUrl, '_blank');
    } else {
      setPreviewType(type);
      setIsPreviewOpen(true);
    }
  };

  const handlePublish = (type: 'tour' | 'stepper') => {
    toast.success(`${type === 'tour' ? 'Product Tour' : 'Stepper'} publicado com sucesso!`);
  };

  const handleReset = async (type: 'tour' | 'stepper') => {
    try {
      await resetUserStates();
      toast.success(`Estados de usuário resetados para ${type === 'tour' ? 'Product Tour' : 'Stepper'}`);
    } catch (error) {
      toast.error('Erro ao resetar estados de usuário');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administração do Onboarding</h1>
          <p className="text-muted-foreground">
            Configure a experiência completa de onboarding dos usuários
          </p>
        </div>
      </div>

      {/* Unified Control Panel */}
      <UnifiedOnboardingControl />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="product-tour" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Product Tour
          </TabsTrigger>
          <TabsTrigger value="stepper" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Stepper
          </TabsTrigger>
          <TabsTrigger value="modal-informativo" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Modal Informativo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product-tour" className="space-y-4">
          <ProductTourAdmin />
        </TabsContent>

        <TabsContent value="stepper" className="space-y-4">
          <OnboardingSummaryBar
            type="stepper"
            status={stepperStatus}
            onPreview={() => handlePreview('stepper')}
            onPublish={() => handlePublish('stepper')}
            onReset={() => handleReset('stepper')}
          />
          <StepperAdmin />
        </TabsContent>

        <TabsContent value="modal-informativo" className="space-y-4">
          <ModalInformativoAdmin />
        </TabsContent>
      </Tabs>

      <PreviewDialog 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        type={previewType}
      />

      {/* Tour Manager for preview */}
      {isActive && <TourManager />}
    </div>
  );
};

const PreviewDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  type: 'stepper' | 'tour' | 'modal';
}> = ({ isOpen, onClose, type }) => {
  const getTitle = () => {
    switch (type) {
      case 'stepper': return 'Preview - Get Started Stepper';
      case 'tour': return 'Preview - Product Tour';
      case 'modal': return 'Preview - Modal Informativo';
      default: return 'Preview';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          {type === 'stepper' && (
            <OnboardingGate type="stepper" preview>
              <GetStartedStepper />
            </OnboardingGate>
          )}
          {type === 'modal' && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-muted-foreground">Preview do Modal Informativo em desenvolvimento</div>
            </div>
          )}
          {type === 'tour' && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-muted-foreground">Tour iniciado em nova aba</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingAdmin;