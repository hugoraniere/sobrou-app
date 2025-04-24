
import { CategoryType } from '@/types/categories';
import { 
  Utensils, 
  Home, 
  Car, 
  Wifi, 
  CreditCard, 
  Heart, 
  Gamepad, 
  ShoppingBag, 
  LineChart, 
  Users, 
  Gift 
} from 'lucide-react';

export const categoryKeywords: Record<string, string[]> = {
  food: [
    'mercado', 'supermercado', 'feira', 'hortifruti', 'sacolão', 'alimentação', 'comida', 
    'restaurante', 'bar', 'padaria', 'açougue', 'lanchonete', 'lanche', 'almoço', 'jantar', 
    'delivery', 'ifood', 'rappi', 'bebidas', 'comida pronta', 'self-service', 'marmita', 
    'fast food', 'refeição', 'snacks', 'salgados', 'doces', 'sobremesa', 'pizzaria', 
    'hamburgueria', 'pastel', 'esfiha', 'sushi', 'café', 'cafeteria', 'água', 'refrigerante'
  ],
  housing: [
    'aluguel', 'condomínio', 'luz', 'energia', 'água', 'esgoto', 'gás', 'manutenção', 
    'reparo', 'reforma', 'material de construção', 'pintura', 'obra', 'iptu', 'habitação', 
    'moradia', 'faxina', 'diarista', 'zelador', 'jardinagem', 'portaria'
  ],
  transport: [
    'uber', '99', 'cabify', 'combustível', 'gasolina', 'diesel', 'etanol', 'álcool', 
    'passagem', 'metrô', 'ônibus', 'trem', 'pedágio', 'transporte', 'corrida', 'estacionamento', 
    'aluguel de carro', 'oficina', 'óleo', 'pneu', 'seguro', 'revisão'
  ],
  internet: [
    'internet', 'wifi', 'banda larga', 'fibra', 'roteador', 'vivo', 'claro', 'tim', 'oi', 
    'sky', 'telefonia', 'telefone', 'celular', 'recarga', 'plano', 'netflix', 'prime', 
    'disney', 'streaming', 'spotify', 'youtube'
  ],
  credit_card: [
    'cartão', 'crédito', 'fatura', 'nubank', 'visa', 'mastercard', 'elo', 'santander', 
    'banco do brasil', 'bradesco', 'itau', 'parcela', 'parcelado', 'limite', 'anuidade'
  ],
  health: [
    'farmácia', 'plano de saúde', 'exame', 'consulta', 'hospital', 'remédio', 'medicamentos', 
    'odontologia', 'dentista', 'psicólogo', 'terapia', 'psiquiatra', 'oftalmologista', 
    'dermatologista', 'nutricionista', 'vacina', 'pilates', 'fisioterapia'
  ],
  entertainment: [
    'cinema', 'filme', 'teatro', 'show', 'concerto', 'festival', 'evento', 'ingresso', 
    'balada', 'festa', 'happy hour', 'parque', 'museu', 'turismo', 'viagem', 'lazer', 
    'diversão', 'games', 'jogos', 'playstation', 'xbox', 'nintendo', 'steam', 'academia'
  ],
  shopping: [
    'compras', 'roupas', 'vestuário', 'calçados', 'tênis', 'sapato', 'acessórios', 'presente', 
    'loja', 'magazine luiza', 'mercado livre', 'shopee', 'aliexpress', 'amazon', 'eletrônico', 
    'eletrodoméstico', 'móveis', 'decoração', 'papelaria'
  ],
  investment: [
    'investimento', 'aporte', 'aplicação', 'poupança', 'cdb', 'tesouro', 'fundo', 'ações', 
    'bolsa', 'bitcoin', 'cripto', 'previdência', 'reserva', 'corretora', 'xp', 'rico', 'clear'
  ],
  family: [
    'filhos', 'escola', 'mensalidade', 'creche', 'berçário', 'educação', 'material escolar', 
    'uniforme', 'fraldas', 'brinquedos', 'pediatria', 'babá', 'cuidadora'
  ],
  donation: [
    'doação', 'contribuição', 'caridade', 'ajuda', 'pix', 'apoio', 'vaquinha', 'empréstimo', 
    'financiamento coletivo', 'crowdfunding'
  ]
};

export const categoryMeta: Record<string, CategoryType> = {
  food: {
    id: 'food',
    name: 'Alimentação',
    value: 'food',
    type: 'expense',
    label: 'Alimentação',
    color: 'bg-red-100 text-red-800',
    icon: Utensils
  },
  housing: {
    id: 'housing',
    name: 'Moradia',
    value: 'housing',
    type: 'expense',
    label: 'Moradia',
    color: 'bg-blue-100 text-blue-800',
    icon: Home
  },
  transport: {
    id: 'transport',
    name: 'Transporte',
    value: 'transport',
    type: 'expense',
    label: 'Transporte',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Car
  },
  internet: {
    id: 'internet',
    name: 'Internet / Telecom',
    value: 'internet',
    type: 'expense',
    label: 'Internet / Telecom',
    color: 'bg-purple-100 text-purple-800',
    icon: Wifi
  },
  credit_card: {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    value: 'credit_card',
    type: 'expense',
    label: 'Cartão de Crédito',
    color: 'bg-indigo-100 text-indigo-800',
    icon: CreditCard
  },
  health: {
    id: 'health',
    name: 'Saúde',
    value: 'health',
    type: 'expense',
    label: 'Saúde',
    color: 'bg-green-100 text-green-800',
    icon: Heart
  },
  entertainment: {
    id: 'entertainment',
    name: 'Lazer / Entretenimento',
    value: 'entertainment',
    type: 'expense',
    label: 'Lazer / Entretenimento',
    color: 'bg-pink-100 text-pink-800',
    icon: Gamepad
  },
  shopping: {
    id: 'shopping',
    name: 'Compras / Outros',
    value: 'shopping',
    type: 'expense',
    label: 'Compras / Outros',
    color: 'bg-gray-100 text-gray-800',
    icon: ShoppingBag
  },
  investment: {
    id: 'investment',
    name: 'Investimentos / Poupança',
    value: 'investment',
    type: 'expense',
    label: 'Investimentos / Poupança',
    color: 'bg-emerald-100 text-emerald-800',
    icon: LineChart
  },
  family: {
    id: 'family',
    name: 'Família / Filhos',
    value: 'family',
    type: 'expense',
    label: 'Família / Filhos',
    color: 'bg-cyan-100 text-cyan-800',
    icon: Users
  },
  donation: {
    id: 'donation',
    name: 'Doações / Ajuda',
    value: 'donation',
    type: 'expense',
    label: 'Doações / Ajuda',
    color: 'bg-rose-100 text-rose-800',
    icon: Gift
  }
};
