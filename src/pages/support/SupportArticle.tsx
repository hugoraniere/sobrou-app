import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, ChevronRight, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import SupportLayout from '@/components/support/SupportLayout';
import ArticleList from '@/components/support/ArticleList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SupportService } from '@/services/supportService';
import { useToast } from '@/hooks/use-toast';
import type { SupportArticle, ArticleVote } from '@/types/support';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SupportArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const [article, setArticle] = useState<SupportArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<SupportArticle[]>([]);
  const [userVote, setUserVote] = useState<ArticleVote | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    try {
      setLoading(true);
      const [articleData, userVoteData] = await Promise.all([
        SupportService.getArticleBySlug(articleSlug),
        SupportService.getUserVoteForArticle(articleSlug).catch(() => null)
      ]);

      setArticle(articleData);
      setUserVote(userVoteData);

      // Load related articles
      if (articleData.topic_id) {
        const related = await SupportService.getRelatedArticles(
          articleData.id,
          articleData.topic_id,
          3
        );
        setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error loading article:', error);
      toast({
        message: "Artigo não encontrado.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (isHelpful: boolean) => {
    if (!article || hasVoted) return;

    try {
      const ipAddress = await fetch('https://api.ipify.org?format=text')
        .then(response => response.text())
        .catch(() => undefined);

      await SupportService.voteOnArticle(article.id, isHelpful, ipAddress);
      
      setHasVoted(true);
      toast({
        message: "Obrigado! Seu voto foi registrado.",
        type: "success"
      });

      // Reload article to get updated vote counts
      if (slug) {
        const updatedArticle = await SupportService.getArticleBySlug(slug);
        setArticle(updatedArticle);
      }
    } catch (error) {
      console.error('Error voting on article:', error);
      toast({
        message: "Erro ao registrar voto. Tente novamente.",
        type: "error"
      });
    }
  };

  if (loading) {
    return (
      <SupportLayout showBackButton>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SupportLayout>
    );
  }

  if (!article) {
    return (
      <SupportLayout showBackButton>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Artigo não encontrado
          </h1>
          <p className="text-text-secondary mb-6">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Link to="/suporte">
            <Button>Voltar ao Suporte</Button>
          </Link>
        </div>
      </SupportLayout>
    );
  }

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-text-primary">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 text-text-primary mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 text-text-primary mt-6">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^\s*$\n/gm, '')
      .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>');
  };

  return (
    <SupportLayout showBackButton>
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/suporte" className="hover:text-primary">
            Suporte
          </Link>
          <ChevronRight className="h-4 w-4" />
          {article.topic && (
            <>
              <Link to={`/suporte?topic=${article.topic.id}`} className="hover:text-primary">
                {article.topic.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-text-primary">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {article.topic && (
              <Badge variant="outline">
                {article.topic.name}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-text-secondary mb-6">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.reading_time_minutes} min de leitura</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.view_count} visualizações</span>
            </div>
            <span>
              Atualizado {formatDistanceToNow(new Date(article.updated_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-text-primary leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdown(article.content)
            }} 
          />
        </article>

        {/* Vote Section */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Este artigo foi útil?
              </h3>
              
              {!hasVoted && !userVote ? (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleVote(true)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Sim ({article.helpful_votes})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleVote(false)}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Não ({article.not_helpful_votes})
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Obrigado pelo seu feedback!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Artigos Relacionados
            </h2>
            <ArticleList articles={relatedArticles} showViewCount />
          </section>
        )}
      </div>
    </SupportLayout>
  );
};

export default SupportArticle;