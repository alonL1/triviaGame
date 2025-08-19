// Simple Node.js server to handle LLM API calls
// This prevents CORS issues and keeps API keys secure

require('dotenv').config({ path: './config.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Generate trivia questions endpoint
app.post('/api/generate-questions', async (req, res) => {
    const { topic } = req.body;

    try {
        let questions;

        // Try to use OpenAI if API key is available
        if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
            console.log(`🤖 Generating questions about "${topic}" using OpenAI...`);
            questions = await generateQuestionsWithOpenAI(topic);
        } else {
            console.log(`📝 Using fallback questions for "${topic}"...`);
            questions = await generateMockQuestions(topic);
        }

        res.json({ questions, source: openai ? 'openai' : 'fallback' });
    } catch (error) {
        console.error('Error generating questions:', error);
        // Fallback to mock questions if OpenAI fails
        try {
            const fallbackQuestions = await generateMockQuestions(topic);
            res.json({ questions: fallbackQuestions, source: 'fallback', warning: 'Used fallback due to API error' });
        } catch (fallbackError) {
            res.status(500).json({ error: 'Failed to generate questions' });
        }
    }
});

async function generateMockQuestions(topic) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock question templates - in production, these would come from an LLM
    const questionTemplates = [
        {
            question: `What is considered the most important aspect of ${topic}?`,
            answers: ["Historical significance", "Cultural impact", "Scientific value", "Economic importance"],
            correct: 0
        },
        {
            question: `Which of the following is most closely associated with ${topic}?`,
            answers: ["Innovation", "Tradition", "Complexity", "Simplicity"],
            correct: 0
        },
        {
            question: `When studying ${topic}, what should beginners focus on first?`,
            answers: ["Basic principles", "Advanced concepts", "Historical context", "Practical applications"],
            correct: 0
        },
        {
            question: `What makes ${topic} unique compared to related subjects?`,
            answers: ["Distinctive characteristics", "Similar features", "Common elements", "Shared properties"],
            correct: 0
        },
        {
            question: `How has ${topic} evolved over time?`,
            answers: ["Continuous development", "Remained unchanged", "Declined in importance", "Became obsolete"],
            correct: 0
        },
        {
            question: `What is the primary benefit of studying ${topic}?`,
            answers: ["Enhanced understanding", "Entertainment value", "Social status", "Financial gain"],
            correct: 0
        },
        {
            question: `Which skill is most important when learning about ${topic}?`,
            answers: ["Critical thinking", "Memorization", "Physical ability", "Artistic talent"],
            correct: 0
        },
        {
            question: `What role does ${topic} play in modern society?`,
            answers: ["Significant influence", "Minor impact", "No relevance", "Negative effect"],
            correct: 0
        },
        {
            question: `How would experts describe the current state of ${topic}?`,
            answers: ["Rapidly evolving", "Completely static", "In decline", "Becoming irrelevant"],
            correct: 0
        },
        {
            question: `What is the best approach to mastering ${topic}?`,
            answers: ["Consistent practice", "Occasional study", "Passive observation", "Avoiding difficulty"],
            correct: 0
        }
    ];

    // Shuffle and return 5 random questions
    const shuffled = questionTemplates.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5).map((q, index) => ({
        ...q,
        id: index + 1
    }));
}

// OpenAI integration for generating trivia questions
async function generateQuestionsWithOpenAI(topic) {
    const questionsCount = parseInt(process.env.QUESTIONS_PER_GAME) || 5;

    const prompt = `Generate ${questionsCount} challenging but fair trivia questions about "${topic}".

IMPORTANT: Respond with ONLY a valid JSON object, no additional text or formatting.

The JSON should have this exact structure:
{
  "questions": [
    {
      "question": "What is the capital of France?",
      "answers": ["Paris", "London", "Berlin", "Madrid"],
      "correct": 0
    }
  ]
}

Requirements:
- Each question should be clear and unambiguous
- Provide exactly 4 multiple choice answers
- The "correct" field should be the index (0-3) of the correct answer
- Make questions appropriately challenging for the topic
- Ensure factual accuracy
- Mix different difficulty levels
- Avoid overly obscure or trick questions

Topic: ${topic}`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a trivia question generator. Always respond with valid JSON only, no additional text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const content = response.choices[0].message.content.trim();

        // Try to parse the JSON response
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (parseError) {
            // If parsing fails, try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in response');
            }
        }

        // Validate the structure
        if (!parsed.questions || !Array.isArray(parsed.questions)) {
            throw new Error('Invalid response structure: missing questions array');
        }

        // Validate each question
        const validatedQuestions = parsed.questions.map((q, index) => {
            if (!q.question || !q.answers || !Array.isArray(q.answers) || q.answers.length !== 4) {
                throw new Error(`Invalid question structure at index ${index}`);
            }
            if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
                throw new Error(`Invalid correct answer index at question ${index}`);
            }
            return {
                question: q.question,
                answers: q.answers,
                correct: q.correct,
                id: index + 1
            };
        });

        console.log(`✅ Successfully generated ${validatedQuestions.length} questions using OpenAI`);
        return validatedQuestions;

    } catch (error) {
        console.error('OpenAI API error:', error.message);
        throw error;
    }
}

app.listen(PORT, () => {
    console.log(`🎮 Trivia Game server running at http://localhost:${PORT}`);
    console.log(`🚀 Open your browser and navigate to the URL above to play!`);
    console.log('');

    if (openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
        console.log('🤖 OpenAI integration: ENABLED');
        console.log('   Questions will be generated using GPT-3.5-turbo');
    } else {
        console.log('📝 OpenAI integration: DISABLED (using fallback questions)');
        console.log('   To enable: Set OPENAI_API_KEY in config.env');
    }
    console.log('');
});

module.exports = app;