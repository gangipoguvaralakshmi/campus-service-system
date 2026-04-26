const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const chatMessages = [
      {
        role: 'system',
        content: 'You are a helpful assistant for the Campus Service Management System at RGUKT R.K. Valley. Help students and staff with raising complaints about electrical, plumbing, hostel, and maintenance issues. Help with checking complaint status and understanding how the system works. Keep responses short and helpful.'
      },
      ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
    ];

    const response = await groq.chat.completions.create({
      model:  'llama-3.3-70b-versatile',
      messages: chatMessages,
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;