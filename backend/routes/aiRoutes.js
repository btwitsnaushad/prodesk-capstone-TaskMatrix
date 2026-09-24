const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// Initialize Gemini SDK with your secure .env API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/suggest', authMiddleware, async (req, res) => {
  try {
    const { taskTitle } = req.body;

    if (!taskTitle) {
      return res.status(400).json({ error: 'Please provide a taskTitle to generate sub-steps.' });
    }

    // UPDATE: Using the 'latest' tag to ensure the Google server finds the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    // Sprint 16 Requirement: Force LLM to return strict JSON without markdown formatting
    const systemPrompt = `You are an API. You must respond ONLY with a valid, parsable JSON object matching this exact schema: { "subtasks": ["step 1", "step 2", "step 3"] }. Do not include markdown wrappers, backticks, or conversational text. Generate 3 logical sub-steps for the following task: "${taskTitle}"`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // Parse the string into a real JSON object
    const parsedJSON = JSON.parse(responseText);

    res.status(200).json(parsedJSON);

  } catch (error) {
    console.error('AI Microservice Error:', error.message);
    res.status(500).json({ error: 'The AI service is currently unavailable.' });
  }
});

module.exports = router;