// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for your GitHub Pages domain
app.use(cors({
  origin: 'https://gustavsvedung.github.io',
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Proxy endpoint for Claude API
app.post('/proxy/claude', async (req, res) => {
  try {
    const claudeKey = req.headers['x-claude-key'];
    
    if (!claudeKey) {
      return res.status(400).json({ error: 'Claude API key is required' });
    }
    
    // Log the request body for debugging
    console.log('Request to Claude API:', JSON.stringify(req.body));
    
    const response = await axios({
      method: 'post',
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01', // Updated version
        'x-api-key': claudeKey
      },
      data: req.body
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

// A simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Proxy server is working!' });
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
