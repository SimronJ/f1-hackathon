const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const { generateBio, getRecommendations } = require('../services/openaiService');
const { postToIntroChannel } = require('../services/discordBot');

router.post('/', async (req, res) => {
  try {
    const { name, role, interests, discordId } = req.body;

    if (!name || !role || !interests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate AI bio
    const bio = await generateBio(name, role, interests);
    
    // Get personalized recommendations
    const recommendations = getRecommendations(role, interests);

    // Save to database
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          discord_id: discordId || 'web-user',
          name,
          role,
          interests,
          bio
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Post bio to Discord intro channel
    if (discordId) {
      await postToIntroChannel(bio);
    }

    res.json({
      success: true,
      member: data,
      bio,
      recommendations
    });

  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;