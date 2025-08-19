const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');
const fs = require('fs');
require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure marked for markdown parsing with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Store chat history (in production, use a database)
const chatHistory = {
  'hitesh': [],
  'piyush': []
};
const personaData = {
  'hitesh': {
    name: 'Hitesh Choudhary',
    description: 'Tech enthusiast and coding mentor',
    avatar: 'https://avatars.githubusercontent.com/u/11613311?v=4',
    color: '#4F46E5'
  },
  'piyush': {
    name: 'Piyush Garg',
    description: 'Creative problem solver and innovator',
    avatar: 'http://avatars.githubusercontent.com/u/44976328?v=4',
    color: '#059669'
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'AI Persona Chat',
    personas: [
      {
        id: 'hitesh',
        name: 'Hitesh Choudhary',
        description: 'Tech enthusiast and coding mentor',
        avatar: 'https://avatars.githubusercontent.com/u/11613311?v=4',
        color: '#4F46E5'
      },
      {
        id: 'piyush',
        name: 'Piyush Garg',
        description: 'Creative problem solver and innovator',
        avatar: 'http://avatars.githubusercontent.com/u/44976328?v=4',
        color: '#059669'
      }
    ]
  });
});

app.get('/chat/:persona', (req, res) => {
  const persona = req.params.persona;

  if (!personaData[persona]) {
    return res.redirect('/');
  }

  res.render('chat', { 
    persona: { ...personaData[persona], id: persona },
    chatHistory: chatHistory[persona] || [],
    marked: marked
  });
});

// API endpoint for sending chat messages
app.post('/api/chat/:persona', async (req, res) => {
  try {
    const { persona } = req.params;
    const { message } = req.body;

    if (!message || !persona) {
      return res.status(400).json({ error: 'Message and persona are required' });
    }

    // Add user message to chat history
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    if (!chatHistory[persona]) {
      chatHistory[persona] = [];
    }

    chatHistory[persona].push(userMessage);

    // Simulate AI response (replace with actual API call)
    const aiResponse = await generateAIResponse(persona, message);

    // Add AI response to chat history
    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    chatHistory[persona].push(aiMessage);

    res.json({
      success: true,
      userMessage,
      aiMessage
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Function to generate AI response (replace with actual API call)
async function generateAIResponse(persona, message) {
  try {
    const data = fs.readFileSync(`./data/${persona}.txt`, "utf8");
    
    const messages = [
      {
        role: "system",
        content: `
        You are an AI assistant who is ${personaData[persona].name}. You are a persona of ${personaData[persona].name} who is ${personaData[persona].description}

        ${data}
        
        IMPORTANT: Always respond using markdown formatting. Use:
        - **bold** for emphasis
        - *italic* for subtle emphasis
        - \`code\` for inline code
        - \`\`\`javascript\ncode blocks\n\`\`\` for code examples
        - Lists with - or 1. 2. 3.
        - > for quotes
        - Headers with # ## ###
        - Emojis when appropriate
        `
      },
      {
        role: "user",
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Response Error:', error);
    // Fallback to markdown-formatted responses
    const fallbackResponses = {
      hitesh: [
        "That's an interesting question! As a tech enthusiast, I'd love to dive deeper into this topic.\n\nHere's a quick **code example** to get you started:\n\n```javascript\nfunction greetDeveloper(name) {\n  return `Hello ${name}! Ready to code?`;\n}\n```",
        "Great question! Let me share some insights from my coding experience.\n\n**Key Points:**\n- Always start with a plan\n- Test your code incrementally\n- Document as you go\n\n> *Remember: Good code is readable code!*"
      ],
      piyush: [
        "What a creative approach! I love thinking outside the box for solutions.\n\n**Innovation Framework:**\n- 🎯 **Question everything**\n- 💡 **Connect unrelated ideas**\n- 🔄 **Iterate rapidly**\n- 🚀 **Launch and learn**\n\n> *Creativity is intelligence having fun!*",
        "This is fascinating! Let me share some innovative perspectives on this.\n\n**Creative Techniques:**\n1. **Mind Mapping** - Visualize connections\n2. **Reverse Thinking** - Start from the end\n3. **Analogies** - Find similar patterns\n4. **Random Input** - Use unrelated stimuli"
      ]
    };
    
    const responses = fallbackResponses[persona] || fallbackResponses.hitesh;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 