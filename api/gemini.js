import { GoogleGenAI, Type } from "@google/genai";

// This is a backend endpoint that should be deployed to Netlify Functions, Vercel, or your backend server
// The API key is stored server-side and never exposed to the client

export async function geminiChat(messages, systemInstruction) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const result = await chat.sendMessageStream({ message: messages[messages.length - 1].content });
    
    let fullResponse = "";
    for await (const chunk of result) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function geminiGenerateContent(prompt, responseSchema) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: responseSchema ? {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      } : undefined,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Netlify Functions handler example
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { type, payload } = body;

    if (type === 'chat') {
      const response = await geminiChat(payload.messages, payload.systemInstruction);
      return {
        statusCode: 200,
        body: JSON.stringify({ response }),
      };
    }

    if (type === 'generateContent') {
      const response = await geminiGenerateContent(payload.prompt, payload.responseSchema);
      return {
        statusCode: 200,
        body: JSON.stringify({ response }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request type' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
