
// Implementação simplificada do hook use-i18n
// Como estamos apenas usando português, este hook retorna valores fixos

export const useI18n = () => {
  return {
    locale: 'pt-BR',
    t: (key: string) => key // Função simples para compatibilidade
  };
};
