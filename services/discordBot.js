const { Client, GatewayIntentBits } = require('discord.js');
const { getEngagementService } = require('./engagementService');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let engagementService;

client.once('ready', () => {
  console.log(`✅ Discord bot logged in as ${client.user.tag}`);
  engagementService = getEngagementService(client);
});

// Add this to your discordBot.js after the client.once('ready') block
client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    console.log(`📝 Message in #${message.channel.name}: ${message.content.substring(0, 50)}...`);
    
    // Track engagement
    if (engagementService) {
      engagementService.trackMessage({
        channelId: message.channel.id,
        channelName: message.channel.name,
        authorId: message.author.id,
        content: message.content,
        timestamp: new Date(),
      });
    }
  });

async function postToIntroChannel(bio) {
  try {
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    const channel = guild.channels.cache.get(process.env.INTRO_CHANNEL_ID);
    
    if (channel) {
      await channel.send(bio);
      console.log('✅ Posted bio to intro channel');
    }
  } catch (error) {
    console.error('Error posting to intro channel:', error);
  }
}

function startBot() {
  client.login(process.env.DISCORD_BOT_TOKEN);
}

module.exports = { startBot, postToIntroChannel };