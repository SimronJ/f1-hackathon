import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEnergyLevel, getEnergyLabel } from '@/lib/mock';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EnergyCardProps {
  energy: number;
  previousEnergy?: number;
}

export function EnergyCard({ energy, previousEnergy = energy }: EnergyCardProps) {
  const level = getEnergyLevel(energy);
  const label = getEnergyLabel(energy);
  const trend = energy > previousEnergy ? 'up' : energy < previousEnergy ? 'down' : 'stable';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Community Energy</h3>
          <TrendIcon className={`w-5 h-5 ${
            trend === 'up' ? 'text-energy-high' :
            trend === 'down' ? 'text-energy-low' :
            'text-muted-foreground'
          }`} />
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{Math.round(energy)}</div>
          <Badge className={`${
            level === 'high' ? 'energy-high' :
            level === 'medium' ? 'energy-medium' :
            'energy-low'
          }`}>
            {label}
          </Badge>
        </div>

        {/* Energy Bar */}
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              level === 'high' ? 'bg-energy-high' :
              level === 'medium' ? 'bg-energy-medium' :
              'bg-energy-low'
            }`}
            style={{ width: `${Math.max(5, energy)}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground text-center">
          {level === 'high' && "Your community is buzzing with activity! 🔥"}
          {level === 'medium' && "Things are slowing down a bit. Time for engagement! ⚡"}
          {level === 'low' && "Community is quiet. Consider posting a nudge! 💤"}
        </p>
      </div>
    </Card>
  );
}