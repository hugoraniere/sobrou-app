import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDashboardPeriod, PeriodType } from '@/contexts/DashboardDateProvider';

const PERIOD_OPTIONS: Array<{ value: PeriodType; label: string }> = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'custom', label: 'Personalizado' }
];

export function PeriodSelector() {
  const {
    period,
    setPeriod,
    customDateRange,
    setCustomDateRange,
    compareEnabled,
    setCompareEnabled
  } = useDashboardPeriod();

  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ start?: Date; end?: Date }>({});

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setIsCustomOpen(false);
    }
  };

  const handleCustomRangeApply = () => {
    if (tempRange.start && tempRange.end) {
      setCustomDateRange({ start: tempRange.start, end: tempRange.end });
      setIsCustomOpen(false);
    }
  };

  return (
    <div className="sticky top-0 bg-background-base z-10 border-b border-border pb-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={period === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodChange(option.value)}
                  className="min-w-0"
                >
                  {option.label}
                </Button>
              ))}

              {period === 'custom' && (
                <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {customDateRange ? (
                        `${format(customDateRange.start, 'dd/MM/yy', { locale: ptBR })} - ${format(customDateRange.end, 'dd/MM/yy', { locale: ptBR })}`
                      ) : (
                        'Selecionar datas'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Data inicial</Label>
                          <Calendar
                            mode="single"
                            selected={tempRange.start}
                            onSelect={(date) => setTempRange(prev => ({ ...prev, start: date }))}
                            disabled={(date) => date > new Date()}
                            className="rounded-md border"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Data final</Label>
                          <Calendar
                            mode="single"
                            selected={tempRange.end}
                            onSelect={(date) => setTempRange(prev => ({ ...prev, end: date }))}
                            disabled={(date) => 
                              date > new Date() || 
                              (tempRange.start && date < tempRange.start)
                            }
                            className="rounded-md border"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCustomOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleCustomRangeApply}
                          disabled={!tempRange.start || !tempRange.end}
                        >
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="compare-period"
                checked={compareEnabled}
                onCheckedChange={setCompareEnabled}
                disabled={period === 'today' || (period === 'custom' && (!customDateRange || (customDateRange.end.getTime() - customDateRange.start.getTime()) < 2 * 24 * 60 * 60 * 1000))}
              />
              <Label htmlFor="compare-period" className="text-sm">
                Comparar período anterior
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}