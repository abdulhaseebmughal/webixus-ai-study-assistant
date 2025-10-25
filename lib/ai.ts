/**
 * DigitalOcean AI Integration
 * Optimized for fast, accurate responses
 */

const DO_API_KEY = process.env.DO_API_KEY!;
const DO_API_ENDPOINT = "https://api.digitalocean.com/v2/genai/chat/completions";

if (!DO_API_KEY) {
  throw new Error("Please define DO_API_KEY in .env.local");
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Call DigitalOcean AI - Optimized for speed and accuracy
 */
export async function callDOAI(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<AIResponse> {
  const {
    model = "meta-llama/llama-3.1-70b-instruct",
    maxTokens = 2000,
    temperature = 0.7,
  } = options;

  try {
    const requestBody = {
      model,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      max_tokens: maxTokens,
      temperature,
    };

    console.log("🚀 [AI REQUEST] Endpoint:", DO_API_ENDPOINT);
    console.log("🚀 [AI REQUEST] Model:", model);
    console.log("🚀 [AI REQUEST] Request Body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(DO_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DO_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📥 [AI RESPONSE] Status:", response.status, response.statusText);
    console.log("📥 [AI RESPONSE] Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [AI ERROR] Response:", errorText);
      return {
        success: false,
        error: `AI API request failed: ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("✅ [AI SUCCESS] Response Data:", JSON.stringify(data, null, 2));

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("DigitalOcean AI Error:", error);
    return {
      success: false,
      error: error.message || "Unknown AI error",
    };
  }
}

/**
 * Extract text from AI response
 */
export function extractAIText(response: any): string {
  try {
    if (response?.choices?.[0]?.message?.content) {
      return response.choices[0].message.content;
    }
    if (response?.content) {
      return response.content;
    }
    return "";
  } catch (error) {
    console.error("Error extracting AI text:", error);
    return "";
  }
}

/**
 * SUMMARIZATION - Fast and accurate text summarization
 */
export async function generateSummary(text: string): Promise<{
  tldr: string;
  detailed: string;
  keyPoints: string[];
}> {
  const systemPrompt = `You are an expert academic summarizer. Your task is to analyze text and provide:
1. A concise TL;DR (2-3 sentences maximum)
2. A detailed summary (150-200 words)
3. Exactly 5 key points (bullet points)

Always respond in valid JSON format. Be clear, concise, and accurate.`;

  const userPrompt = `Summarize this text:

${text.substring(0, 4000)}

Respond with ONLY this JSON format (no other text):
{
  "tldr": "2-3 sentence summary here",
  "detailed": "detailed 150-200 word summary here",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"]
}`;

  console.log("📝 [SUMMARIZE] Starting summary generation...");

  const response = await callDOAI(systemPrompt, userPrompt, {
    maxTokens: 1500,
    temperature: 0.5,
  });

  console.log("📝 [SUMMARIZE] AI Response:", response);

  if (!response.success || !response.data) {
    console.error("📝 [SUMMARIZE] Failed:", response.error);
    return {
      tldr: "Error generating summary",
      detailed: "Unable to process the document at this time.",
      keyPoints: [],
    };
  }

  try {
    const aiText = extractAIText(response.data);
    console.log("📝 [SUMMARIZE] Extracted AI Text:", aiText);

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log("📝 [SUMMARIZE] Found JSON:", jsonMatch[0]);
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("📝 [SUMMARIZE] Parsed Result:", parsed);
      return {
        tldr: parsed.tldr || "",
        detailed: parsed.detailed || "",
        keyPoints: parsed.keyPoints || [],
      };
    }
  } catch (error) {
    console.error("❌ [SUMMARIZE] Error parsing AI summary:", error);
  }

  console.log("📝 [SUMMARIZE] Falling back to plain text");
  return {
    tldr: "Summary generated successfully",
    detailed: extractAIText(response.data),
    keyPoints: [],
  };
}

/**
 * QUIZ GENERATION - Generate smart quiz questions
 */
export async function generateQuiz(
  content: string,
  questionCount: number = 5
): Promise<any[]> {
  const systemPrompt = `You are an expert quiz creator. Generate high-quality multiple-choice questions that test understanding, not just memorization.

Rules:
- Create ${questionCount} questions
- Each question must have exactly 4 options
- Questions should test comprehension and analysis
- Explanations should be clear and educational
- Always output valid JSON`;

  const userPrompt = `Create ${questionCount} multiple-choice quiz questions from this content:

${content.substring(0, 3500)}

Respond with ONLY a JSON array (no other text):
[
  {
    "question": "Clear, specific question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Brief explanation of why this is correct"
  }
]`;

  const response = await callDOAI(systemPrompt, userPrompt, {
    maxTokens: 2500,
    temperature: 0.6,
  });

  if (!response.success || !response.data) {
    return [];
  }

  try {
    const aiText = extractAIText(response.data);
    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Error parsing quiz questions:", error);
  }

  return [];
}

/**
 * FLASHCARD GENERATION - Create effective study flashcards
 */
export async function generateFlashcards(
  content: string,
  cardCount: number = 10
): Promise<any[]> {
  const systemPrompt = `You are an expert at creating effective study flashcards. Create clear, concise flashcards that promote active recall.

Rules:
- Front: Clear question or concept (keep it short)
- Back: Concise answer or explanation (1-2 sentences)
- Focus on key concepts and important facts
- Make cards testable and specific
- Always output valid JSON`;

  const userPrompt = `Create ${cardCount} study flashcards from this content:

${content.substring(0, 3500)}

Respond with ONLY a JSON array (no other text):
[
  {
    "front": "Short question or concept?",
    "back": "Clear, concise answer (1-2 sentences)"
  }
]`;

  const response = await callDOAI(systemPrompt, userPrompt, {
    maxTokens: 2000,
    temperature: 0.5,
  });

  if (!response.success || !response.data) {
    return [];
  }

  try {
    const aiText = extractAIText(response.data);
    const jsonMatch = aiText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Error parsing flashcards:", error);
  }

  return [];
}

/**
 * STUDY BUDDY CHAT - Intelligent Q&A assistant
 */
export async function chatWithAI(question: string, context?: string): Promise<string> {
  const systemPrompt = `You are a helpful Study Buddy AI assistant. Your role is to:
- Answer questions clearly and concisely
- Explain concepts in simple terms
- Provide examples when helpful
- Be encouraging and supportive
- Keep responses focused and educational

Always give accurate, helpful information. If you don't know something, say so.`;

  const userPrompt = context
    ? `Context: ${context}\n\nQuestion: ${question}`
    : question;

  const response = await callDOAI(systemPrompt, userPrompt, {
    maxTokens: 1000,
    temperature: 0.7,
  });

  if (!response.success || !response.data) {
    return "I'm sorry, I couldn't generate a response at this time. Please try again.";
  }

  return extractAIText(response.data);
}

/**
 * TEXT REWRITING - Improve and clarify text
 */
export async function rewriteText(text: string, style: string = "clear"): Promise<string> {
  const systemPrompt = `You are an expert editor. Rewrite text to make it ${style} while preserving the original meaning and key information.

Focus on:
- Clarity and readability
- Proper grammar and structure
- Maintaining factual accuracy
- Making it easy to understand`;

  const userPrompt = `Rewrite this text to make it ${style}:

${text.substring(0, 2000)}`;

  const response = await callDOAI(systemPrompt, userPrompt, {
    maxTokens: 1500,
    temperature: 0.6,
  });

  if (!response.success || !response.data) {
    return text;
  }

  return extractAIText(response.data);
}
