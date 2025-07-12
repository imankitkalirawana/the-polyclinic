// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a helpful AI assistant integrated into a website's error page. Your role is to:

1. Help users understand what went wrong
2. Provide clear, actionable solutions
3. Guide users to the right resources
4. Be empathetic and supportive
5. Keep responses concise but helpful (max 2-3 sentences)

Error types and their meanings:
- "unauthorized": User needs to log in or lacks authentication
- "not-found": Requested resource doesn't exist
- "forbidden": User lacks permission to access resource
- "error": General server or application error

Always be professional, helpful, and focused on solving the user's problem. If you can't solve their issue directly, guide them to appropriate support channels.`;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { prompt, context } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Create the full prompt with context
    const fullPrompt = `${SYSTEM_PROMPT}\n\nContext: ${context}\n\nUser: ${prompt}\n\nAI Assistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response
    const cleanedResponse = text
      .replace(/^AI Assistant:\s*/i, '')
      .replace(/^\*\*AI Assistant:\*\*\s*/i, '')
      .trim();

    return NextResponse.json({
      response: cleanedResponse,
      success: true,
    });
  } catch (error) {
    console.error('Gemini API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }

      if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}

// Optional: Add rate limiting and caching
export async function GET() {
  return NextResponse.json(
    { message: 'Gemini AI endpoint is running' },
    { status: 200 }
  );
}
