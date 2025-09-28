const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBio(name, role, interests) {
  try {
    const prompt = `Create a friendly 30-word introduction for ${name}, a ${role} interested in ${interests.join(', ')}. Make it welcoming and encouraging for a tech community.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Error:', error);
    return `Hey everyone, meet ${name}! A ${role} interested in ${interests.join(', ')}. Looking forward to connecting!`;
  }
}

function getRecommendations(role, interests) {
  // Simple mapping - can be made more sophisticated later
  const resourceMap = {
    'Student': ['freeCodeCamp', 'Coursera', 'Khan Academy'],
    'Engineer': ['GitHub', 'Stack Overflow', 'LeetCode'],
    'Founder': ['Y Combinator Library', 'First Round Review', 'Indie Hackers'],
  };

  const channelMap = {
    'AI': ['#ai-discussions', '#machine-learning', '#data-science'],
    'Python': ['#python-help', '#web-development', '#automation'],
    'Growth': ['#marketing', '#growth-hacks', '#analytics'],
  };

  const resources = resourceMap[role] || resourceMap['Student'];
  const channels = interests.flatMap(interest => channelMap[interest] || []).slice(0, 3);
  const mentors = ['@Alice (Python mentor)', '@Charan (AI mentor)', '@Dev (Growth expert)'];

  return { resources, channels, mentors };
}

module.exports = { generateBio, getRecommendations };