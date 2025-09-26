import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostsList from '@/components/blog/PostsList';
import PostForm from '@/components/blog/PostForm';
import FeaturedPostManager from '@/components/blog/FeaturedPostManager';
import TagManager from '@/components/admin/content/TagManager';
import AdminPageLayout from '@/components/admin/AdminPageLayout';

const AdminContent = () => {
  return (
    <AdminPageLayout 
      title="Gerenciar Conteúdo" 
      subtitle="Gerencie posts do blog e outros conteúdos"
    >
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts Existentes</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="featured">Posts em Destaque</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <PostsList />
        </TabsContent>
        
        <TabsContent value="tags">
          <TagManager />
        </TabsContent>
        
        <TabsContent value="featured">
          <FeaturedPostManager />
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AdminContent;