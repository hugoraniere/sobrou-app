
import { CategoryType } from '@/types/categories';
import { expenseCategories } from './expenseCategories';

export const categoryKeywords: Record<string, string[]> = {
  alimentacao: [
    'mercado', 'supermercado', 'feira', 'hortifruti', 'sacolão', 'alimentação', 'comida', 
    'restaurante', 'bar', 'padaria', 'açougue', 'lanchonete', 'lanche', 'almoço', 'jantar', 
    'delivery', 'ifood', 'rappi', 'bebidas', 'refeição', 'café'
  ],
  moradia: [
    'aluguel', 'condomínio', 'luz', 'energia', 'água', 'esgoto', 'gás', 'manutenção', 
    'reparo', 'reforma', 'iptu', 'habitação', 'moradia'
  ],
  transporte: [
    'uber', '99', 'cabify', 'combustível', 'gasolina', 'diesel', 'etanol', 'álcool', 
    'passagem', 'metrô', 'ônibus', 'trem', 'pedágio', 'transporte'
  ],
  internet: [
    'internet', 'wifi', 'banda larga', 'fibra', 'vivo', 'claro', 'tim', 'oi', 
    'telefonia', 'telefone', 'celular', 'recarga'
  ],
  cartao: [
    'cartão', 'crédito', 'fatura', 'nubank', 'parcela', 'parcelado', 'anuidade'
  ],
  saude: [
    'farmácia', 'plano de saúde', 'exame', 'consulta', 'hospital', 'remédio', 'medicamentos', 
    'odontologia', 'dentista', 'psicólogo', 'terapia'
  ],
  lazer: [
    'cinema', 'filme', 'teatro', 'show', 'concerto', 'festival', 'evento', 'ingresso', 
    'balada', 'festa', 'parque', 'museu', 'viagem', 'lazer', 'diversão'
  ],
  compras: [
    'compras', 'roupas', 'vestuário', 'calçados', 'tênis', 'sapato', 'acessórios', 'presente', 
    'loja', 'shopping', 'eletrônico', 'móveis', 'decoração', 'outros'
  ],
  investimentos: [
    'investimento', 'aporte', 'aplicação', 'poupança', 'cdb', 'tesouro', 'fundo', 'ações', 
    'bolsa', 'bitcoin', 'cripto', 'previdência'
  ],
  familia: [
    'filhos', 'escola', 'mensalidade', 'creche', 'berçário', 'educação', 'material escolar', 
    'uniforme', 'fraldas', 'brinquedos'
  ],
  doacoes: [
    'doação', 'contribuição', 'caridade', 'ajuda', 'apoio', 'vaquinha', 'solidariedade'
  ]
};

export const categoryMeta: Record<string, CategoryType> = expenseCategories.reduce((acc, category) => {
  acc[category.id] = category;
  return acc;
}, {} as Record<string, CategoryType>);
