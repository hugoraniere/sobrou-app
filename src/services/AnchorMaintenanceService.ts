import { AnchorService } from './AnchorService';
import { OnboardingAnchor } from '@/types/onboarding-anchors';
import { InvalidAnchorSuggestion, ThumbnailCleanupResult, AnchorMaintenanceEvent } from '@/types/anchor-maintenance';
import { supabase } from '@/integrations/supabase/client';

export class AnchorMaintenanceService {
  private static instance: AnchorMaintenanceService;
  
  static getInstance(): AnchorMaintenanceService {
    if (!this.instance) {
      this.instance = new AnchorMaintenanceService();
    }
    return this.instance;
  }

  async findSimilarElements(invalidAnchor: OnboardingAnchor): Promise<InvalidAnchorSuggestion[]> {
    const suggestions: InvalidAnchorSuggestion[] = [];
    const selectableElements = document.querySelectorAll('button, input, select, [role="button"], [data-tour-id]');

    for (const element of Array.from(selectableElements)) {
      const suggestion = this.calculateSimilarity(invalidAnchor, element);
      if (suggestion.score > 0.3) { // Only suggest if 30%+ similar
        suggestions.push(suggestion);
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 suggestions
  }

  private calculateSimilarity(anchor: OnboardingAnchor, element: Element): InvalidAnchorSuggestion {
    const elementText = this.extractElementText(element);
    const elementRole = this.getElementRole(element);
    const elementRect = element.getBoundingClientRect();

    // Text similarity (Levenshtein distance)
    const textScore = this.calculateTextSimilarity(anchor.friendly_name, elementText);
    
    // Role/kind similarity
    const roleScore = anchor.kind === elementRole ? 1 : 0;
    
    // Position similarity (based on original position if available)
    const positionScore = 0.5; // Placeholder since we don't store original position

    const totalScore = (textScore * 0.5) + (roleScore * 0.3) + (positionScore * 0.2);

    return {
      element,
      score: totalScore,
      reason: this.generateSuggestionReason(textScore, roleScore, positionScore),
      similarity: {
        text: textScore,
        role: roleScore,
        position: positionScore
      }
    };
  }

  private extractElementText(element: Element): string {
    return element.textContent?.trim() || 
           (element as HTMLInputElement).placeholder || 
           element.getAttribute('aria-label') ||
           element.getAttribute('title') || '';
  }

  private getElementRole(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    if (role) return role;
    
    switch (tagName) {
      case 'button': return 'button';
      case 'input': return 'input';
      case 'select': return 'select';
      case 'table': return 'table';
      default: 
        if (element.classList.contains('chart')) return 'chart';
        if (element.classList.contains('card')) return 'card';
        return 'other';
    }
  }

  private calculateTextSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    const distance = this.levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return 1 - (distance / maxLength);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private generateSuggestionReason(textScore: number, roleScore: number, positionScore: number): string {
    const reasons = [];
    if (textScore > 0.7) reasons.push('texto similar');
    if (roleScore > 0.8) reasons.push('mesmo tipo');
    if (positionScore > 0.6) reasons.push('posição próxima');
    
    return reasons.length > 0 ? reasons.join(', ') : 'elemento relacionado';
  }

  async archiveAnchor(anchorId: string): Promise<void> {
    // For now, we'll add an "archived" tag to mark it as archived
    const anchor = await AnchorService.getAnchorByAnchorId(anchorId);
    if (anchor) {
      const currentTags = anchor.tags || [];
      if (!currentTags.includes('archived')) {
        await AnchorService.updateAnchor(anchor.id, {
          tags: [...currentTags, 'archived']
        });
      }
    }
  }

  async cleanupOldThumbnails(): Promise<ThumbnailCleanupResult> {
    const result: ThumbnailCleanupResult = {
      cleaned: 0,
      errors: [],
      totalSize: 0
    };

    try {
      // Get all anchors
      const anchors = await AnchorService.getAllAnchors();
      const anchorsByAnchorId = new Map<string, OnboardingAnchor[]>();

      // Group by anchor_id to find duplicates
      for (const anchor of anchors) {
        if (!anchorsByAnchorId.has(anchor.anchor_id)) {
          anchorsByAnchorId.set(anchor.anchor_id, []);
        }
        anchorsByAnchorId.get(anchor.anchor_id)!.push(anchor);
      }

      // Clean up duplicates for each anchor_id
      for (const [anchorId, duplicates] of anchorsByAnchorId) {
        if (duplicates.length > 1) {
          // Keep the most recent one
          const sortedByDate = duplicates.sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          const toKeep = sortedByDate[0];
          const toDelete = sortedByDate.slice(1);

          for (const anchor of toDelete) {
            try {
              if (anchor.thumb_url) {
                await AnchorService.deleteThumbnail(anchor.thumb_url);
                result.cleaned++;
              }
              // Note: We're not deleting the anchor record itself, just the thumbnail
            } catch (error) {
              result.errors.push(`Erro ao limpar thumbnail ${anchor.id}: ${error}`);
            }
          }
        }
      }

    } catch (error) {
      result.errors.push(`Erro geral na limpeza: ${error}`);
    }

    return result;
  }

  async trackEvent(event: AnchorMaintenanceEvent): Promise<void> {
    // Optional telemetry - could be implemented later
    console.log('Anchor maintenance event:', event);
    
    // Could send to analytics service here
    // await analytics.track(event.type, event);
  }

  async testAnchorSelector(anchor: OnboardingAnchor): Promise<boolean> {
    try {
      if (!anchor.selector) return false;
      const element = document.querySelector(anchor.selector);
      return !!element;
    } catch (error) {
      return false;
    }
  }

  async validateAnchorIntegrity(anchor: OnboardingAnchor): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check if selector works
    if (anchor.selector) {
      const selectorWorks = await this.testAnchorSelector(anchor);
      if (!selectorWorks) {
        issues.push('Seletor CSS inválido');
        suggestions.push('Reindexar âncora para atualizar seletor');
      }
    } else {
      issues.push('Seletor CSS ausente');
      suggestions.push('Adicionar seletor CSS válido');
    }

    // Check thumbnail
    if (!anchor.thumb_url) {
      issues.push('Thumbnail ausente');
      suggestions.push('Gerar nova thumbnail');
    }

    // Check if recently verified
    if (anchor.last_verified_at) {
      const daysSinceVerification = (Date.now() - new Date(anchor.last_verified_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceVerification > 30) {
        issues.push('Verificação desatualizada');
        suggestions.push('Verificar âncora na aplicação');
      }
    } else {
      issues.push('Nunca foi verificada');
      suggestions.push('Verificar âncora na aplicação');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}
