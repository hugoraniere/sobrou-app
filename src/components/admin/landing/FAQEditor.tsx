import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLandingPage } from '@/contexts/LandingPageContext';
import { FAQItem } from '@/services/landingPageService';
import { Save, Trash2, Plus } from 'lucide-react';

const FAQEditor: React.FC = () => {
  const { getConfig, updateConfig } = useLandingPage();
  const [config, setConfig] = useState<{ title: string; subtitle: string; questions: FAQItem[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const faqConfig = getConfig('faq');
    if (faqConfig) {
      setConfig(faqConfig.content);
    }
  }, [getConfig]);

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    try {
      await updateConfig('faq', config);
    } catch (error) {
      console.error('Error saving FAQ config:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (!config) return;
    const newQuestion: FAQItem = {
      question: 'Nova pergunta',
      answer: 'Resposta para a nova pergunta'
    };
    setConfig({
      ...config,
      questions: [...config.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, field: keyof FAQItem, value: string) => {
    if (!config) return;
    const updatedQuestions = config.questions.map((question, i) => 
      i === index ? { ...question, [field]: value } : question
    );
    setConfig({ ...config, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    if (!config) return;
    const updatedQuestions = config.questions.filter((_, i) => i !== index);
    setConfig({ ...config, questions: updatedQuestions });
  };

  if (!config) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="faq-title">Título da Seção</Label>
          <Input
            id="faq-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="Título da seção FAQ"
          />
        </div>
        <div>
          <Label htmlFor="faq-subtitle">Subtítulo</Label>
          <Input
            id="faq-subtitle"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder="Subtítulo da seção FAQ"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Perguntas Frequentes</CardTitle>
            <Button variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.questions.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Pergunta {index + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label>Pergunta</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      placeholder="Digite a pergunta"
                    />
                  </div>
                  <div>
                    <Label>Resposta</Label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                      placeholder="Digite a resposta"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default FAQEditor;