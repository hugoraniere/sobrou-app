
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

interface FileUploadAreaProps {
  fileName: string | null;
  isUploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  fileName,
  isUploading,
  onFileSelect,
  onCancel,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.txt,.csv"
        onChange={onFileSelect}
        className="hidden"
      />
      
      {fileName ? (
        <div className="flex flex-col items-center">
          <FileText className="h-10 w-10 text-blue-500 mb-2" />
          <p className="font-medium">{fileName}</p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="mr-2"
            >
              {t('common.cancel', 'Cancelar')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-lg font-medium mb-1">
            {t('transactions.uploadFile', 'Arraste seu arquivo ou clique para selecionar')}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {t('transactions.supportedFormats', 'PDF, TXT e CSV')}
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? 
              t('common.uploading', 'Enviando...') : 
              t('transactions.selectFile', 'Selecionar Arquivo')}
          </Button>
        </div>
      )}
    </div>
  );
};
