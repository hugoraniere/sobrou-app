import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewTicket = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/suporte")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Suporte
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Ticket</CardTitle>
            <p className="text-sm text-muted-foreground">
              Descreva seu problema ou dúvida e nossa equipe entrará em contato.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug/Erro técnico</SelectItem>
                    <SelectItem value="feature">Solicitação de funcionalidade</SelectItem>
                    <SelectItem value="account">Problemas com conta</SelectItem>
                    <SelectItem value="billing">Cobrança</SelectItem>
                    <SelectItem value="general">Dúvida geral</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input 
                id="subject"
                placeholder="Descreva brevemente o problema"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição detalhada</Label>
              <Textarea 
                id="description"
                placeholder="Forneça mais detalhes sobre o problema, incluindo quando ocorreu e os passos para reproduzir"
                className="mt-1 min-h-32"
              />
            </div>

            <Button size="lg" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Enviar Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewTicket;