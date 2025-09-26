import * as LucideIcons from 'lucide-react';

export interface IconInfo {
  name: string;
  category: string;
  component: React.ComponentType<any>;
  keywords: string[];
}

// Categorização dos ícones mais utilizados
export const iconCategories = {
  interface: 'Interface',
  business: 'Negócios',
  content: 'Conteúdo',
  system: 'Sistema',
  communication: 'Comunicação',
  media: 'Mídia',
  navigation: 'Navegação',
  actions: 'Ações'
};

// Biblioteca de ícones organizados por categoria
export const iconLibrary: IconInfo[] = [
  // Interface
  { name: 'Home', category: 'interface', component: LucideIcons.Home, keywords: ['casa', 'início', 'home'] },
  { name: 'User', category: 'interface', component: LucideIcons.User, keywords: ['usuário', 'perfil', 'pessoa'] },
  { name: 'Settings', category: 'interface', component: LucideIcons.Settings, keywords: ['configurações', 'ajustes'] },
  { name: 'Search', category: 'interface', component: LucideIcons.Search, keywords: ['buscar', 'procurar', 'pesquisar'] },
  { name: 'Menu', category: 'interface', component: LucideIcons.Menu, keywords: ['menu', 'hambúrguer'] },
  { name: 'X', category: 'interface', component: LucideIcons.X, keywords: ['fechar', 'cancelar', 'x'] },
  { name: 'Plus', category: 'interface', component: LucideIcons.Plus, keywords: ['adicionar', 'mais', 'criar'] },
  { name: 'Minus', category: 'interface', component: LucideIcons.Minus, keywords: ['subtrair', 'menos', 'remover'] },
  { name: 'Edit', category: 'interface', component: LucideIcons.Edit, keywords: ['editar', 'modificar'] },
  { name: 'Trash', category: 'interface', component: LucideIcons.Trash, keywords: ['deletar', 'lixo', 'excluir'] },
  
  // Negócios
  { name: 'DollarSign', category: 'business', component: LucideIcons.DollarSign, keywords: ['dinheiro', 'moeda', 'financeiro'] },
  { name: 'TrendingUp', category: 'business', component: LucideIcons.TrendingUp, keywords: ['crescimento', 'lucro', 'subida'] },
  { name: 'TrendingDown', category: 'business', component: LucideIcons.TrendingDown, keywords: ['queda', 'perda', 'declínio'] },
  { name: 'BarChart', category: 'business', component: LucideIcons.BarChart, keywords: ['gráfico', 'análise', 'dados'] },
  { name: 'PieChart', category: 'business', component: LucideIcons.PieChart, keywords: ['pizza', 'distribuição', 'percentual'] },
  { name: 'Target', category: 'business', component: LucideIcons.Target, keywords: ['meta', 'objetivo', 'alvo'] },
  { name: 'Award', category: 'business', component: LucideIcons.Award, keywords: ['prêmio', 'conquista', 'medalha'] },
  { name: 'ShoppingCart', category: 'business', component: LucideIcons.ShoppingCart, keywords: ['carrinho', 'compras', 'loja'] },
  { name: 'CreditCard', category: 'business', component: LucideIcons.CreditCard, keywords: ['cartão', 'pagamento', 'crédito'] },
  { name: 'Wallet', category: 'business', component: LucideIcons.Wallet, keywords: ['carteira', 'dinheiro', 'bolso'] },
  
  // Conteúdo
  { name: 'FileText', category: 'content', component: LucideIcons.FileText, keywords: ['arquivo', 'documento', 'texto'] },
  { name: 'Image', category: 'content', component: LucideIcons.Image, keywords: ['imagem', 'foto', 'figura'] },
  { name: 'Video', category: 'content', component: LucideIcons.Video, keywords: ['vídeo', 'filme', 'gravação'] },
  { name: 'Music', category: 'content', component: LucideIcons.Music, keywords: ['música', 'áudio', 'som'] },
  { name: 'Book', category: 'content', component: LucideIcons.Book, keywords: ['livro', 'leitura', 'manual'] },
  { name: 'Bookmark', category: 'content', component: LucideIcons.Bookmark, keywords: ['favorito', 'salvar', 'marcar'] },
  { name: 'Tag', category: 'content', component: LucideIcons.Tag, keywords: ['etiqueta', 'categoria', 'tag'] },
  { name: 'Hash', category: 'content', component: LucideIcons.Hash, keywords: ['hashtag', 'cerquilha', 'número'] },
  
  // Sistema
  { name: 'Shield', category: 'system', component: LucideIcons.Shield, keywords: ['segurança', 'proteção', 'escudo'] },
  { name: 'Lock', category: 'system', component: LucideIcons.Lock, keywords: ['bloquear', 'trancar', 'privado'] },
  { name: 'Unlock', category: 'system', component: LucideIcons.Unlock, keywords: ['desbloquear', 'abrir', 'público'] },
  { name: 'Key', category: 'system', component: LucideIcons.Key, keywords: ['chave', 'acesso', 'senha'] },
  { name: 'Eye', category: 'system', component: LucideIcons.Eye, keywords: ['ver', 'visualizar', 'olho'] },
  { name: 'EyeOff', category: 'system', component: LucideIcons.EyeOff, keywords: ['ocultar', 'esconder', 'invisível'] },
  { name: 'Server', category: 'system', component: LucideIcons.Server, keywords: ['servidor', 'banco', 'dados'] },
  { name: 'Database', category: 'system', component: LucideIcons.Database, keywords: ['banco', 'dados', 'storage'] },
  { name: 'HardDrive', category: 'system', component: LucideIcons.HardDrive, keywords: ['disco', 'armazenamento', 'hd'] },
  
  // Comunicação
  { name: 'MessageSquare', category: 'communication', component: LucideIcons.MessageSquare, keywords: ['mensagem', 'chat', 'conversa'] },
  { name: 'Mail', category: 'communication', component: LucideIcons.Mail, keywords: ['email', 'correio', 'carta'] },
  { name: 'Phone', category: 'communication', component: LucideIcons.Phone, keywords: ['telefone', 'ligar', 'chamada'] },
  { name: 'MessageCircle', category: 'communication', component: LucideIcons.MessageCircle, keywords: ['comentário', 'feedback', 'balão'] },
  { name: 'Users', category: 'communication', component: LucideIcons.Users, keywords: ['usuários', 'pessoas', 'grupo'] },
  { name: 'UserPlus', category: 'communication', component: LucideIcons.UserPlus, keywords: ['adicionar', 'convidar', 'novo usuário'] },
  { name: 'Share', category: 'communication', component: LucideIcons.Share, keywords: ['compartilhar', 'enviar', 'distribuir'] },
  
  // Mídia
  { name: 'Play', category: 'media', component: LucideIcons.Play, keywords: ['reproduzir', 'iniciar', 'play'] },
  { name: 'Pause', category: 'media', component: LucideIcons.Pause, keywords: ['pausar', 'parar', 'pause'] },
  { name: 'Square', category: 'media', component: LucideIcons.Square, keywords: ['parar', 'finalizar', 'stop'] },
  { name: 'Volume2', category: 'media', component: LucideIcons.Volume2, keywords: ['som', 'áudio', 'volume'] },
  { name: 'VolumeX', category: 'media', component: LucideIcons.VolumeX, keywords: ['mudo', 'silenciar', 'sem som'] },
  { name: 'Camera', category: 'media', component: LucideIcons.Camera, keywords: ['câmera', 'foto', 'capturar'] },
  { name: 'Mic', category: 'media', component: LucideIcons.Mic, keywords: ['microfone', 'gravar', 'áudio'] },
  
  // Navegação
  { name: 'ArrowLeft', category: 'navigation', component: LucideIcons.ArrowLeft, keywords: ['voltar', 'esquerda', 'anterior'] },
  { name: 'ArrowRight', category: 'navigation', component: LucideIcons.ArrowRight, keywords: ['avançar', 'direita', 'próximo'] },
  { name: 'ArrowUp', category: 'navigation', component: LucideIcons.ArrowUp, keywords: ['subir', 'cima', 'topo'] },
  { name: 'ArrowDown', category: 'navigation', component: LucideIcons.ArrowDown, keywords: ['descer', 'baixo', 'fundo'] },
  { name: 'ChevronLeft', category: 'navigation', component: LucideIcons.ChevronLeft, keywords: ['anterior', 'voltar', 'esquerda'] },
  { name: 'ChevronRight', category: 'navigation', component: LucideIcons.ChevronRight, keywords: ['próximo', 'avançar', 'direita'] },
  { name: 'ChevronUp', category: 'navigation', component: LucideIcons.ChevronUp, keywords: ['expandir', 'subir', 'cima'] },
  { name: 'ChevronDown', category: 'navigation', component: LucideIcons.ChevronDown, keywords: ['expandir', 'descer', 'baixo'] },
  
  // Ações
  { name: 'Check', category: 'actions', component: LucideIcons.Check, keywords: ['confirmar', 'ok', 'sucesso'] },
  { name: 'CheckCircle', category: 'actions', component: LucideIcons.CheckCircle, keywords: ['concluído', 'aprovado', 'sucesso'] },
  { name: 'AlertCircle', category: 'actions', component: LucideIcons.AlertCircle, keywords: ['alerta', 'atenção', 'aviso'] },
  { name: 'AlertTriangle', category: 'actions', component: LucideIcons.AlertTriangle, keywords: ['cuidado', 'perigo', 'erro'] },
  { name: 'Info', category: 'actions', component: LucideIcons.Info, keywords: ['informação', 'detalhes', 'sobre'] },
  { name: 'HelpCircle', category: 'actions', component: LucideIcons.HelpCircle, keywords: ['ajuda', 'dúvida', 'suporte'] },
  { name: 'Download', category: 'actions', component: LucideIcons.Download, keywords: ['baixar', 'salvar', 'download'] },
  { name: 'Upload', category: 'actions', component: LucideIcons.Upload, keywords: ['enviar', 'subir', 'upload'] },
  { name: 'RefreshCw', category: 'actions', component: LucideIcons.RefreshCw, keywords: ['atualizar', 'recarregar', 'sincronizar'] },
  { name: 'Copy', category: 'actions', component: LucideIcons.Copy, keywords: ['copiar', 'duplicar', 'clonar'] },
  { name: 'ExternalLink', category: 'actions', component: LucideIcons.ExternalLink, keywords: ['link', 'externo', 'abrir'] },
  
  // Específicos para landing page
  { name: 'Zap', category: 'business', component: LucideIcons.Zap, keywords: ['rápido', 'energia', 'automação'] },
  { name: 'Brain', category: 'system', component: LucideIcons.Brain, keywords: ['inteligência', 'ai', 'artificial'] },
  { name: 'Smartphone', category: 'communication', component: LucideIcons.Smartphone, keywords: ['celular', 'whatsapp', 'móvel'] },
  { name: 'Bell', category: 'actions', component: LucideIcons.Bell, keywords: ['notificação', 'alerta', 'aviso'] },
  { name: 'Lightbulb', category: 'actions', component: LucideIcons.Lightbulb, keywords: ['ideia', 'insight', 'lâmpada'] },
  { name: 'FileCheck', category: 'content', component: LucideIcons.FileCheck, keywords: ['documento', 'aprovado', 'verificado'] }
];

// Função para buscar ícones
export const searchIcons = (query: string, category?: string): IconInfo[] => {
  let filteredIcons = iconLibrary;
  
  if (category && category !== 'all') {
    filteredIcons = iconLibrary.filter(icon => icon.category === category);
  }
  
  if (query.trim()) {
    const searchTerm = query.toLowerCase().trim();
    filteredIcons = filteredIcons.filter(icon => 
      icon.name.toLowerCase().includes(searchTerm) ||
      icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }
  
  return filteredIcons;
};

// Função para obter componente do ícone por nome
export const getIconComponent = (iconName: string): React.ComponentType<any> | null => {
  const icon = iconLibrary.find(icon => icon.name === iconName);
  return icon ? icon.component : null;
};

// Função para obter nomes de ícones de uma categoria
export const getIconsByCategory = (category: string): IconInfo[] => {
  return iconLibrary.filter(icon => icon.category === category);
};

export default iconLibrary;