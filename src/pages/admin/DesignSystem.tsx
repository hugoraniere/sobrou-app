import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Palette, 
  Type, 
  Layout, 
  MousePointer, 
  Circle,
  Square,
  Triangle,
  Star,
  Search,
  Copy
} from 'lucide-react';
import { iconLibrary, iconCategories, searchIcons } from '@/utils/iconLibrary';

const DesignSystem: React.FC = () => {
  const [selectedIconCategory, setSelectedIconCategory] = useState<string>('all');
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  

  const filteredIcons = searchIcons(iconSearchTerm, selectedIconCategory);

  const copyIconCode = (iconName: string) => {
    const code = `import { ${iconName} } from 'lucide-react';\n<${iconName} className="w-4 h-4" />`;
    navigator.clipboard.writeText(code);
    toast.success(`Código do ícone ${iconName} copiado!`);
  };
  const colorTokens = [
    { name: 'Primary', var: '--primary', class: 'bg-primary' },
    { name: 'Primary Foreground', var: '--primary-foreground', class: 'bg-primary-foreground' },
    { name: 'Secondary', var: '--secondary', class: 'bg-secondary' },
    { name: 'Secondary Foreground', var: '--secondary-foreground', class: 'bg-secondary-foreground' },
    { name: 'Muted', var: '--muted', class: 'bg-muted' },
    { name: 'Muted Foreground', var: '--muted-foreground', class: 'bg-muted-foreground' },
    { name: 'Accent', var: '--accent', class: 'bg-accent' },
    { name: 'Accent Foreground', var: '--accent-foreground', class: 'bg-accent-foreground' },
    { name: 'Border', var: '--border', class: 'bg-border' },
    { name: 'Background', var: '--background', class: 'bg-background' },
    { name: 'Foreground', var: '--foreground', class: 'bg-foreground' }
  ];

  const buttonVariants = [
    'default',
    'secondary',
    'outline',
    'ghost',
    'link',
    'destructive'
  ];

  const buttonSizes = [
    'sm',
    'default',
    'lg',
    'icon'
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Design System
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Documentação visual dos tokens, componentes e padrões de design utilizados no projeto.
        </p>
      </div>

      {/* Color Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Tokens de Cor
          </CardTitle>
          <CardDescription>
            Paleta de cores base definida no sistema de design.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="space-y-2">
                <div 
                  className={`w-full h-20 rounded-lg border border-border ${token.class}`}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{token.name}</p>
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {token.var}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Tipografia
          </CardTitle>
          <CardDescription>
            Hierarquia tipográfica e estilos de texto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1 - 4xl/Bold</h1>
            <h2 className="text-3xl font-semibold">Heading 2 - 3xl/Semibold</h2>
            <h3 className="text-2xl font-semibold">Heading 3 - 2xl/Semibold</h3>
            <h4 className="text-xl font-medium">Heading 4 - xl/Medium</h4>
            <h5 className="text-lg font-medium">Heading 5 - lg/Medium</h5>
            <h6 className="text-base font-medium">Heading 6 - base/Medium</h6>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <p className="text-lg">Large text - Texto de destaque ou lide</p>
            <p className="text-base">Body text - Texto de corpo padrão</p>
            <p className="text-sm">Small text - Texto auxiliar ou legendas</p>
            <p className="text-xs text-muted-foreground">Extra small - Metadata ou detalhes</p>
          </div>
        </CardContent>
      </Card>

      {/* Components - Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5" />
            Componentes - Botões
          </CardTitle>
          <CardDescription>
            Variações e estados dos botões do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">VARIANTES</h4>
            <div className="flex flex-wrap gap-3">
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant as any}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">TAMANHOS</h4>
            <div className="flex flex-wrap items-center gap-3">
              {buttonSizes.map((size) => (
                <Button key={size} size={size as any}>
                  {size === 'icon' ? <Star className="w-4 h-4" /> : `Size ${size}`}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">ESTADOS</h4>
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button className="opacity-80">Loading State</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components - Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Componentes - Formulários
          </CardTitle>
          <CardDescription>
            Elementos de entrada e interação do usuário.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Input Normal</label>
                <Input placeholder="Digite algo..." />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Input com Erro</label>
                <Input placeholder="Campo obrigatório" className="border-destructive" />
                <p className="text-sm text-destructive mt-1">Campo obrigatório</p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Input Disabled</label>
                <Input placeholder="Campo desabilitado" disabled />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Badges</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ícones</label>
                <div className="flex gap-3">
                  <Circle className="w-6 h-6 text-primary" />
                  <Square className="w-6 h-6 text-secondary" />
                  <Triangle className="w-6 h-6 text-accent" />
                  <Star className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing and Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Espaçamento e Layout
          </CardTitle>
          <CardDescription>
            Sistema de espaçamento e breakpoints responsivos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">ESPAÇAMENTOS PRINCIPAIS</h4>
            <div className="space-y-3">
              {[1, 2, 4, 6, 8, 12, 16, 20, 24].map((space) => (
                <div key={space} className="flex items-center gap-4">
                  <code className="text-sm bg-muted px-2 py-1 rounded w-16">
                    {space * 4}px
                  </code>
                  <div 
                    className="bg-primary h-4 rounded"
                    style={{ width: `${space * 4}px` }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {space === 1 ? 'xs' : space === 2 ? 'sm' : space === 4 ? 'md' : space === 6 ? 'lg' : space === 8 ? 'xl' : space === 12 ? '2xl' : space === 16 ? '3xl' : space === 20 ? '4xl' : '5xl'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">BREAKPOINTS RESPONSIVOS</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <code>sm</code>
                <span className="text-muted-foreground">640px</span>
              </div>
              <div className="flex justify-between">
                <code>md</code>
                <span className="text-muted-foreground">768px</span>
              </div>
              <div className="flex justify-between">
                <code>lg</code>
                <span className="text-muted-foreground">1024px</span>
              </div>
              <div className="flex justify-between">
                <code>xl</code>
                <span className="text-muted-foreground">1280px</span>
              </div>
              <div className="flex justify-between">
                <code>2xl</code>
                <span className="text-muted-foreground">1536px</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Design System baseado em Tailwind CSS e shadcn/ui
            </p>
            <p className="text-xs text-muted-foreground">
              Atualizado automaticamente conforme alterações nos tokens de design
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Biblioteca de Ícones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Biblioteca de Ícones
          </CardTitle>
          <CardDescription>
            Todos os ícones disponíveis no sistema, organizados por categoria.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedIconCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedIconCategory('all')}
            >
              Todos ({iconLibrary.length})
            </Badge>
            {Object.entries(iconCategories).map(([key, label]) => {
              const count = iconLibrary.filter(icon => icon.category === key).length;
              return (
                <Badge
                  key={key}
                  variant={selectedIconCategory === key ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedIconCategory(key)}
                >
                  {label} ({count})
                </Badge>
              );
            })}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ícones..."
              value={iconSearchTerm}
              onChange={(e) => setIconSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-96">
            <div className="grid grid-cols-8 gap-4">
              {filteredIcons.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <div
                    key={icon.name}
                    className="group flex flex-col items-center p-3 rounded-lg border hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => copyIconCode(icon.name)}
                    title={`${icon.name} - ${iconCategories[icon.category as keyof typeof iconCategories]}`}
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <span className="text-xs text-center truncate w-full">
                      {icon.name}
                    </span>
                    
                    {/* Keywords como tags */}
                    <div className="hidden group-hover:flex flex-wrap justify-center gap-1 mt-2">
                      {icon.keywords.slice(0, 2).map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-[10px] px-1 py-0">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Botão de copiar */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyIconCode(icon.name);
                        }}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhum ícone encontrado</p>
                <p className="text-sm">
                  Tente uma busca diferente ou selecione outra categoria
                </p>
              </div>
            )}
          </ScrollArea>

          <Separator />

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Como usar os ícones:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="font-mono bg-background rounded px-2 py-1">
                import &#123; IconName &#125; from 'lucide-react';
              </div>
              <div className="font-mono bg-background rounded px-2 py-1">
                &lt;IconName className="w-4 h-4" /&gt;
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignSystem;