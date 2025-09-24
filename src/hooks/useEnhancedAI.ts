import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interface para cache inteligente
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

// Interface para feedback de IA
interface AIFeedback {
  id: string;
  functionName: string;
  input: any;
  output: any;
  userRating: 'positive' | 'negative' | 'neutral';
  feedback?: string;
  timestamp: number;
}

// Interface para processamento em lote
interface BatchRequest {
  id: string;
  functionName: string;
  input: any;
  priority: 'high' | 'medium' | 'low';
}

class EnhancedAIService {
  private cache = new Map<string, CacheEntry<any>>();
  private batchQueue: BatchRequest[] = [];
  private processingBatch = false;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_DELAY = 2000; // 2 segundos

  // Cache inteligente
  private getCacheKey(functionName: string, input: any): string {
    return `${functionName}_${JSON.stringify(input).slice(0, 100)}`;
  }

  private getCachedResult<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCachedResult<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    });

    // Limpar cache antigo para evitar vazamento de memória
    if (this.cache.size > 100) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }
  }

  // Sistema de feedback
  async submitFeedback(feedback: Omit<AIFeedback, 'id' | 'timestamp'>): Promise<void> {
    const feedbackData: AIFeedback = {
      ...feedback,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    try {
      // Usar analytics_events para armazenar feedback da IA
      await supabase
        .from('analytics_events')
        .insert({
          event_name: 'ai_feedback',
          user_id: null, // Pode ser null para feedback anônimo
          event_params: {
            function_name: feedbackData.functionName,
            input_data: feedbackData.input,
            output_data: feedbackData.output,
            user_rating: feedbackData.userRating,
            feedback_text: feedbackData.feedback,
            feedback_id: feedbackData.id
          },
          created_at: new Date(feedbackData.timestamp).toISOString()
        });

      console.log('✅ Feedback enviado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao enviar feedback:', error);
    }
  }

  // Processamento em lote
  async addToBatch(request: Omit<BatchRequest, 'id'>): Promise<string> {
    const batchRequest: BatchRequest = {
      ...request,
      id: crypto.randomUUID()
    };

    this.batchQueue.push(batchRequest);
    
    // Processar lote se necessário
    if (!this.processingBatch && 
        (this.batchQueue.length >= this.BATCH_SIZE || 
         this.batchQueue.some(r => r.priority === 'high'))) {
      this.processBatch();
    }

    return batchRequest.id;
  }

  private async processBatch(): Promise<void> {
    if (this.processingBatch || this.batchQueue.length === 0) return;

    this.processingBatch = true;
    
    try {
      // Ordenar por prioridade
      const sortedQueue = [...this.batchQueue].sort((a, b) => {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[b.priority] - priorities[a.priority];
      });

      const currentBatch = sortedQueue.slice(0, this.BATCH_SIZE);
      this.batchQueue = this.batchQueue.filter(item => 
        !currentBatch.find(batch => batch.id === item.id)
      );

      // Processar em paralelo
      await Promise.all(currentBatch.map(async (request) => {
        try {
          const result = await this.callAIFunction(request.functionName, request.input);
          const cacheKey = this.getCacheKey(request.functionName, request.input);
          this.setCachedResult(cacheKey, result);
        } catch (error) {
          console.error(`❌ Erro ao processar ${request.id}:`, error);
        }
      }));

      console.log(`✅ Processado lote de ${currentBatch.length} requisições de IA`);

    } finally {
      this.processingBatch = false;
      
      // Processar próximo lote se necessário
      if (this.batchQueue.length > 0) {
        setTimeout(() => this.processBatch(), this.BATCH_DELAY);
      }
    }
  }

  private async callAIFunction(functionName: string, input: any): Promise<any> {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: input
    });

    if (error) throw error;
    return data;
  }

  // Função principal com cache e lote
  async callEnhancedAI<T>(
    functionName: string, 
    input: any, 
    options: {
      useCache?: boolean;
      priority?: 'high' | 'medium' | 'low';
      useBatch?: boolean;
    } = {}
  ): Promise<T> {
    const { useCache = true, priority = 'medium', useBatch = false } = options;

    // Verificar cache primeiro
    if (useCache) {
      const cacheKey = this.getCacheKey(functionName, input);
      const cachedResult = this.getCachedResult<T>(cacheKey);
      if (cachedResult) {
        console.log(`💾 Cache hit para ${functionName}`);
        return cachedResult;
      }
    }

    // Usar processamento em lote se habilitado
    if (useBatch && priority !== 'high') {
      const batchId = await this.addToBatch({ functionName, input, priority });
      // Para lote, retornamos uma promise que resolve quando processado
      // Em uma implementação real, você manteria callbacks para resolver
      throw new Error('Batch processing - resultado será processado em lote');
    }

    // Chamar função diretamente
    try {
      const result = await this.callAIFunction(functionName, input);
      
      // Armazenar no cache
      if (useCache) {
        const cacheKey = this.getCacheKey(functionName, input);
        this.setCachedResult(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error(`❌ Erro ao chamar ${functionName}:`, error);
      throw error;
    }
  }

  // Estatísticas do cache
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).map(entry => ({
        key: entry.key,
        age: Date.now() - entry.timestamp
      }))
    };
  }

  // Limpar cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Instância singleton
const enhancedAIService = new EnhancedAIService();

// Hook principal
export function useEnhancedAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState(enhancedAIService.getCacheStats());

  const callAI = useCallback(async <T>(
    functionName: string,
    input: any,
    options?: {
      useCache?: boolean;
      priority?: 'high' | 'medium' | 'low';
      useBatch?: boolean;
    }
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await enhancedAIService.callEnhancedAI<T>(functionName, input, options);
      setCacheStats(enhancedAIService.getCacheStats());
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitFeedback = useCallback(async (
    functionName: string,
    input: any,
    output: any,
    rating: 'positive' | 'negative' | 'neutral',
    feedback?: string
  ) => {
    await enhancedAIService.submitFeedback({
      functionName,
      input,
      output,
      userRating: rating,
      feedback
    });
  }, []);

  const clearCache = useCallback(() => {
    enhancedAIService.clearCache();
    setCacheStats(enhancedAIService.getCacheStats());
  }, []);

  return {
    callAI,
    submitFeedback,
    clearCache,
    isLoading,
    error,
    cacheStats
  };
}

// Hook específico para insights financeiros aprimorados
export function useEnhancedFinancialInsights(transactions: any[]) {
  const { callAI, submitFeedback } = useEnhancedAI();
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    if (transactions.length === 0) return;

    setIsLoading(true);
    try {
      const result = await callAI('generate-insights', 
        { transactions },
        { 
          useCache: true, 
          priority: 'high' // Insights são importantes
        }
      );

      if (result && typeof result === 'object' && 'insights' in result) {
        setInsights((result as any).insights || []);
      } else {
        setInsights([]);
      }
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, [transactions, callAI]);

  const rateInsight = useCallback(async (
    insight: any, 
    rating: 'positive' | 'negative' | 'neutral',
    feedback?: string
  ) => {
    await submitFeedback(
      'generate-insights',
      { transactions },
      { insights: [insight] },
      rating,
      feedback
    );
  }, [transactions, submitFeedback]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  return {
    insights,
    isLoading,
    rateInsight,
    refreshInsights: generateInsights
  };
}

export default enhancedAIService;