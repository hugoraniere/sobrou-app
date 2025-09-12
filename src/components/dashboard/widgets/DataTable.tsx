import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  ExternalLink,
  FileX
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

export interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface DataTableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  isLoading?: boolean;
  isError?: boolean;
  lastUpdated?: Date;
  source?: string;
  pageSize?: number;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRefresh?: () => void;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable({
  title,
  columns,
  data,
  actions,
  isLoading = false,
  isError = false,
  lastUpdated,
  source = 'Supabase',
  pageSize = 10,
  emptyMessage = 'Nenhum dado encontrado',
  emptyIcon = <FileX className="h-8 w-8 text-muted-foreground" />,
  onRefresh,
  className = ''
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortBy === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortBy(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortBy(columnKey);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedData = React.useMemo(() => {
    if (!sortBy || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;
      
      const isAsc = sortDirection === 'asc';
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return isAsc ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      return isAsc ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [data, sortBy, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return <ChevronsUpDown className="h-4 w-4" />;
    if (sortDirection === 'asc') return <ChevronUp className="h-4 w-4" />;
    return <ChevronDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="outline">Carregando...</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                {columns.map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={`${className} border-red-200 bg-red-50`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-red-700">{title}</CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-700">Erro ao carregar dados</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Badge variant="outline">{source}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            {emptyIcon}
            <div className="mt-2 text-muted-foreground">{emptyMessage}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Badge variant="outline">{source}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-left p-2 ${column.sortable ? 'cursor-pointer hover:bg-muted/50' : ''} ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{column.label}</span>
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="text-left p-2 text-sm font-medium">Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={column.key} className={`p-2 ${column.className || ''}`}>
                      {column.formatter
                        ? column.formatter(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        {actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant={action.variant || 'ghost'}
                            size="sm"
                            onClick={() => action.onClick(row)}
                            className="gap-1"
                          >
                            {action.icon}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, sortedData.length)} de {sortedData.length} resultados
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="px-3 py-1 text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {lastUpdated && (
          <div className="text-xs text-muted-foreground mt-2 text-right">
            Atualizado {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ptBR })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}