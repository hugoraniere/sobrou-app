import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { 
  Palette, 
  Type, 
  Square, 
  Circle, 
  MousePointer, 
  Layout,
  Zap,
  Star,
  Heart,
  Check
} from 'lucide-react';

const DesignSystem: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Design System</h1>
          <p className="text-muted-foreground">
            Componentes, cores e padrões de design da aplicação
          </p>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Tipografia
          </TabsTrigger>
          <TabsTrigger value="components" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            Componentes
          </TabsTrigger>
          <TabsTrigger value="buttons" className="flex items-center gap-2">
            <MousePointer className="w-4 h-4" />
            Botões
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 bg-primary rounded-lg"></div>
                  <p className="text-sm font-medium">Primary</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--primary))</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 bg-secondary rounded-lg"></div>
                  <p className="text-sm font-medium">Secondary</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--secondary))</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 bg-accent rounded-lg"></div>
                  <p className="text-sm font-medium">Accent</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--accent))</p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 bg-muted rounded-lg"></div>
                  <p className="text-sm font-medium">Muted</p>
                  <p className="text-xs text-muted-foreground">hsl(var(--muted))</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold">Heading 1</h1>
                  <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Heading 2</h2>
                  <p className="text-sm text-muted-foreground">text-3xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Heading 3</h3>
                  <p className="text-sm text-muted-foreground">text-2xl font-bold</p>
                </div>
                <div>
                  <p className="text-base">Parágrafo normal</p>
                  <p className="text-sm text-muted-foreground">text-base</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Texto secundário</p>
                  <p className="text-sm text-muted-foreground">text-sm text-muted-foreground</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Componentes Básicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Input padrão" />
                  <Textarea placeholder="Textarea" />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Variações de Botões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Tamanhos</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Pequeno</Button>
                  <Button>Padrão</Button>
                  <Button size="lg">Grande</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Variantes</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Com Ícones</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Zap className="w-4 h-4 mr-2" />
                    Com Ícone
                  </Button>
                  <Button variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button variant="secondary">
                    <Heart className="w-4 h-4 mr-2" />
                    Curtir
                  </Button>
                  <Button variant="ghost">
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Espaçamentos</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-primary"></div>
                    <span className="text-sm">space-y-1 (4px)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-primary"></div>
                    <span className="text-sm">space-y-2 (8px)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary"></div>
                    <span className="text-sm">space-y-4 (16px)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary"></div>
                    <span className="text-sm">space-y-6 (24px)</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Grid System</h3>
                <div className="grid grid-cols-12 gap-2">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="h-8 bg-muted rounded text-xs flex items-center justify-center">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignSystem;