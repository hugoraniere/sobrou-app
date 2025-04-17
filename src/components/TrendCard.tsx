
import React from 'react';
import { TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

type CompetitionLevel = 'low' | 'medium' | 'high';

type TrendProps = {
  name: string;
  growthData: { value: number }[];
  competition: CompetitionLevel;
  isHot?: boolean;
  onSelect: () => void;
};

const TrendCard = ({ name, growthData, competition, isHot = false, onSelect }: TrendProps) => {
  const getCompetitionColor = (level: CompetitionLevel) => {
    switch (level) {
      case 'low':
        return 'text-trend-green';
      case 'medium':
        return 'text-trend-orange';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-trend-gray-dark';
    }
  };

  const getCompetitionText = (level: CompetitionLevel) => {
    switch (level) {
      case 'low':
        return 'Baixa concorrência';
      case 'medium':
        return 'Média concorrência';
      case 'high':
        return 'Alta concorrência';
      default:
        return '';
    }
  };

  return (
    <div className="trend-card relative border border-gray-100 p-4 rounded-lg">
      {isHot && (
        <div className="absolute -top-2 -right-2 bg-trend-orange text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse-light">
          🔥 Em ascensão
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-montserrat font-semibold text-lg">{name}</h3>
        <div className="flex items-center gap-1">
          <TrendingUp size={16} className="text-trend-blue" />
          <span className="text-sm font-medium text-trend-blue">+{Math.floor(Math.random() * 70) + 30}%</span>
        </div>
      </div>
      
      <div className="h-16 mb-4 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4361EE" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4361EE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4361EE"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGrowth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className={getCompetitionColor(competition)} />
        <span className={`text-sm ${getCompetitionColor(competition)}`}>
          {getCompetitionText(competition)}
        </span>
      </div>
      
      <Button
        onClick={onSelect}
        className="w-full bg-white text-trend-blue border border-trend-blue hover:bg-trend-blue hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <span>Ver ideias de conteúdo</span>
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default TrendCard;
