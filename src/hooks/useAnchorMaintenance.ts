import { useState, useCallback, useEffect } from 'react';
import { AnchorMaintenanceService } from '@/services/AnchorMaintenanceService';
import { AnchorReindexService } from '@/services/AnchorReindexService';
import { OnboardingAnchor } from '@/types/onboarding-anchors';
import { AnchorStatus, InvalidAnchorSuggestion, ThumbnailCleanupResult } from '@/types/anchor-maintenance';

export const useAnchorMaintenance = () => {
  const [anchorStatuses, setAnchorStatuses] = useState<Map<string, AnchorStatus>>(new Map());
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);
  const [suggestions, setSuggestions] = useState<InvalidAnchorSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const maintenanceService = AnchorMaintenanceService.getInstance();
  const reindexService = AnchorReindexService.getInstance();

  const checkAnchorStatus = useCallback(async (anchor: OnboardingAnchor) => {
    try {
      const status = await reindexService.getAnchorStatus(anchor);
      setAnchorStatuses(prev => new Map(prev).set(anchor.anchor_id, status));
      return status;
    } catch (error) {
      console.error('Error checking anchor status:', error);
      return {
        isValid: false,
        hasValidSelector: false,
        hasThumbnail: false,
        needsUpdate: true
      };
    }
  }, [reindexService]);

  const checkMultipleAnchorsStatus = useCallback(async (anchors: OnboardingAnchor[]) => {
    setIsLoadingStatuses(true);
    try {
      const statusPromises = anchors.map(anchor => 
        checkAnchorStatus(anchor).then(status => ({ anchor, status }))
      );
      
      const results = await Promise.all(statusPromises);
      const newStatuses = new Map(anchorStatuses);
      
      results.forEach(({ anchor, status }) => {
        newStatuses.set(anchor.anchor_id, status);
      });
      
      setAnchorStatuses(newStatuses);
    } finally {
      setIsLoadingStatuses(false);
    }
  }, [anchorStatuses, checkAnchorStatus]);

  const findSimilarElements = useCallback(async (invalidAnchor: OnboardingAnchor) => {
    setIsLoadingSuggestions(true);
    try {
      const newSuggestions = await maintenanceService.findSimilarElements(invalidAnchor);
      setSuggestions(newSuggestions);
      
      // Track event
      await maintenanceService.trackEvent({
        type: 'anchor_marked_invalid',
        anchorId: invalidAnchor.anchor_id,
        route: invalidAnchor.route,
        timestamp: Date.now()
      });
      
      return newSuggestions;
    } catch (error) {
      console.error('Error finding similar elements:', error);
      return [];
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [maintenanceService]);

  const archiveAnchor = useCallback(async (anchorId: string) => {
    try {
      await maintenanceService.archiveAnchor(anchorId);
      
      // Update status to reflect archived state
      setAnchorStatuses(prev => {
        const newStatuses = new Map(prev);
        const currentStatus = newStatuses.get(anchorId);
        if (currentStatus) {
          newStatuses.set(anchorId, {
            ...currentStatus,
            isValid: false // Archived anchors are considered "invalid" for UI purposes
          });
        }
        return newStatuses;
      });

      // Track event
      await maintenanceService.trackEvent({
        type: 'anchor_archived',
        anchorId,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Error archiving anchor:', error);
      throw error;
    }
  }, [maintenanceService]);

  const cleanupThumbnails = useCallback(async (): Promise<ThumbnailCleanupResult> => {
    try {
      return await maintenanceService.cleanupOldThumbnails();
    } catch (error) {
      console.error('Error cleaning up thumbnails:', error);
      throw error;
    }
  }, [maintenanceService]);

  const validateAnchor = useCallback(async (anchor: OnboardingAnchor) => {
    try {
      return await maintenanceService.validateAnchorIntegrity(anchor);
    } catch (error) {
      console.error('Error validating anchor:', error);
      return {
        isValid: false,
        issues: ['Erro ao validar âncora'],
        suggestions: ['Tentar novamente']
      };
    }
  }, [maintenanceService]);

  const getAnchorStatus = useCallback((anchorId: string): AnchorStatus | undefined => {
    return anchorStatuses.get(anchorId);
  }, [anchorStatuses]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    // Status management
    anchorStatuses,
    isLoadingStatuses,
    checkAnchorStatus,
    checkMultipleAnchorsStatus,
    getAnchorStatus,

    // Suggestions for invalid anchors
    suggestions,
    isLoadingSuggestions,
    findSimilarElements,
    clearSuggestions,

    // Maintenance actions
    archiveAnchor,
    cleanupThumbnails,
    validateAnchor
  };
};