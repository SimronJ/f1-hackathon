import { Hash, Users } from 'lucide-react';
import { Channel } from '@/lib/types';
import { getEnergyLevel } from '@/lib/mock';

interface SidebarProps {
  channels: Channel[];
  selectedChannelId: string;
  onChannelSelect: (channelId: string) => void;
}

export function Sidebar({ channels, selectedChannelId, onChannelSelect }: SidebarProps) {
  return (
    <div className="w-60 glass-card border-r-0 rounded-none h-full flex flex-col">
      {/* Server Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
            <span className="text-lg font-bold">AI</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Collective</h2>
            <p className="text-xs text-muted-foreground">Community Server</p>
          </div>
        </div>
      </div>

      {/* Channel List */}
      <div className="flex-1 p-2">
        <div className="mb-4">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
            <Hash className="w-3 h-3" />
            Text Channels
          </div>
          <div className="space-y-1 mt-2">
            {channels.map((channel) => {
              const isSelected = channel.id === selectedChannelId;
              const energyLevel = getEnergyLevel(channel.energy);
              
              return (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1 text-left">{channel.name}</span>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    energyLevel === 'high' ? 'bg-energy-high' :
                    energyLevel === 'medium' ? 'bg-energy-medium' :
                    'bg-energy-low'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Community Member</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}