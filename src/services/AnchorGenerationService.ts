import html2canvas from 'html2canvas';
import { ElementMetadata, GeneratedAnchor } from '@/types/anchor-picking';
import { AnchorService } from './AnchorService';

export class AnchorGenerationService {
  private static readonly KIND_MAP: Record<string, string> = {
    'button': 'button',
    'input': 'input',
    'select': 'select',
    'textarea': 'input',
    'table': 'table',
    'form': 'card',
    'nav': 'tabs',
    'ul': 'list',
    'ol': 'list',
    'article': 'card',
    'section': 'card',
    'aside': 'card',
    'header': 'card',
    'footer': 'card',
    'main': 'card'
  };

  static extractMetadata(element: Element): ElementMetadata {
    const tagName = element.tagName.toLowerCase();
    
    return {
      tagName,
      text: this.extractText(element),
      ariaLabel: element.getAttribute('aria-label') || undefined,
      title: element.getAttribute('title') || undefined,
      placeholder: element.getAttribute('placeholder') || undefined,
      role: element.getAttribute('role') || undefined,
      className: element.className,
      id: element.id,
      tourId: element.getAttribute('data-tour-id') || undefined,
      selector: this.generateSelector(element)
    };
  }

  static generateFriendlyName(metadata: ElementMetadata): string {
    // Heurística para nome amigável em PT-BR
    if (metadata.ariaLabel) return metadata.ariaLabel;
    if (metadata.tourId) return metadata.tourId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (metadata.text.trim()) {
      const cleanText = metadata.text.trim().replace(/\s+/g, ' ');
      return cleanText.length > 50 ? cleanText.substring(0, 47) + '...' : cleanText;
    }
    if (metadata.placeholder) return metadata.placeholder;
    if (metadata.title) return metadata.title;
    
    // Fallback baseado no tipo/role
    const kind = this.detectKind(metadata);
    const fallbacks: Record<string, string> = {
      'button': 'Botão',
      'input': 'Campo de entrada',
      'select': 'Seleção',
      'table': 'Tabela',
      'card': 'Cartão',
      'list': 'Lista',
      'tabs': 'Abas',
      'chart': 'Gráfico',
      'other': 'Elemento'
    };
    
    return fallbacks[kind] || 'Componente';
  }

  static detectKind(metadata: ElementMetadata): string {
    const tag = metadata.tagName.toLowerCase();
    
    // Role-based detection
    if (metadata.role) {
      const roleMap: Record<string, string> = {
        'button': 'button',
        'tablist': 'tabs',
        'tab': 'tabs',
        'table': 'table',
        'grid': 'table',
        'list': 'list',
        'listbox': 'select',
        'combobox': 'select',
        'textbox': 'input',
        'searchbox': 'input'
      };
      if (roleMap[metadata.role]) return roleMap[metadata.role];
    }
    
    // Tag-based detection
    if (this.KIND_MAP[tag]) return this.KIND_MAP[tag];
    
    // Class-based heuristics
    const className = metadata.className.toLowerCase();
    if (className.includes('chart') || className.includes('graph')) return 'chart';
    if (className.includes('card')) return 'card';
    if (className.includes('tab')) return 'tabs';
    if (className.includes('table')) return 'table';
    if (className.includes('list')) return 'list';
    
    return 'other';
  }

  static generateAnchorId(route: string, metadata: ElementMetadata): string {
    const routeSlug = this.slugify(route.replace(/^\//, '')) || 'home';
    
    // Usar data-tour-id se disponível
    if (metadata.tourId) {
      return `${routeSlug}.${metadata.tourId}`;
    }
    
    // Gerar baseado no contexto
    const regionSlug = this.detectRegion(metadata);
    const elementSlug = this.generateElementSlug(metadata);
    const kind = this.detectKind(metadata);
    
    return `${routeSlug}.${regionSlug}.${elementSlug}-${kind}`;
  }

  private static detectRegion(metadata: ElementMetadata): string {
    const element = document.querySelector(metadata.selector);
    if (!element) return 'content';
    
    // Detectar região baseado nos ancestrais
    let current = element.parentElement;
    while (current && current !== document.body) {
      const className = current.className.toLowerCase();
      const tag = current.tagName.toLowerCase();
      
      if (tag === 'header' || className.includes('header')) return 'header';
      if (tag === 'nav' || className.includes('nav')) return 'nav';
      if (tag === 'aside' || className.includes('sidebar')) return 'sidebar';
      if (tag === 'footer' || className.includes('footer')) return 'footer';
      if (className.includes('modal') || className.includes('dialog')) return 'modal';
      
      current = current.parentElement;
    }
    
    return 'content';
  }

  private static generateElementSlug(metadata: ElementMetadata): string {
    // Usar ID se disponível
    if (metadata.id) return this.slugify(metadata.id);
    
    // Usar texto se curto
    if (metadata.text.length > 0 && metadata.text.length <= 30) {
      return this.slugify(metadata.text);
    }
    
    // Usar aria-label
    if (metadata.ariaLabel && metadata.ariaLabel.length <= 30) {
      return this.slugify(metadata.ariaLabel);
    }
    
    // Fallback baseado no tipo
    const kind = this.detectKind(metadata);
    return kind === 'other' ? 'element' : kind;
  }

  private static slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Espaços para hífens
      .replace(/-+/g, '-') // Múltiplos hífens para um
      .replace(/^-|-$/g, ''); // Remove hífens no início/fim
  }

  private static extractText(element: Element): string {
    // Para inputs, usar placeholder ou value
    if (element.tagName.toLowerCase() === 'input') {
      const input = element as HTMLInputElement;
      return input.placeholder || input.value || '';
    }
    
    // Para outros elementos, usar textContent filtrado
    const text = element.textContent || '';
    return text.trim().replace(/\s+/g, ' ').substring(0, 100);
  }

  private static generateSelector(element: Element): string {
    // Preferir data-tour-id
    const tourId = element.getAttribute('data-tour-id');
    if (tourId) return `[data-tour-id="${tourId}"]`;
    
    // Usar ID se disponível
    if (element.id) return `#${element.id}`;
    
    // Gerar seletor CSS único
    const path: string[] = [];
    let current: Element | null = element;
    
    while (current && current !== document.documentElement) {
      let selector = current.tagName.toLowerCase();
      
      // Adicionar classe se única
      if (current.className) {
        const classes = current.className.split(/\s+/).filter(Boolean);
        const uniqueClass = classes.find(cls => 
          document.querySelectorAll(`.${cls}`).length === 1
        );
        if (uniqueClass) selector += `.${uniqueClass}`;
      }
      
      // Adicionar nth-child se necessário
      if (current.parentElement) {
        const siblings = Array.from(current.parentElement.children);
        const sameTagSiblings = siblings.filter(s => s.tagName === current!.tagName);
        if (sameTagSiblings.length > 1) {
          const index = sameTagSiblings.indexOf(current) + 1;
          selector += `:nth-child(${index})`;
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }

  static async captureElementThumbnail(
    element: Element,
    bbox: DOMRect
  ): Promise<Blob | null> {
    try {
      // Usar requestIdleCallback para não bloquear UI
      return new Promise((resolve) => {
        const capture = async () => {
          try {
            const canvas = await html2canvas(element as HTMLElement, {
              width: Math.min(bbox.width, 400),
              height: Math.min(bbox.height, 300),
              scale: 0.8, // Qualidade moderada
              useCORS: true,
              allowTaint: true,
              backgroundColor: null
            });
            
            canvas.toBlob(resolve, 'image/png', 0.8);
          } catch (error) {
            console.warn('Thumbnail capture failed:', error);
            resolve(null);
          }
        };
        
        if ('requestIdleCallback' in window) {
          requestIdleCallback(capture);
        } else {
          setTimeout(capture, 0);
        }
      });
    } catch (error) {
      console.warn('Thumbnail capture error:', error);
      return null;
    }
  }

  static async generateAnchor(
    route: string,
    bbox: DOMRect,
    metadata: ElementMetadata
  ): Promise<GeneratedAnchor> {
    const anchor_id = this.generateAnchorId(route, metadata);
    const friendly_name = this.generateFriendlyName(metadata);
    const kind = this.detectKind(metadata);
    
    // Capturar thumbnail do elemento
    const element = document.querySelector(metadata.selector);
    const thumbnail = element ? await this.captureElementThumbnail(element, bbox) : null;
    
    return {
      anchor_id,
      friendly_name,
      kind,
      route,
      selector: metadata.selector,
      width: Math.round(bbox.width),
      height: Math.round(bbox.height),
      thumbnail: thumbnail || undefined
    };
  }

  static async persistAnchor(generatedAnchor: GeneratedAnchor): Promise<boolean> {
    try {
      // Upload thumbnail se disponível
      let thumb_url: string | undefined;
      
      if (generatedAnchor.thumbnail) {
        try {
          thumb_url = await AnchorService.uploadThumbnail(
            generatedAnchor.anchor_id,
            generatedAnchor.thumbnail,
            generatedAnchor.route
          );
        } catch (error) {
          console.warn('Thumbnail upload failed:', error);
        }
      }
      
      // Persistir âncora
      const result = await AnchorService.upsertAnchor(
        generatedAnchor.route,
        generatedAnchor.anchor_id,
        generatedAnchor.friendly_name,
        generatedAnchor.selector,
        generatedAnchor.kind as 'button' | 'input' | 'select' | 'table' | 'card' | 'tabs' | 'list' | 'chart' | 'other',
        thumb_url,
        generatedAnchor.width,
        generatedAnchor.height
      );
      
      return !!result;
    } catch (error) {
      console.error('Failed to persist anchor:', error);
      return false;
    }
  }
}