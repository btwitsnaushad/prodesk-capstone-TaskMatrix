const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { z } = require('zod');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize Gemini SDK with secure .env API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Zod validation schema
const suggestSchema = z.object({
  taskTitle: z
    .string()
    .trim()
    .min(3, 'Task title must be at least 3 characters long.')
    .max(200, 'Task title must not exceed 200 characters.')
});

router.post('/suggest', authMiddleware, async (req, res) => {
  try {
    // Validate request before sending it to Gemini
    const validation = suggestSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request data.',
        details: validation.error.issues.map((issue) => issue.message)
      });
    }

    const { taskTitle } = validation.data;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const systemPrompt = `You are an API. You must respond ONLY with a valid, parsable JSON object matching this exact schema: { "subtasks": ["step 1", "step 2", "step 3"] }. Do not include markdown wrappers, backticks, or conversational text. Generate 3 logical sub-steps for the following task: "${taskTitle}"`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    const parsedJSON = JSON.parse(responseText);

    res.status(200).json(parsedJSON);

  } catch (error) {
    console.error('AI Microservice Error:', error.message);

    res.status(500).json({
      error: 'The AI service is currently unavailable.'
    });
  }
});

module.exports = router;