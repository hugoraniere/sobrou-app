
import * as pdfjsLib from 'pdfjs-dist';

// Importante: Definir o worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractOptions {
  maxPages?: number;
  startPage?: number;
  endPage?: number;
  maxCharactersPerPage?: number;
  timeout?: number;
}

export const usePdfExtractor = () => {
  // Extrai texto apenas da parte relevante do PDF para melhorar a performance
  const extractRelevantTextFromPDF = async (
    file: File, 
    options: ExtractOptions = {}
  ): Promise<string> => {
    try {
      const { 
        maxPages = 15, // Aumentado para capturar mais conteúdo
        startPage = 1,
        endPage,
        maxCharactersPerPage = 10000, // Aumentado para capturar mais texto por página
        timeout = 30000 // 30 segundos de timeout
      } = options;
      
      // Criar uma promise com timeout para evitar travamentos
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Tempo limite excedido ao extrair texto do PDF')), timeout);
      });
      
      // Promise para extrair o texto
      const extractionPromise = (async () => {
        // Ler o arquivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Carregar o PDF usando pdfjs
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        // Determinar o número máximo de páginas para extrair
        const totalPages = pdf.numPages;
        console.log(`PDF contém ${totalPages} páginas`);
        
        const effectiveEndPage = endPage || Math.min(totalPages, startPage + maxPages - 1);
        
        let fullText = '';
        
        // Extrair texto apenas das páginas escolhidas
        for (let i = startPage; i <= effectiveEndPage; i++) {
          try {
            console.log(`Extraindo texto da página ${i}`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Concatenar o texto de todos os itens
            let pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
              
            // Sem limite tão restritivo de texto por página
            if (pageText.length > maxCharactersPerPage * 2) {
              // Se for muito grande, ainda limitar, mas em um valor maior
              pageText = pageText.substring(0, maxCharactersPerPage * 2) + '...';
            }
            
            fullText += pageText + '\n\n'; // Adicionar quebras duplas entre páginas
          } catch (pageError) {
            console.error(`Erro ao extrair texto da página ${i}:`, pageError);
            fullText += `[Erro na extração da página ${i}]\n`;
          }
        }
        
        return fullText;
      })();
      
      // Corrida entre o timeout e a extração
      return Promise.race([extractionPromise, timeoutPromise]);
    } catch (error) {
      console.error("Erro ao extrair texto do PDF:", error);
      throw error;
    }
  };

  // Função principal que extrai texto de um arquivo PDF completo
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Para faturas de cartão, vamos extrair mais páginas
      return await extractRelevantTextFromPDF(file, {
        maxPages: 20,  // Aumentado para 20 páginas
        startPage: 1,
        maxCharactersPerPage: 15000,  // 15mil caracteres por página
        timeout: 45000 // 45 segundos
      });
    } catch (error) {
      console.error("Erro ao extrair texto do PDF completo:", error);
      
      // Se falhar, tentar uma abordagem alternativa
      try {
        console.log("Tentando método alternativo para extração de PDF");
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        
        // Buscar strings de texto no PDF bruto
        let result = '';
        let currentString = '';
        
        for (let i = 0; i < bytes.length; i++) {
          const byte = bytes[i];
          // Somente caracteres ASCII imprimíveis e alguns caracteres de controle comuns
          if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
            currentString += String.fromCharCode(byte);
          } else if (currentString.length > 4) { // Só considerar strings com pelo menos 5 caracteres
            result += currentString + ' ';
            currentString = '';
          } else {
            currentString = '';
          }
        }
        
        return result;
      } catch (alternativeError) {
        console.error("Erro também no método alternativo:", alternativeError);
        throw error; // Repassar o erro original
      }
    }
  };

  return {
    extractTextFromPDF,
    extractRelevantTextFromPDF
  };
};
