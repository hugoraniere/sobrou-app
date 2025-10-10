import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, FileText } from 'lucide-react';
import { meiReportService } from '@/services/meiReportService';
import { MEIClosingTable } from '@/components/reports/MEIClosingTable';
import { MEIClosingPDFExport } from '@/components/reports/MEIClosingPDFExport';
import ResponsivePageContainer from '@/components/layout/ResponsivePageContainer';
import ResponsivePageHeader from '@/components/layout/ResponsivePageHeader';

const MEIClosing = () => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [useCompetenceDate, setUseCompetenceDate] = useState(false);

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['mei-closing', selectedYear, selectedMonth, useCompetenceDate],
    queryFn: () => meiReportService.generateMonthlyClosing(selectedYear, selectedMonth, useCompetenceDate),
  });

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);
  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  return (
    <ResponsivePageContainer>
      <ResponsivePageHeader
        title="Fechamento MEI"
        description="Relatório consolidado mensal para controle interno"
      >
        <div className="flex flex-wrap gap-3">
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {report && (
            <MEIClosingPDFExport report={report} />
          )}
        </div>
      </ResponsivePageHeader>

      <div className="space-y-6">
        {/* Toggle Competência vs Pagamento */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border">
          <Switch
            id="competence-toggle"
            checked={useCompetenceDate}
            onCheckedChange={setUseCompetenceDate}
          />
          <Label htmlFor="competence-toggle" className="text-sm cursor-pointer">
            Usar data de competência (ao invés de pagamento)
          </Label>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            Erro ao gerar relatório. Tente novamente.
          </div>
        )}

        {report && <MEIClosingTable report={report} />}
      </div>
    </ResponsivePageContainer>
  );
};

export default MEIClosing;
