
import { ExtractedTransaction } from '@/services/bankStatementService';
import { toast } from 'sonner';

// Interface para as funções de leitura de arquivo
export interface FileReaderResult {
  text: string;
  fileName: string;
}

// Classe auxiliar para processamento de arquivos
export class FileProcessor {
  static async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
      reader.readAsText(file);
    });
  }

  static async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo como ArrayBuffer'));
      reader.readAsArrayBuffer(file);
    });
  }

  static isFileTooLarge(file: File, maxSize = 10 * 1024 * 1024): boolean {
    if (file.size > maxSize) {
      console.error("Arquivo muito grande:", file.size, "bytes");
      toast.error("O arquivo é muito grande. Por favor, envie arquivos menores que 10MB.");
      return true;
    }
    return false;
  }

  // Converte bytes em texto (método alternativo)
  static bytesToText(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    // Extrair texto de forma bruta procurando sequências de caracteres ASCII
    return Array.from(bytes)
      .map(byte => byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ' ')
      .join('');
  }

  // Detecta o tipo de arquivo e implementa estratégia de leitura adequada
  static getFileTypeStrategy(file: File): 'pdf' | 'text' | 'excel' | 'unknown' {
    if (file.type === 'application/pdf') {
      return 'pdf';
    } else if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.csv')) {
      return 'text';
    } else if (file.type === 'application/vnd.ms-excel' || 
               file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return 'excel';
    }
    return 'unknown';
  }
}
