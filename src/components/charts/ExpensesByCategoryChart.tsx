
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '@/services/transactions';
import { transactionCategories } from '@/data/categories';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslation } from 'react-i18next';
import { getCategoryColor } from '@/constants/categoryColors';

interface ExpensesByCategoryChartProps {
  expenses: Transaction[];
  chartConfig: any;
}

// Definindo o limite para agrupar em "Outros"
const OTHERS_THRESHOLD = 3; // porcentagem

// Helper function to process chart data 
const processChartData = (expenses: Transaction[]) => {
  const categoryMap = new Map<string, number>();
  
  expenses
    .filter(expense => expense.type === 'expense')
    .forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
  
  // Converter para array e calcular o total para percentagens
  let data = Array.from(categoryMap.entries()).map(([category, value]) => {
    const categoryInfo = transactionCategories.find(cat => cat.id === category);
    return {
      name: categoryInfo?.name || category,
      value,
      id: category,
      color: getCategoryColor(category),
      percentage: 0 // Será calculado em seguida
    };
  }).sort((a, b) => b.value - a.value); // Ordenar por valor, decrescente
  
  // Consolidar as categorias "other" e "outros"
  const otherIndex = data.findIndex(item => item.id === 'other');
  const outrosIndex = data.findIndex(item => item.id === 'outros');
  
  if (otherIndex !== -1 && outrosIndex !== -1) {
    data[otherIndex].value += data[outrosIndex].value;
    data.splice(outrosIndex, 1);
    data[otherIndex].name = 'Outros';
  }
  
  return data;
};

// Calculate percentages and group small categories
const calculatePercentages = (data: any[]) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Primeiro, calcula as percentagens
  let processedData = data.map(item => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0
  }));
  
  // Agrupa categorias pequenas em "Outros" se estiver abaixo do limite
  const smallCategories = processedData.filter(item => item.percentage < OTHERS_THRESHOLD && item.id !== 'other' && item.id !== 'outros');
  const largeCategories = processedData.filter(item => item.percentage >= OTHERS_THRESHOLD || item.id === 'other' || item.id === 'outros');
  
  // Se existirem categorias pequenas, agrupe-as
  if (smallCategories.length > 0) {
    const othersTotal = smallCategories.reduce((sum, item) => sum + item.value, 0);
    const othersPercentage = total > 0 ? (othersTotal / total) * 100 : 0;
    
    // Encontre se já existe uma categoria "Outros"
    const existingOthersIndex = largeCategories.findIndex(item => item.id === 'other' || item.id === 'outros');
    
    if (existingOthersIndex !== -1) {
      // Adiciona ao existente
      largeCategories[existingOthersIndex].value += othersTotal;
      largeCategories[existingOthersIndex].percentage += othersPercentage;
      largeCategories[existingOthersIndex].name = 'Outros';
      largeCategories[existingOthersIndex].id = 'outros';
      largeCategories[existingOthersIndex].color = getCategoryColor('outros');
    } else {
      // Cria uma nova categoria "Outros"
      largeCategories.push({
        name: 'Outros',
        value: othersTotal,
        id: 'outros',
        color: getCategoryColor('outros'),
        percentage: othersPercentage
      });
    }
    
    // Retorna a lista ordenada novamente
    return largeCategories.sort((a, b) => b.value - a.value);
  }
  
  return processedData;
};

// Componente para renderizar legendas personalizadas
const CustomLegend = ({ data }: { data: any[] }) => {
  return (
    <div className="space-y-2 mt-2 max-h-[240px] overflow-y-auto pr-2">
      {data.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center justify-between gap-2 py-1">
          <div className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <div className="text-sm truncate max-w-[150px]">{entry.name}</div>
          </div>
          <div className="text-sm font-medium text-right">
            <span className="block">R$ {Math.round(entry.value)}</span>
            <span className="block text-gray-500 text-xs">{entry.percentage.toFixed(1)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  expenses,
  chartConfig 
}) => {
  const { t } = useTranslation();
  
  // Process and calculate percentages
  const rawData = processChartData(expenses);
  const data = calculatePercentages(rawData);
  
  // Get top category for insight
  const topCategory = data.length > 0 ? data[0] : null;
  
  if (data.length === 0) {
    return null;
  }
  
  return (
    <div className="h-full w-full">
      {/* Insight moved to top for consistency */}
      {topCategory && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
          <p>
            <span className="font-medium">{topCategory.percentage.toFixed(1)}%</span> dos seus gastos foram com{' '}
            <span className="font-medium">{topCategory.name}</span> (R$ {Math.round(topCategory.value)})
          </p>
        </div>
      )}
      
      {/* Novo layout com gráfico à esquerda e legenda à direita */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 h-[180px]">
          <ChartContainer 
            className="h-full w-full"
            config={chartConfig}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  minAngle={3} // Garante ângulo mínimo para fatias pequenas
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value: number, name: string, entry: any) => {
                        return [
                          <>
                            <span>R$ {Math.round(value)}</span>
                            <span className="block text-xs text-gray-400">({entry.payload.percentage.toFixed(1)}%)</span>
                          </>,
                          name
                        ];
                      }}
                    />
                  } 
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Legenda personalizada à direita */}
        <div className="w-full md:w-1/2">
          <CustomLegend data={data} />
        </div>
      </div>
    </div>
  );
};

export default ExpensesByCategoryChart;
