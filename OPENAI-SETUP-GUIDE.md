# 🤖 OpenAI Integration Setup Guide

Your trivia game is now ready for real LLM integration! Follow this step-by-step guide to connect it to OpenAI's GPT-3.5-turbo.

## 🚀 Quick Setup (Recommended)

### Option 1: Automated Setup
1. **Double-click `setup-openai.bat`**
2. **Follow the prompts** - it will guide you through everything
3. **Restart the server** when prompted

### Option 2: Manual Setup
1. **Get your API key** from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Edit `config.env`** and replace `your_openai_api_key_here` with your actual key
3. **Restart the server**

---

## 📋 Detailed Steps

### Step 1: Get OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an OpenAI account
3. Click "**Create new secret key**"
4. **Copy the key** (it starts with `sk-...`)
5. **Save it safely** - you won't be able to see it again!

### Step 2: Configure Your Game
Open `config.env` in any text editor and update this line:
```env
# Change this:
OPENAI_API_KEY=your_openai_api_key_here

# To this (with your actual key):
OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 3: Restart the Server
1. **Stop the current server**: Press `Ctrl+C` in the terminal
2. **Start it again**: Run `npm start` or double-click `start-server.bat`
3. **Look for the confirmation**: You should see "🤖 OpenAI integration: ENABLED"

---

## ✅ How to Test It's Working

### 1. Check Server Status
When you start the server, you should see:
```
🎮 Trivia Game server running at http://localhost:3000
🚀 Open your browser and navigate to the URL above to play!

🤖 OpenAI integration: ENABLED
   Questions will be generated using GPT-3.5-turbo
```

### 2. Test with a Unique Topic
1. Go to [http://localhost:3000](http://localhost:3000)
2. Enter a **unique topic** like "Quantum Physics" or "Ancient Egypt"
3. The loading screen should show "**AI-generated questions! 🤖**"
4. Questions should be specific and relevant to your topic

### 3. Check Console Output
In the server terminal, you should see:
```
🤖 Generating questions about "Your Topic" using OpenAI...
✅ Successfully generated 5 questions using OpenAI
```

---

## 💰 Cost Information

### OpenAI Pricing (GPT-3.5-turbo)
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Per game**: ~$0.001-0.003 (less than a penny!)
- **100 games**: ~$0.10-0.30

### Cost Examples
- **Casual gaming** (10 games/month): ~$0.01-0.03
- **Heavy usage** (100 games/month): ~$0.10-0.30
- **Party gaming** (50 games in one evening): ~$0.05-0.15

**Very affordable for personal use!** 🎉

---

## 🔧 Advanced Configuration

### Customize in `config.env`:
```env
# Number of questions per game (default: 5)
QUESTIONS_PER_GAME=7

# Timer duration in seconds (default: 15)
TIMER_SECONDS=20

# Server port (default: 3000)
PORT=3000
```

### Alternative LLM APIs
The code is structured to easily support other APIs:

**Anthropic Claude:**
```env
ANTHROPIC_API_KEY=your_anthropic_key
```

**Google Gemini:**
```env
GOOGLE_API_KEY=your_google_key
```

---

## 🛠️ Troubleshooting

### Problem: Still seeing "fallback questions"
**Solutions:**
1. Check your API key is correct in `config.env`
2. Make sure you restarted the server after adding the key
3. Verify your OpenAI account has credits

### Problem: "OpenAI API error" in console
**Solutions:**
1. Check your internet connection
2. Verify your API key hasn't expired
3. Check OpenAI service status
4. Ensure you have credits in your OpenAI account

### Problem: Questions seem generic
**Solutions:**
1. Try more specific topics (e.g., "Renaissance Art" vs "Art")
2. Check that OpenAI integration is actually enabled
3. Look for the 🤖 icon in the loading screen

### Problem: Server won't start
**Solutions:**
1. Make sure port 3000 isn't already in use
2. Check that all npm packages are installed: `npm install`
3. Verify Node.js is working: `node --version`

---

## 🎯 Usage Tips

### Best Topics for AI Generation
- **Specific subjects**: "Marine Biology", "Jazz History", "Ancient Rome"
- **Academic fields**: "Organic Chemistry", "Renaissance Literature"
- **Pop culture**: "Marvel Movies", "80s Music", "Video Game History"
- **Avoid**: Very broad topics like "General Knowledge"

### Getting Better Questions
- **Be specific**: "World War 2 Pacific Theater" vs "History"
- **Use proper nouns**: "Shakespeare" vs "Literature"
- **Try niche topics**: The AI often generates great questions for specialized subjects

---

## 🔒 Security Notes

- ✅ **API key is stored locally** in your `config.env` file
- ✅ **Never shared with the browser** - all API calls happen server-side
- ✅ **Not committed to git** (config.env should be in .gitignore)
- ⚠️ **Keep your API key secret** - don't share it or commit it to public repos

---

## 🎉 You're All Set!

Your trivia game now has unlimited, AI-generated questions on any topic! The system will:

1. **Try OpenAI first** for dynamic, topic-specific questions
2. **Fall back gracefully** to curated questions if API is unavailable
3. **Show clear indicators** of which system is being used
4. **Handle errors gracefully** so the game always works

**Enjoy your AI-powered trivia battles!** 🧠🎮

---

## 📞 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Look at the server console output for error messages
3. Try the fallback mode first (without API key) to ensure basic functionality
4. Test with simple topics before trying complex ones

Happy gaming! 🎉