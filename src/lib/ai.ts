import OpenAI from 'openai';
import type { Interest, Role } from './types';

export interface ResourceRecommendation {
  name: string;
  link: string;
  topics: string[];
}

export interface PeopleSuggestion {
  name: string;
  role: string;
  interests: string[];
}

class AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      // NOTE: demo only — move to backend for production
      dangerouslyAllowBrowser: true,
    });
  }

  async welcomeBot(name: string, role: Role, interests: Interest[]): Promise<string> {
    const system = 'You are a friendly and concise community assistant. Generate a short, warm, and personalized introduction message (2–3 sentences).';
    const user = `New member joined!\n- Name: ${name}\n- Role: ${role}\n- Interests: ${interests.join(', ')}`;
    try {
      const resp = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });
      return resp.choices[0]?.message?.content?.trim() || '';
    } catch (e) {
      console.error('welcomeBot error', e);
      return '';
    }
  }

  async getResources(role: Role, interests: Interest[], count = 3): Promise<ResourceRecommendation[]> {
    const system = `You are a recommendation engine that suggests learning resources. Given a user's role and interests, return ${count} of the most relevant balanced links as JSON {"resources": [{"name":"...","link":"...","topics":["..."]}]}.`;
    const user = `- Role: ${role}\n- Interests: ${interests.join(', ')}`;
    try {
      const resp = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      });
      const txt = resp.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(txt);
      return Array.isArray(parsed.resources) ? parsed.resources : [];
    } catch (e) {
      console.error('getResources error', e);
      return [];
    }
  }

  async getChannels(role: Role, interests: Interest[], count = 3): Promise<string[]> {
    const CHANNELS = [
      'general',
      'introductions',
      'python-runs-the-world',
      'ai-discussions',
      'python-help',
      'growth-hacks',
      'founder-lounge',
      'design-critique',
      'product-strategy',
      'data-corner',
      'career-advice',
      'study-group',
      'project-showcase',
      'random-fun',
    ];
    const system = `You suggest chat channels. From this list only: ${CHANNELS.join(
      ', '
    )}. Return top ${count} as JSON {"channels":["..."]}.`;
    const user = `- Role: ${role}\n- Interests: ${interests.join(', ')}`;
    try {
      const resp = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 300,
        response_format: { type: 'json_object' },
      });
      const txt = resp.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(txt);
      return Array.isArray(parsed.channels) ? parsed.channels : [];
    } catch (e) {
      console.error('getChannels error', e);
      return [];
    }
  }

  async getPeople(role: Role, interests: Interest[], count = 3): Promise<PeopleSuggestion[]> {
    const SAMPLE_USERS = [
      { name: 'Alice', role: 'Student', interests: ['AI', 'Python', 'Data'] },
      { name: 'Brian', role: 'Engineer', interests: ['Python', 'Growth', 'Product'] },
      { name: 'Clara', role: 'Designer', interests: ['Design', 'Product', 'AI'] },
      { name: 'David', role: 'Founder', interests: ['Growth', 'AI', 'Data'] },
      { name: 'Ella', role: 'Product', interests: ['Product', 'Design', 'Growth'] },
      { name: 'Frank', role: 'Engineer', interests: ['Python', 'Data', 'AI'] },
      { name: 'Grace', role: 'Student', interests: ['Design', 'Growth', 'Product'] },
      { name: 'Henry', role: 'Founder', interests: ['AI', 'Python', 'Growth'] },
      { name: 'Ivy', role: 'Designer', interests: ['Design', 'AI', 'Product'] },
      { name: 'Jack', role: 'Product', interests: ['Data', 'Growth', 'Python'] },
    ];
    const system = `You suggest people to connect with from this list: ${JSON.stringify(
      SAMPLE_USERS
    )}. Return top ${count} as JSON {"people":[{"name":"...","role":"...","interests":["..."]}]}.`;
    const user = `- Role: ${role}\n- Interests: ${interests.join(', ')}`;
    try {
      const resp = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 400,
        response_format: { type: 'json_object' },
      });
      const txt = resp.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(txt);
      return Array.isArray(parsed.people) ? parsed.people : [];
    } catch (e) {
      console.error('getPeople error', e);
      return [];
    }
  }

  async lowPulseSuggestion(chatHistory: string[]): Promise<string> {
    const system = 'Re-engage a quiet channel. Based on the recent chat history, generate a short (1–3 sentence) low-pulse suggestion that continues the topic or starts a relevant one. Natural, warm tone.';
    const user = `Recent chat history:\n\n${chatHistory.join('\n')}\n\nProvide the re-engagement suggestion.`;
    try {
      const resp = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });
      return resp.choices[0]?.message?.content?.trim() || '';
    } catch (e) {
      console.error('lowPulseSuggestion error', e);
      return '';
    }
  }
}

export const aiService = new AIService();
