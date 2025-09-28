export type Role = 'Student' | 'Engineer' | 'Founder' | 'Designer' | 'Product';

export type Interest = 'AI' | 'Python' | 'Growth' | 'Design' | 'Product' | 'Data';

export interface Message {
  id: string;
  channelId: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  energy: number;
  lastNudge?: Date;
  unreadCount?: number;
}

export interface Profile {
  name: string;
  role: Role;
  interests: Interest[];
  bio: string;
}

export interface StarterKit {
  profile: Profile;
  resources: Resource[];
  channels: string[];
  people: string[];
}

export interface Resource {
  title: string;
  url: string;
  description?: string;
}

export interface EnergyPulse {
  channelId: string;
  timestamp: Date;
  value: number;
}

export interface NudgeCard {
  id: string;
  channelId: string;
  message: string;
  timestamp: Date;
}

export type EnergyLevel = 'high' | 'medium' | 'low';

export interface ChannelStats {
  channelId: string;
  uniqueSenders: number;
  messageCount: number;
  lastActivity: Date;
}