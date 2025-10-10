import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { MEIMonthlyReport } from '@/services/meiReportService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface MEIClosingPDFExportProps {
  report: MEIMonthlyReport;
}

export const MEIClosingPDFExport: React.FC<MEIClosingPDFExportProps> = ({ report }) => {
  const handleExportPDF = async () => {
    try {
      toast.info('Gerando PDF...');

      const element = document.getElementById('mei-closing-report');
      if (!element) {
        toast.error('Erro ao gerar PDF');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `fechamento-mei-${report.period.year}-${String(report.period.month).padStart(2, '0')}.pdf`;
      pdf.save(fileName);

      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    }
  };

  return (
    <Button onClick={handleExportPDF} variant="default" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Exportar PDF
    </Button>
  );
};
