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
import { GetStartedStepper } from '@/components/onboarding/GetStartedStepper';
import { TourManager } from '@/components/tour/TourManager';
import { useProductTour } from '@/hooks/useProductTour';

const OnboardingAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product-tour');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<'stepper' | 'tour' | 'modal'>('stepper');
  const { startTour, isActive } = useProductTour();

  const handlePreview = (type: 'stepper' | 'tour' | 'modal') => {
    if (type === 'tour') {
      startTour();
    } else {
      setPreviewType(type);
      setIsPreviewOpen(true);
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
        
        <div className="flex gap-2">
          <Button onClick={() => handlePreview('tour')} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Tour
          </Button>
          <Button onClick={() => handlePreview('stepper')} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Stepper
          </Button>
          <Button onClick={() => handlePreview('modal')} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Modal
          </Button>
        </div>
      </div>

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
          {type === 'stepper' && <GetStartedStepper />}
          {type === 'modal' && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-muted-foreground">Preview do Modal Informativo em desenvolvimento</div>
            </div>
          )}
          {type === 'tour' && (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-muted-foreground">Tour iniciado - feche este modal para ver o tour</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingAdmin;