# AI Persona Chat Application

A modern Node.js chat application built with Express and EJS that allows users to chat with different AI personas. Users can select between two profiles: **Hitesh Choudhary** and **Piyush Garg**, each with their unique personality and response style.

## Features

- 🎭 **Dual Personas**: Choose between two distinct AI personalities
- 💬 **Real-time Chat**: Interactive chat interface with typing indicators
- ✨ **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly**: Optimized for all device sizes
- 🎨 **Smooth Animations**: CSS animations and transitions throughout the interface
- 🔄 **API Integration**: Ready for external AI service integration

## Personas

### Hitesh Choudhary
- **Role**: Tech enthusiast and coding mentor
- **Style**: Technical, educational, and encouraging
- **Color Theme**: Indigo (#4F46E5)

### Piyush Garg
- **Role**: Creative problem solver and innovator
- **Style**: Creative, innovative, and outside-the-box thinking
- **Color Theme**: Emerald (#059669)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd persona-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
persona-chat-app/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── views/                 # EJS templates
│   ├── index.ejs         # Home page with persona selection
│   └── chat.ejs          # Chat interface
├── public/                # Static assets
└── README.md             # Project documentation
```

## API Endpoints

### GET `/`
- **Description**: Home page with persona selection
- **Response**: Renders the main page with available personas

### GET `/chat/:persona`
- **Description**: Chat interface for a specific persona
- **Parameters**: `persona` (hitesh or piyush)
- **Response**: Renders the chat page with persona details

### POST `/api/chat/:persona`
- **Description**: Send a chat message to a persona
- **Parameters**: `persona` (hitesh or piyush)
- **Body**: `{ "message": "Your message here" }`
- **Response**: 
  ```json
  {
    "success": true,
    "userMessage": { ... },
    "aiMessage": { ... }
  }
  ```

## Customization

### Adding New Personas
1. Add persona data to the `personas` array in `server.js`
2. Update the `generateAIResponse` function with new response patterns
3. Add corresponding avatar URLs (GitHub, Gravatar, or other image services)

### Integrating External AI Services
Replace the `generateAIResponse` function in `server.js` with calls to your preferred AI service:

```javascript
async function generateAIResponse(persona, message) {
  // Example: OpenAI API integration
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: getPersonaPrompt(persona) },
      { role: "user", content: message }
    ]
  });
  
  return response.data.choices[0].message.content;
}
```

### Styling
- Modify CSS variables in the EJS files for color themes
- Update animations in the `@keyframes` sections
- Adjust responsive breakpoints in media queries

## Development

### Available Scripts
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon

### Environment Variables
- `PORT`: Server port (default: 3000)

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] User authentication and chat history persistence
- [ ] Real-time messaging with WebSockets
- [ ] Voice chat capabilities
- [ ] File sharing in chat
- [ ] Multiple language support
- [ ] Advanced AI model integration
- [ ] Chat analytics and insights

## Support

For questions or support, please open an issue in the repository or contact the development team. 