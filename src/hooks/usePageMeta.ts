import { useEffect } from 'react';

interface PageMetaData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export const usePageMeta = (meta: PageMetaData) => {
  useEffect(() => {
    // Update document title
    if (meta.title) {
      document.title = `${meta.title} | Sobrou`;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property) {
          metaTag.setAttribute('property', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    // Update canonical URL
    const updateCanonical = (url: string) => {
      let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', url);
    };

    // Basic meta tags
    if (meta.description) {
      updateMetaTag('description', meta.description);
    }
    
    if (meta.keywords) {
      updateMetaTag('keywords', meta.keywords);
    }

    // Open Graph tags
    if (meta.title) {
      updateMetaTag('og:title', meta.title, true);
    }
    
    if (meta.description) {
      updateMetaTag('og:description', meta.description, true);
    }
    
    if (meta.image) {
      updateMetaTag('og:image', meta.image, true);
    }
    
    if (meta.url) {
      updateMetaTag('og:url', meta.url, true);
      updateCanonical(meta.url);
    }
    
    if (meta.type) {
      updateMetaTag('og:type', meta.type, true);
    }
    
    if (meta.publishedTime) {
      updateMetaTag('article:published_time', meta.publishedTime, true);
    }
    
    if (meta.modifiedTime) {
      updateMetaTag('article:modified_time', meta.modifiedTime, true);
    }
    
    if (meta.author) {
      updateMetaTag('article:author', meta.author, true);
    }
    
    if (meta.tags && meta.tags.length > 0) {
      meta.tags.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.setAttribute('content', tag);
        document.head.appendChild(tagElement);
      });
    }

    // Twitter tags
    if (meta.title) {
      updateMetaTag('twitter:title', meta.title);
    }
    
    if (meta.description) {
      updateMetaTag('twitter:description', meta.description);
    }
    
    if (meta.image) {
      updateMetaTag('twitter:image', meta.image);
    }

    // Cleanup function to remove dynamically added tags on unmount
    return () => {
      if (meta.tags && meta.tags.length > 0) {
        const tagElements = document.querySelectorAll('meta[property="article:tag"]');
        tagElements.forEach(element => element.remove());
      }
    };
  }, [meta]);
};