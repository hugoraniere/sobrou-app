import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SupportLayout from '@/components/support/SupportLayout';
import SentimentSelector from '@/components/support/SentimentSelector';
import FileUpload from '@/components/support/FileUpload';
import { TicketService } from '@/services/ticketService';
import { CreateTicketData } from '@/types/support';
import { useToast } from '@/hooks/use-toast';

const ticketSchema = z.object({
  type: z.enum(['bug', 'solicitacao', 'reclamacao', 'duvida'] as const),
  category: z.string().min(1, 'Categoria é obrigatória'),
  subject: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  priority: z.enum(['baixa', 'media', 'alta'] as const),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface UploadedFile extends File {
  preview?: string;
}

const CATEGORIES = [
  'Dashboard',
  'Transações',
  'Contas a Pagar',
  'Metas de Economia',
  'Relatórios',
  'WhatsApp',
  'Login/Cadastro',
  'Problemas Técnicos',
  'Outros'
];

const NewTicket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema)
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      setIsSubmitting(true);
      const ticketData: CreateTicketData = {
        type: data.type,
        category: data.category,
        subject: data.subject,
        description: data.description,
        priority: data.priority
      };

      const ticket = await TicketService.createTicket(ticketData);

      // Upload attachments if any
      if (attachments.length > 0) {
        try {
          await Promise.all(
            attachments.map(file => TicketService.uploadAttachment(ticket.id, file))
          );
        } catch (uploadError) {
          console.warn('Error uploading attachments:', uploadError);
          // Continue anyway - ticket was created successfully
        }
      }
      
      toast({ 
        message: 'Ticket criado com sucesso! Nossa equipe entrará em contato em breve.',
        type: 'success'
      });
      
      navigate('/suporte/meus-tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        message: 'Erro ao criar ticket. Tente novamente mais tarde.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SupportLayout showBackButton currentPage="Novo Ticket">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Ticket</CardTitle>
            <p className="text-sm text-muted-foreground">
              Descreva seu problema ou dúvida e nossa equipe entrará em contato.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select onValueChange={(value) => setValue('type', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug/Erro técnico</SelectItem>
                    <SelectItem value="solicitacao">Solicitação</SelectItem>
                    <SelectItem value="reclamacao">Reclamação</SelectItem>
                    <SelectItem value="duvida">Dúvida</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
                )}
              </div>

              <SentimentSelector
                value={watch('priority')}
                onChange={(value) => setValue('priority', value as any)}
                error={errors.priority?.message}
              />

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subject">Título</Label>
                <Input 
                  {...register('subject')}
                  placeholder="Descreva brevemente o problema"
                  className="mt-1"
                />
                {errors.subject && (
                  <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descrição detalhada</Label>
                <Textarea 
                  {...register('description')}
                  placeholder="Forneça mais detalhes sobre o problema, incluindo quando ocorreu e os passos para reproduzir"
                  className="mt-1 min-h-32"
                />
                {errors.description && (
                  <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              <FileUpload
                files={attachments}
                onFilesChange={setAttachments}
                maxFiles={3}
              />

              <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SupportLayout>
  );
};

export default NewTicket;