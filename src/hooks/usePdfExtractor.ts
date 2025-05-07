
import * as pdfjsLib from 'pdfjs-dist';

// Importante: Definir o worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractOptions {
  maxPages?: number;
  startPage?: number;
  endPage?: number;
  maxCharactersPerPage?: number;
}

export const usePdfExtractor = () => {
  // Extrai texto apenas da parte relevante do PDF para melhorar a performance
  const extractRelevantTextFromPDF = async (
    file: File, 
    options: ExtractOptions = {}
  ): Promise<string> => {
    try {
      const { 
        maxPages = 10,
        startPage = 1,
        endPage,
        maxCharactersPerPage = 5000
      } = options;
      
      // Ler o arquivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Carregar o PDF usando pdfjs
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Determinar o número máximo de páginas para extrair
      const totalPages = pdf.numPages;
      const effectiveEndPage = endPage || Math.min(totalPages, startPage + maxPages - 1);
      
      let fullText = '';
      
      // Extrair texto apenas das páginas escolhidas
      for (let i = startPage; i <= effectiveEndPage; i++) {
        // Se já temos muito texto, parar para não sobrecarregar a IA
        if (fullText.length > maxPages * maxCharactersPerPage) {
          fullText += `\n[Texto truncado - muito conteúdo]\n`;
          break;
        }
        
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Concatenar o texto de todos os itens
        let pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
          
        // Limitar o tamanho do texto por página
        if (pageText.length > maxCharactersPerPage) {
          pageText = pageText.substring(0, maxCharactersPerPage) + '...';
        }
        
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error("Erro ao extrair texto do PDF:", error);
      throw error;
    }
  };

  // Função principal que extrai texto de um arquivo PDF completo
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Para extratos bancários, normalmente as primeiras páginas são mais importantes
      // e contêm as transações, então vamos focar nelas para melhorar a performance
      return await extractRelevantTextFromPDF(file, {
        maxPages: 5,  // Limitar a 5 páginas
        startPage: 1,
        maxCharactersPerPage: 3000  // Limitar caracteres por página
      });
    } catch (error) {
      console.error("Erro ao extrair texto do PDF completo:", error);
      throw error;
    }
  };

  return {
    extractTextFromPDF,
    extractRelevantTextFromPDF
  };
};
