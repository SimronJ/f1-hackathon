import { NudgeCard as NudgeCardType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Zap, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NudgeCardProps {
  nudgeCard: NudgeCardType;
  onDismiss: (id: string) => void;
}

export function NudgeCard({ nudgeCard, onDismiss }: NudgeCardProps) {
  return (
    <Card className="glass-card p-4 border-yellow-500/50 bg-yellow-500/10">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h4 className="font-semibold text-sm">Engagement Opportunity</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(nudgeCard.id)}
            className="h-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-foreground">
          {nudgeCard.message}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(nudgeCard.timestamp, { addSuffix: true })}</span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
          >
            Post Nudge
          </Button>
        </div>
      </div>
    </Card>
  );
}