import { Channel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getEnergyLevel, getEnergyLabel, mockChannelStats } from '@/lib/mock';
import { Hash, Users, MessageSquare, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChannelTableProps {
  channels: Channel[];
  nudgeChannels?: string[];
}

export function ChannelTable({ channels, nudgeChannels = [] }: ChannelTableProps) {
  return (
    <Card className="glass-card p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Channel Activity
        </h3>

        <div className="space-y-3">
          {channels.map((channel) => {
            const level = getEnergyLevel(channel.energy);
            const label = getEnergyLabel(channel.energy);
            const stats = mockChannelStats.find(s => s.channelId === channel.id);
            const hasNudge = nudgeChannels.includes(channel.id);

            return (
              <div
                key={channel.id}
                className={`p-4 rounded-lg border transition-all ${
                  hasNudge 
                    ? 'border-yellow-500/50 bg-yellow-500/10 pulse-glow' 
                    : 'border-border/50 bg-secondary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{channel.name}</span>
                    {hasNudge && (
                      <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                        Nudge Ready
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{stats?.uniqueSenders || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="w-3 h-3" />
                      <span>{stats?.messageCount || 0}</span>
                    </div>

                    <Badge className={`text-xs ${
                      level === 'high' ? 'energy-high' :
                      level === 'medium' ? 'energy-medium' :
                      'energy-low'
                    }`}>
                      {Math.round(channel.energy)}% {label}
                    </Badge>
                  </div>
                </div>

                {stats && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Last activity {formatDistanceToNow(stats.lastActivity, { addSuffix: true })}</span>
                  </div>
                )}

                {hasNudge && (
                  <div className="mt-3 text-sm text-yellow-300 italic">
                    💡 Consider posting: "What are you building this week?"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}