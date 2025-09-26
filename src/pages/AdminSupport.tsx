import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketManager from '@/components/admin/support/TicketManager';
import SupportTopicManager from '@/components/admin/support/SupportTopicManager';
import SupportArticleManager from '@/components/admin/support/SupportArticleManager';
import FAQManager from '@/components/admin/support/FAQManager';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const AdminSupport = () => {
  return (
    <AdminPageLayout 
      title="Central de Ajuda" 
      subtitle="Gerencie tickets, categorias, artigos e FAQ"
    >
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="articles">Artigos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets">
          <TicketManager />
        </TabsContent>
        
        <TabsContent value="categories">
          <SupportTopicManager />
        </TabsContent>
        
        <TabsContent value="articles">
          <SupportArticleManager />
        </TabsContent>
        
        <TabsContent value="faq">
          <FAQManager />
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AdminSupport;