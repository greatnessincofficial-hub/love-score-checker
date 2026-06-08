const express = require('express');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static('public'));

app.post('/analyze', async (req, res) => {
  const { chat } = req.body;
  if (!chat || chat.trim() === '') {
    return res.status(400).json({ error: 'No chat provided' });
  }
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [{ role: 'user', content: 'You are the Love Insurance Kompany AI. Analyse this chat for romantic signals. Return ONLY valid JSON: {"score":85,"verdict":"totally in love","sub":"one funny sentence","signals":{"affection":80,"flirting":70,"effort":60,"emoji_use":90},"insight":"2-3 sentences"} Chat: ' + chat }]
    });
    const text = response.choices[0].message.content;
    res.json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Running at http://localhost:3000');
});
