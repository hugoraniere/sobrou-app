import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SupportLayout from '@/components/support/SupportLayout';
import SupportSearchAndActions from '@/components/support/SupportSearchAndActions';
import CategoryGrid from '@/components/support/CategoryGrid';
import ArticleList from '@/components/support/ArticleList';
import FAQAccordion from '@/components/support/FAQAccordion';
import { SupportService } from '@/services/supportService';
import { useToast } from '@/hooks/use-toast';
import type { SupportTopic, SupportArticle, FAQEntry } from '@/types/support';

const SupportCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [topics, setTopics] = useState<SupportTopic[]>([]);
  const [popularArticles, setPopularArticles] = useState<SupportArticle[]>([]);
  const [recentArticles, setRecentArticles] = useState<SupportArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQEntry[]>([]);
  const [searchResults, setSearchResults] = useState<{
    articles: SupportArticle[];
    faqs: FAQEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const topicFilter = searchParams.get('topic');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [topicsData, popularData, recentData, faqsData] = await Promise.all([
        SupportService.getTopics(),
        SupportService.getPopularArticles(6),
        SupportService.getRecentArticles(6),
        SupportService.getFAQEntries()
      ]);

      setTopics(topicsData);
      setPopularArticles(popularData);
      setRecentArticles(recentData);
      setFaqs(faqsData.slice(0, 8)); // Limitar a 8 FAQs
    } catch (error) {
      console.error('Error loading support data:', error);
      toast({
        message: "Erro ao carregar dados do suporte. Tente novamente.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const results = await SupportService.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        message: "Erro ao realizar busca. Tente novamente.",
        type: "error"
      });
    }
  };

  const filteredArticles = topicFilter 
    ? [...popularArticles, ...recentArticles].filter(
        (article, index, arr) => 
          article.topic_id === topicFilter &&
          arr.findIndex(a => a.id === article.id) === index
      )
    : null;

  if (loading) {
    return (
      <SupportLayout showSearchAndActions={false}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout showSearchAndActions={false}>
      <div className="container mx-auto px-4 pb-12">
        {/* Search and Actions */}
        <SupportSearchAndActions 
          onSearch={handleSearch}
          className="mb-12"
        />

      {/* Search Results */}
      {searchResults && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Resultados da Busca
          </h2>
          
          {searchResults.articles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Artigos ({searchResults.articles.length})
              </h3>
              <ArticleList articles={searchResults.articles} showViewCount />
            </div>
          )}

          {searchResults.faqs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Perguntas Frequentes ({searchResults.faqs.length})
              </h3>
              <FAQAccordion faqs={searchResults.faqs} />
            </div>
          )}

          {searchResults.articles.length === 0 && searchResults.faqs.length === 0 && (
            <p className="text-text-secondary text-center py-8">
              Nenhum resultado encontrado. Tente termos diferentes ou 
              <a href="/suporte/novo" className="text-primary hover:underline ml-1">
                abra um ticket
              </a>.
            </p>
          )}
          
          <hr className="my-12" />
        </section>
      )}

      {/* Categories */}
      {!searchResults && !topicFilter && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Categorias de Ajuda
          </h2>
          <CategoryGrid topics={topics} />
        </section>
      )}

      {/* Filtered Articles by Topic */}
      {filteredArticles && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Artigos da Categoria
          </h2>
          <ArticleList 
            articles={filteredArticles} 
            showViewCount 
            showFeatured 
          />
        </section>
      )}

      {/* Popular Articles */}
      {!searchResults && !topicFilter && popularArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Artigos Populares
          </h2>
          <ArticleList 
            articles={popularArticles} 
            showViewCount 
            showFeatured 
          />
        </section>
      )}

      {/* Recent Articles */}
      {!searchResults && !topicFilter && recentArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Artigos Recentes
          </h2>
          <ArticleList articles={recentArticles} />
        </section>
      )}

      {/* FAQ */}
      {!searchResults && !topicFilter && faqs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Perguntas Frequentes
          </h2>
          <FAQAccordion faqs={faqs} />
        </section>
      )}
      </div>
    </SupportLayout>
  );
};

export default SupportCenter;