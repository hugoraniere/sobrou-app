import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SentimentOption {
  value: string;
  emoji: string;
  label: string;
  description: string;
}

const sentiments: SentimentOption[] = [
  {
    value: 'baixa',
    emoji: '😊',
    label: 'Tranquilo',
    description: 'Não tenho pressa'
  },
  {
    value: 'media',
    emoji: '😐',
    label: 'Neutro',
    description: 'É importante resolver'
  },
  {
    value: 'alta',
    emoji: '😤',
    label: 'Frustrado',
    description: 'Preciso de ajuda urgente'
  }
];

interface SentimentSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const SentimentSelector: React.FC<SentimentSelectorProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div>
      <Label>Como você está se sentindo?</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
        {sentiments.map((sentiment) => (
          <button
            key={sentiment.value}
            type="button"
            onClick={() => onChange(sentiment.value)}
            className={cn(
              "p-4 border rounded-lg text-left transition-all hover:shadow-md",
              value === sentiment.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{sentiment.emoji}</span>
              <span className="font-medium">{sentiment.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {sentiment.description}
            </p>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default SentimentSelector;