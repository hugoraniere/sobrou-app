
import * as pdfjsLib from 'pdfjs-dist';

// Importante: Definir o worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const usePdfExtractor = () => {
  // Função para extrair texto de um arquivo PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Ler o arquivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Carregar o PDF usando pdfjs
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extrair texto de todas as páginas
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Concatenar o texto de todos os itens
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
          
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error("Erro ao extrair texto do PDF:", error);
      throw error;
    }
  };

  return {
    extractTextFromPDF
  };
};
