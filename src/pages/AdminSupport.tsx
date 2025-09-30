import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TicketManager from '@/components/admin/support/TicketManager';
import SupportTopicManager from '@/components/admin/support/SupportTopicManager';
import SupportArticleManager from '@/components/admin/support/SupportArticleManager';
import FAQManager from '@/components/admin/support/FAQManager';

const AdminSupport = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Central de Ajuda</h1>
          <p className="text-gray-600">Gerencie tickets, categorias, artigos e FAQ</p>
        </div>
        
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
      </main>
    </div>
  );
};

export default AdminSupport;