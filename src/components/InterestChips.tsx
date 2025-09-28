import { Interest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface InterestChipsProps {
  interests: Interest[];
  selectedInterests: Interest[];
  onToggle: (interest: Interest) => void;
  className?: string;
}

const INTEREST_EMOJIS: Record<Interest, string> = {
  AI: '🤖',
  Python: '🐍',
  Growth: '📈',
  Design: '🎨',
  Product: '📱',
  Data: '📊'
};

export function InterestChips({ 
  interests, 
  selectedInterests, 
  onToggle,
  className = ''
}: InterestChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {interests.map((interest) => {
        const isSelected = selectedInterests.includes(interest);
        return (
          <button
            key={interest}
            type="button"
            onClick={() => onToggle(interest)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
            }`}
          >
            <span>{INTEREST_EMOJIS[interest]}</span>
            <span>{interest}</span>
          </button>
        );
      })}
    </div>
  );
}