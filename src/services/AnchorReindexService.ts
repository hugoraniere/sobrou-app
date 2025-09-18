import { AnchorService } from './AnchorService';
import { AnchorGenerationService } from './AnchorGenerationService';
import { OnboardingAnchor } from '@/types/onboarding-anchors';
import { AnchorReindexProgress, AnchorStatus } from '@/types/anchor-maintenance';

export class AnchorReindexService {
  private static instance: AnchorReindexService;
  
  static getInstance(): AnchorReindexService {
    if (!this.instance) {
      this.instance = new AnchorReindexService();
    }
    return this.instance;
  }

  async reindexRouteAnchors(
    route: string, 
    onProgress: (progress: AnchorReindexProgress) => void
  ): Promise<AnchorReindexProgress> {
    const progress: AnchorReindexProgress = {
      total: 0,
      current: 0,
      status: 'scanning',
      errors: [],
      updated: 0,
      created: 0,
      invalid: 0
    };

    try {
      // Get existing anchors for this route
      const existingAnchors = await AnchorService.getAnchorsByRoute(route);
      
      // Get elements from current page (if it matches the route)
      const elementsWithTourId = this.scanCurrentPageForTourElements();
      
      progress.total = Math.max(existingAnchors.length, elementsWithTourId.length);
      progress.status = 'processing';
      onProgress(progress);

      const processedAnchorIds = new Set<string>();

      // Process elements found on page
      for (const element of elementsWithTourId) {
        progress.current++;
        const tourId = element.getAttribute('data-tour-id');
        if (!tourId) continue;

        try {
          const bbox = element.getBoundingClientRect();
          const metadata = AnchorGenerationService.extractMetadata(element);
          const anchorId = AnchorGenerationService.generateAnchorId(route, metadata);
          
          progress.currentAnchor = anchorId;
          onProgress(progress);

          // Check if anchor exists
          const existingAnchor = existingAnchors.find(a => a.anchor_id === anchorId);
          
          if (existingAnchor) {
            // Update existing anchor if needed
            const needsUpdate = this.anchorNeedsUpdate(existingAnchor, metadata);
            if (needsUpdate) {
              await this.updateAnchor(existingAnchor, element, bbox, metadata, route);
              progress.updated++;
            }
          } else {
            // Create new anchor
            const generatedAnchor = await AnchorGenerationService.generateAnchor(route, bbox, metadata);
            await AnchorGenerationService.persistAnchor(generatedAnchor);
            progress.created++;
          }

          processedAnchorIds.add(anchorId);
          
          // Mark as verified
          await AnchorService.markAsVerified(anchorId);

        } catch (error) {
          console.error('Error processing element:', error);
          progress.errors.push(`Erro ao processar elemento ${tourId}: ${error}`);
        }

        // Throttle to avoid blocking UI
        await this.sleep(100);
      }

      // Mark unprocessed anchors as invalid
      for (const anchor of existingAnchors) {
        if (!processedAnchorIds.has(anchor.anchor_id)) {
          progress.invalid++;
          // Note: We don't delete, just mark as invalid in UI
        }
      }

      progress.status = 'completed';
      onProgress(progress);

      return progress;

    } catch (error) {
      progress.status = 'error';
      progress.errors.push(`Erro geral: ${error}`);
      onProgress(progress);
      throw error;
    }
  }

  private scanCurrentPageForTourElements(): Element[] {
    return Array.from(document.querySelectorAll('[data-tour-id]'));
  }

  private anchorNeedsUpdate(anchor: OnboardingAnchor, metadata: any): boolean {
    const daysSinceUpdate = anchor.updated_at 
      ? (Date.now() - new Date(anchor.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    return daysSinceUpdate > 7 || // Update weekly
           !anchor.thumb_url ||     // Missing thumbnail
           anchor.friendly_name !== AnchorGenerationService.generateFriendlyName(metadata);
  }

  private async updateAnchor(
    anchor: OnboardingAnchor, 
    element: Element,
    bbox: DOMRect,
    metadata: any,
    route: string
  ): Promise<void> {
    const updates: any = {
      friendly_name: AnchorGenerationService.generateFriendlyName(metadata),
      kind: AnchorGenerationService.detectKind(metadata),
      selector: element.getAttribute('data-tour-id') ? `[data-tour-id="${element.getAttribute('data-tour-id')}"]` : '',
      width: Math.round(bbox.width),
      height: Math.round(bbox.height)
    };

    // Update thumbnail if needed
    if (!anchor.thumb_url || this.thumbnailNeedsUpdate(anchor)) {
      try {
        const thumbnail = await AnchorGenerationService.captureElementThumbnail(element, bbox);
        if (thumbnail) {
          const thumbUrl = await AnchorService.uploadThumbnail(
            anchor.anchor_id, 
            thumbnail, 
            route
          );
          updates.thumb_url = thumbUrl;
        }
      } catch (error) {
        console.warn('Failed to update thumbnail:', error);
      }
    }

    await AnchorService.updateAnchor(anchor.id, updates);
  }

  private thumbnailNeedsUpdate(anchor: OnboardingAnchor): boolean {
    if (!anchor.updated_at) return true;
    
    const daysSinceUpdate = (Date.now() - new Date(anchor.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 30; // Update thumbnails monthly
  }

  async getAnchorStatus(anchor: OnboardingAnchor): Promise<AnchorStatus> {
    const element = document.querySelector(anchor.selector || `[data-tour-id="${anchor.anchor_id}"]`);
    
    return {
      isValid: !!element,
      lastVerified: anchor.last_verified_at,
      hasValidSelector: !!anchor.selector && !!element,
      hasThumbnail: !!anchor.thumb_url,
      needsUpdate: this.anchorNeedsUpdate(anchor, {})
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}