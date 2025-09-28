import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { EnergyCard } from '@/components/EnergyCard';
import { Sparkline } from '@/components/Sparkline';
import { ChannelTable } from '@/components/ChannelTable';
import { NudgeCard } from '@/components/NudgeCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Activity, Zap, TrendingUp } from 'lucide-react';
import { generateSparklineData } from '@/lib/mock';

export default function PulseBoard() {
  const {
    channels,
    nudgeCards,
    removeNudgeCard,
    energyHistory
  } = useStore();

  const [sparklineData, setSparklineData] = useState<number[]>([]);

  // Calculate overall community energy
  const communityEnergy = channels.reduce((sum, channel) => sum + channel.energy, 0) / channels.length;
  
  // Generate sparkline data periodically
  useEffect(() => {
    setSparklineData(generateSparklineData());
    
    const interval = setInterval(() => {
      setSparklineData(generateSparklineData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nudgeChannelIds = nudgeCards.map(card => card.channelId);

  const goToDiscord = () => {
    window.location.href = '/discord';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToDiscord}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discord
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Activity className="w-8 h-8 text-primary" />
                PulseBoard
              </h1>
              <p className="text-muted-foreground">Community engagement dashboard</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Live monitoring</div>
            <Badge variant="outline" className="text-green-400 border-green-500">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Active
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Community Energy */}
          <EnergyCard energy={communityEnergy} />

          {/* Activity Sparkline */}
          <Card className="glass-card p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Activity Trend
                </h3>
              </div>
              <Sparkline data={sparklineData} />
              <p className="text-sm text-muted-foreground">Last 10 data points</p>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Channels</span>
                  <span className="font-semibold">{channels.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Channels</span>
                  <span className="font-semibold">
                    {channels.filter(c => c.energy >= 70).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Channels Needing Nudge</span>
                  <span className="font-semibold text-yellow-400">
                    {channels.filter(c => c.energy < 40).length}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Nudge Cards */}
        {nudgeCards.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Engagement Opportunities ({nudgeCards.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nudgeCards.map((nudgeCard) => (
                <NudgeCard
                  key={nudgeCard.id}
                  nudgeCard={nudgeCard}
                  onDismiss={removeNudgeCard}
                />
              ))}
            </div>
          </div>
        )}

        {/* Channel Table */}
        <ChannelTable 
          channels={channels} 
          nudgeChannels={nudgeChannelIds}
        />

        {/* Footer */}
        <Card className="glass-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            PulseBoard automatically monitors community energy and suggests engagement tactics.
            <br />
            <span className="text-primary">Real-time simulated for demo purposes.</span>
          </p>
        </Card>
      </div>
    </div>
  );
}