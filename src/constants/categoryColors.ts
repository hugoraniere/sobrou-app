
// Tokens de cor para categorias de transação
export const CATEGORY_COLORS = {
  alimentacao: "#E15759",
  moradia: "#4E79A7",
  transporte: "#F28E2B",
  internet: "#A173D1",
  cartao: "#7F7F7F",
  saude: "#59A14F",
  lazer: "#B07AA1",
  compras: "#E377C2",
  investimentos: "#1F7C38",
  familia: "#76B7B2",
  doacoes: "#FFC107",
  outros: "#CFCFCF",
  other: "#CFCFCF" // Garantir que "other" também use a mesma cor de "outros"
};

// Função para obter a cor de uma categoria
export const getCategoryColor = (categoryId: string): string => {
  return CATEGORY_COLORS[categoryId as keyof typeof CATEGORY_COLORS] || "#CFCFCF";
};
