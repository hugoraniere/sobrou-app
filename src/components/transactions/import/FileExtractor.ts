
import { usePdfExtractor } from '@/hooks/usePdfExtractor';
import { FileProcessor, FileReaderResult } from './FileProcessor';
import { toast } from 'sonner';

export class FileExtractor {
  private extractTextFromPDF: (file: File) => Promise<string>;

  constructor() {
    const { extractTextFromPDF } = usePdfExtractor();
    this.extractTextFromPDF = extractTextFromPDF;
  }

  // Processa o arquivo e retorna seu conteúdo texto
  async extractTextFromFile(file: File, setProcessingStep: (step: string) => void): Promise<FileReaderResult> {
    const fileType = FileProcessor.getFileTypeStrategy(file);
    let text = '';
    
    try {
      switch (fileType) {
        case 'pdf':
          setProcessingStep('Extraindo texto do PDF');
          console.log("Iniciando extração de texto do PDF");
          text = await this.extractFromPDF(file);
          break;
          
        case 'text':
          setProcessingStep('Lendo conteúdo do arquivo');
          console.log("Iniciando leitura de arquivo texto");
          text = await FileProcessor.readFileAsText(file);
          break;
          
        case 'excel':
          setProcessingStep('Processando planilha Excel');
          console.log("Arquivo Excel detectado");
          text = await this.extractFromExcel(file);
          
          if (!text || text.trim().length === 0) {
            throw new Error("Não foi possível processar este arquivo Excel. Por favor, exporte para CSV e tente novamente.");
          }
          break;
          
        case 'unknown':
        default:
          console.warn("Formato de arquivo não reconhecido:", file.type, "Tentando ler como texto");
          text = await FileProcessor.readFileAsText(file);
          if (!text || text.trim().length === 0) {
            throw new Error("Formato de arquivo não suportado. Por favor, envie PDF, TXT ou CSV.");
          }
      }
      
      // Verificação de conteúdo mínimo
      this.validateExtractedText(text);
      
      return {
        text,
        fileName: file.name
      };
    } catch (error: any) {
      console.error("Erro ao extrair texto do arquivo:", error);
      throw new Error(error.message || "Erro ao processar arquivo");
    }
  }

  private async extractFromPDF(file: File): Promise<string> {
    try {
      const text = await this.extractTextFromPDF(file);
      
      // Verificar se o texto foi extraído corretamente
      if (!text || text.trim().length === 0) {
        // Tentar método alternativo para PDFs que não conseguimos extrair texto facilmente
        console.warn("Texto não extraído do PDF com método padrão, tentando alternativa");
        
        const buffer = await FileProcessor.readFileAsArrayBuffer(file);
        return FileProcessor.bytesToText(buffer);
      }
      
      return text;
    } catch (error) {
      console.error("Erro ao extrair texto do PDF:", error);
      throw new Error("Falha ao extrair texto do PDF. Por favor, tente outro arquivo.");
    }
  }

  private async extractFromExcel(file: File): Promise<string> {
    try {
      // Para arquivos Excel, a melhor abordagem é tentar ler como texto
      return await FileProcessor.readFileAsText(file);
    } catch (error) {
      console.error("Erro ao processar Excel:", error);
      throw new Error("Não foi possível processar este arquivo Excel. Por favor, exporte para CSV e tente novamente.");
    }
  }

  private validateExtractedText(text: string): void {
    // Verificação mais robusta para garantir que temos conteúdo suficiente
    if (!text) {
      console.error("Texto extraído está vazio");
      throw new Error("Não foi possível extrair texto do arquivo. Tente com outro arquivo.");
    }
    
    // Log do texto extraído
    console.log("Texto extraído do arquivo, tamanho:", text.length);
    if (text.length > 0) {
      console.log("Amostra do texto:", text.substring(0, 200) + "...");
    }
    
    // Verificação mínima para garantir que temos conteúdo suficiente
    if (text.length < 30) {
      console.warn("Texto extraído é muito curto:", text);
      throw new Error("O texto extraído é muito curto para ser um extrato válido. Tente com outro arquivo ou formato.");
    }
  }
}
