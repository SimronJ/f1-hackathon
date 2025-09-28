import { Pin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PinnedCardProps {
  onStarterKitClick: () => void;
}

export function PinnedCard({ onStarterKitClick }: PinnedCardProps) {
  return (
    <div className="glass-card p-4 m-4 border-l-4 border-l-primary">
      <div className="flex items-start gap-3">
        <Pin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-2">Welcome to AI Collective!</h3>
          <p className="text-sm text-muted-foreground mb-3">
            👋 New here? Get your personalized Starter Kit with resources, channels to join, and people to connect with.
          </p>
          <Button
            onClick={onStarterKitClick}
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Get Your Starter Kit
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}