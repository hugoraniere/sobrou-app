import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsList from '@/components/blog/PostsList';
import PostForm from '@/components/blog/PostForm';
import FeaturedPostManager from '@/components/blog/FeaturedPostManager';

const AdminContent = () => {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background-base">
      <main className="w-full px-4 md:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Gerenciar Conteúdo</h1>
          <p className="text-gray-600">Gerencie posts do blog e outros conteúdos</p>
        </div>
        
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts Existentes</TabsTrigger>
            <TabsTrigger value="new-post">Criar Novo Post</TabsTrigger>
            <TabsTrigger value="featured">Posts em Destaque</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            <PostsList />
          </TabsContent>
          
          <TabsContent value="new-post">
            <PostForm />
          </TabsContent>
          
          <TabsContent value="featured">
            <FeaturedPostManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminContent;