import { create } from 'zustand';
import { Channel, Message, Profile, StarterKit, NudgeCard, EnergyPulse } from './types';
import { MOCK_CHANNELS, MOCK_MESSAGES, getEnergyLevel, generateNudgeMessage, mockChannelStats } from './mock';

interface AppState {
  // Discord state
  channels: Channel[];
  messages: Message[];
  selectedChannelId: string;
  
  // Profile state
  profile: Profile | null;
  starterKit: StarterKit | null;
  
  // PulseBoard state
  energyHistory: EnergyPulse[];
  nudgeCards: NudgeCard[];
  
  // Actions
  setSelectedChannel: (channelId: string) => void;
  postMessage: (channelId: string, message: Message) => void;
  setProfile: (profile: Profile) => void;
  setStarterKit: (starterKit: StarterKit) => void;
  updateChannelEnergy: (channelId: string, energy: number) => void;
  addNudgeCard: (nudgeCard: NudgeCard) => void;
  removeNudgeCard: (id: string) => void;
  startEnergySimulation: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  channels: MOCK_CHANNELS,
  messages: MOCK_MESSAGES,
  selectedChannelId: 'general',
  profile: null,
  starterKit: null,
  energyHistory: [],
  nudgeCards: [],

  setSelectedChannel: (channelId: string) => {
    set({ selectedChannelId: channelId });
  },

  postMessage: (channelId: string, message: Message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  setProfile: (profile: Profile) => {
    set({ profile });
  },

  setStarterKit: (starterKit: StarterKit) => {
    set({ starterKit });
  },

  updateChannelEnergy: (channelId: string, energy: number) => {
    set(state => ({
      channels: state.channels.map(channel =>
        channel.id === channelId ? { ...channel, energy } : channel
      ),
      energyHistory: [
        ...state.energyHistory,
        { channelId, timestamp: new Date(), value: energy }
      ].slice(-100) // Keep last 100 entries
    }));
  },

  addNudgeCard: (nudgeCard: NudgeCard) => {
    set(state => ({
      nudgeCards: [...state.nudgeCards, nudgeCard]
    }));
  },

  removeNudgeCard: (id: string) => {
    set(state => ({
      nudgeCards: state.nudgeCards.filter(card => card.id !== id)
    }));
  },

  startEnergySimulation: () => {
    setInterval(() => {
      const state = get();
      
      state.channels.forEach(channel => {
        // Decay energy by 1-5 points every 10 seconds
        const decay = Math.random() * 5 + 1;
        const newEnergy = Math.max(0, Math.min(100, channel.energy - decay));
        
        get().updateChannelEnergy(channel.id, newEnergy);
        
        // Check if channel needs a nudge
        if (newEnergy < 40 && getEnergyLevel(channel.energy) !== 'low') {
          const existingNudge = state.nudgeCards.find(card => card.channelId === channel.id);
          if (!existingNudge) {
            get().addNudgeCard({
              id: `nudge-${channel.id}-${Date.now()}`,
              channelId: channel.id,
              message: generateNudgeMessage(channel.name),
              timestamp: new Date()
            });
          }
        }
      });
    }, 10000); // Every 10 seconds
  }
}));

// Start the energy simulation when the store is created
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useStore.getState().startEnergySimulation();
  }, 1000);
}