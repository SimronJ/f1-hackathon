import { Channel, Message, Resource, Interest, Role, EnergyPulse, ChannelStats } from './types';

export const MOCK_CHANNELS: Channel[] = [
  { id: 'general', name: 'general', type: 'text', energy: 85 },
  { id: 'introductions', name: 'introductions', type: 'text', energy: 65 },
  { id: 'ai-discussions', name: 'ai-discussions', type: 'text', energy: 92 },
  { id: 'python-help', name: 'python-help', type: 'text', energy: 78 },
  { id: 'growth-hacks', name: 'growth-hacks', type: 'text', energy: 45 },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    channelId: 'general',
    author: 'Alice',
    content: 'Hey everyone! Welcome to our AI community! 🎉',
    timestamp: new Date(Date.now() - 3600000),
    avatar: '👩‍💻'
  },
  {
    id: '2',
    channelId: 'general',
    author: 'Bob',
    content: 'Thanks Alice! Excited to be here and learn from everyone.',
    timestamp: new Date(Date.now() - 3000000),
    avatar: '👨‍🚀'
  },
  {
    id: '3',
    channelId: 'ai-discussions',
    author: 'Charlie',
    content: 'Has anyone tried the new GPT-4 API? The capabilities are incredible!',
    timestamp: new Date(Date.now() - 2400000),
    avatar: '🤖'
  },
  {
    id: '4',
    channelId: 'ai-discussions',
    author: 'Diana',
    content: 'Yes! I built a chatbot with it last week. The natural language understanding is next level.',
    timestamp: new Date(Date.now() - 1800000),
    avatar: '👩‍🔬'
  },
  {
    id: '5',
    channelId: 'python-help',
    author: 'Eve',
    content: 'Quick question: what\'s the best way to handle async operations in Python?',
    timestamp: new Date(Date.now() - 1200000),
    avatar: '🐍'
  },
  {
    id: '6',
    channelId: 'introductions',
    author: 'Frank',
    content: '👋 Hi everyone! I\'m Frank, a senior engineer working on ML infrastructure.',
    timestamp: new Date(Date.now() - 600000),
    avatar: '👨‍💼'
  },
];

export const RESOURCES_CATALOG: Record<Interest, {
  resources: Resource[];
  channels: string[];
  people: string[];
}> = {
  AI: {
    resources: [
      { title: 'Anthropic AI Safety Research', url: 'https://anthropic.com', description: 'Latest research on AI safety and alignment' },
      { title: 'OpenAI API Documentation', url: 'https://platform.openai.com/docs', description: 'Complete guide to using OpenAI APIs' },
      { title: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com', description: 'Practical ML tutorials and guides' },
    ],
    channels: ['#ai-discussions', '#research-papers', '#ml-projects'],
    people: ['@Alice (AI Researcher)', '@Charlie (ML Engineer)', '@Dr. Smith (AI Ethics)'],
  },
  Python: {
    resources: [
      { title: 'Real Python Tutorials', url: 'https://realpython.com', description: 'In-depth Python tutorials for all levels' },
      { title: 'Python.org Official Docs', url: 'https://docs.python.org', description: 'Complete Python documentation' },
      { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com', description: 'Practical Python for everyday tasks' },
    ],
    channels: ['#python-help', '#code-review', '#automation'],
    people: ['@Eve (Python Expert)', '@Bob (Backend Dev)', '@PyGuru (Core Contributor)'],
  },
  Growth: {
    resources: [
      { title: 'First Round Review', url: 'https://review.firstround.com', description: 'Startup growth strategies and tactics' },
      { title: 'Growth Hackers Community', url: 'https://growthhackers.com', description: 'Data-driven growth experiments' },
      { title: 'Lenny\'s Newsletter', url: 'https://lennysnewsletter.com', description: 'Product and growth insights' },
    ],
    channels: ['#growth-hacks', '#marketing', '#analytics'],
    people: ['@Sarah (Growth Lead)', '@Mike (Product Manager)', '@GrowthGuru (Advisor)'],
  },
  Design: {
    resources: [
      { title: 'Figma Design Resources', url: 'https://figma.com/resources', description: 'Design systems and UI kits' },
      { title: 'Material Design Guidelines', url: 'https://material.io', description: 'Google\'s design system' },
      { title: 'Design Better by InVision', url: 'https://designbetter.co', description: 'Design process and methodology' },
    ],
    channels: ['#design-feedback', '#ui-ux', '#design-systems'],
    people: ['@Diana (UX Designer)', '@Alex (Design Lead)', '@PixelPerfect (Creative Director)'],
  },
  Product: {
    resources: [
      { title: 'Product Hunt Makers', url: 'https://producthunt.com', description: 'Discover and launch products' },
      { title: 'Mind the Product', url: 'https://mindtheproduct.com', description: 'Product management community' },
      { title: 'Product School Blog', url: 'https://productschool.com/blog', description: 'PM skills and career advice' },
    ],
    channels: ['#product-feedback', '#roadmaps', '#user-research'],
    people: ['@Frank (Product Lead)', '@Lisa (PM)', '@ProductPro (Consultant)'],
  },
  Data: {
    resources: [
      { title: 'Kaggle Learn', url: 'https://kaggle.com/learn', description: 'Free data science courses' },
      { title: 'Towards Data Science', url: 'https://towardsdatascience.com', description: 'Data science articles and tutorials' },
      { title: 'Data Science Central', url: 'https://datasciencecentral.com', description: 'Community for data professionals' },
    ],
    channels: ['#data-science', '#analytics', '#visualization'],
    people: ['@DataWiz (Data Scientist)', '@Analyst Pro (BI Expert)', '@StatGuru (Researcher)'],
  },
};

export const generateBio = (name: string, role: Role, interests: Interest[]): string => {
  const interestList = interests.slice(0, 2).join(', ');
  return `${name} is a ${role} into ${interestList}. Excited to learn and contribute to the community!`;
};

export const generateIntroMessage = (name: string, role: Role, interests: Interest[], bio: string): Message => {
  const interestEmojis = interests.map(interest => {
    const emojiMap: Record<Interest, string> = {
      AI: '🤖',
      Python: '🐍',
      Growth: '📈',
      Design: '🎨',
      Product: '📱',
      Data: '📊'
    };
    return emojiMap[interest] || '✨';
  }).join(' ');

  return {
    id: `intro-${Date.now()}`,
    channelId: 'introductions',
    author: name,
    content: `🎉 Meet ${name} — ${role} into ${interests.join(', ')}. ${bio} ${interestEmojis}`,
    timestamp: new Date(),
    avatar: '👋'
  };
};

export const getEnergyLevel = (energy: number): 'high' | 'medium' | 'low' => {
  if (energy >= 70) return 'high';
  if (energy >= 40) return 'medium';
  return 'low';
};

export const getEnergyLabel = (energy: number): string => {
  const level = getEnergyLevel(energy);
  const labels = {
    high: 'Active',
    medium: 'Slowing',
    low: 'Quiet'
  };
  return labels[level];
};

export const generateNudgeMessage = (channelName: string): string => {
  const nudges = [
    `Looks quiet in #${channelName}. Try a quick poll: "What are you building this week?"`,
    `#${channelName} could use some energy! How about asking: "Share your latest win or challenge?"`,
    `Time to spark conversation in #${channelName}! Ask: "What's one thing you learned today?"`,
    `#${channelName} is getting sleepy. Wake it up with: "Drop your favorite resources below!"`,
  ];
  return nudges[Math.floor(Math.random() * nudges.length)];
};

export const generateSparklineData = (): number[] => {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
};

export const mockChannelStats: ChannelStats[] = MOCK_CHANNELS.map(channel => ({
  channelId: channel.id,
  uniqueSenders: Math.floor(Math.random() * 20) + 5,
  messageCount: Math.floor(Math.random() * 100) + 20,
  lastActivity: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
}));