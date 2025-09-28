const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class EngagementService {
  constructor(discordClient) {
    this.client = discordClient;
    this.messageHistory = new Map(); // channelId -> array of messages
    this.pulseScores = new Map(); // channelId -> current score
    this.lastAlert = new Map(); // channelId -> timestamp of last alert
    this.windowSize = 5 * 60 * 1000; // 5 minutes
  }

  trackMessage(messageData) {
    const { channelId, channelName, authorId, content, timestamp } = messageData;
    
    if (!this.messageHistory.has(channelId)) {
      this.messageHistory.set(channelId, []);
    }

    // Add new message
    this.messageHistory.get(channelId).push({
      authorId,
      content,
      timestamp,
      channelName
    });

    // Clean old messages (keep only last 5 minutes)
    this.cleanOldMessages(channelId);

    // Calculate new pulse score
    const score = this.calculatePulseScore(channelId);
    this.pulseScores.set(channelId, score);

    // Check if we need to alert mods
    this.checkForLowPulse(channelId, channelName, score);
  }

  cleanOldMessages(channelId) {
    const now = new Date();
    const messages = this.messageHistory.get(channelId);
    const cutoff = new Date(now.getTime() - this.windowSize);
    
    const recentMessages = messages.filter(msg => msg.timestamp > cutoff);
    this.messageHistory.set(channelId, recentMessages);
  }

  calculatePulseScore(channelId) {
    const messages = this.messageHistory.get(channelId) || [];
    if (messages.length === 0) return 0;

    // Factors: message frequency, unique users, recent activity
    const messageCount = messages.length;
    const uniqueUsers = new Set(messages.map(m => m.authorId)).size;
    const now = new Date();
    const recentMessages = messages.filter(m => now - m.timestamp < 2 * 60 * 1000); // last 2 min

    // Simple scoring algorithm (0-100)
    const frequencyScore = Math.min(messageCount * 10, 50); // max 50 points
    const diversityScore = Math.min(uniqueUsers * 15, 30); // max 30 points
    const recencyScore = Math.min(recentMessages.length * 10, 20); // max 20 points

    return Math.min(frequencyScore + diversityScore + recencyScore, 100);
  }

  async checkForLowPulse(channelId, channelName, score) {
    const threshold = 30;
    const cooldown = 10 * 60 * 1000; // 10 minutes between alerts

    if (score < threshold) {
      const lastAlertTime = this.lastAlert.get(channelId) || 0;
      const now = new Date().getTime();

      if (now - lastAlertTime > cooldown) {
        await this.sendLowPulseAlert(channelId, channelName, score);
        this.lastAlert.set(channelId, now);
      }
    }
  }

  async sendLowPulseAlert(channelId, channelName, score) {
    try {
      // Generate contextual suggestion
      const suggestion = await this.generateReengagementSuggestion(channelName);
      
      // Find mods/admins to alert (simplified - DM the server owner)
      const guild = this.client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
      const owner = await guild.fetchOwner();

      const alertMessage = `🔥 **Pulse Alert**\n\n**Channel:** #${channelName}\n**Score:** ${score}/100\n**Suggestion:** ${suggestion}`;
      
      await owner.send(alertMessage);
      console.log(`✅ Sent low pulse alert for #${channelName}`);
    } catch (error) {
      console.error('Error sending pulse alert:', error);
    }
  }

  async generateReengagementSuggestion(channelName) {
    try {
      const prompt = `Generate a short, engaging conversation starter for a Discord channel called "${channelName}". Make it a question or prompt that encourages participation. Keep it under 100 characters.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 30,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI Error:', error);
      return `What's everyone working on today? Drop your updates! 🚀`;
    }
  }

  getAllPulseScores() {
    const scores = {};
    this.pulseScores.forEach((score, channelId) => {
      scores[channelId] = score;
    });
    return scores;
  }
}

let engagementServiceInstance;

function getEngagementService(client) {
  if (!engagementServiceInstance) {
    engagementServiceInstance = new EngagementService(client);
  }
  return engagementServiceInstance;
}

module.exports = { getEngagementService };