/**
 * DigitalOcean AI Integration
 * Utilities for calling DigitalOcean AI Inference API
 */

const DO_API_KEY = process.env.DO_API_KEY!;
const DO_API_URL = process.env.DO_API_URL || "https://api.digitalocean.com/v2/ai/inference";

if (!DO_API_KEY) {
  throw new Error("Please define DO_API_KEY in .env.local");
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Call DigitalOcean AI for text generation
 */
export async function callDOAI(
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<AIResponse> {
  const {
    model = "meta-llama/llama-3.1-70b-instruct",
    maxTokens = 1000,
    temperature = 0.7,
  } = options;

  try {
    const response = await fetch(DO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DO_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DigitalOcean AI API Error:", errorText);
      return {
        success: false,
        error: `AI API request failed: ${response.statusText}`,
      };
    }

    const data = await response.json();
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
 * Generate summary using AI
 */
export async function generateSummary(text: string): Promise<{
  tldr: string;
  detailed: string;
  keyPoints: string[];
}> {
  const prompt = `
Analyze the following text and provide:
1. A TL;DR (2-3 sentences)
2. A detailed summary (1-2 paragraphs)
3. 5 key points as a JSON array

Text:
${text}

Respond in this exact JSON format:
{
  "tldr": "...",
  "detailed": "...",
  "keyPoints": ["point1", "point2", "point3", "point4", "point5"]
}
`;

  const response = await callDOAI(prompt, { maxTokens: 1500 });

  if (!response.success || !response.data) {
    return {
      tldr: "Error generating summary",
      detailed: "Unable to process the document at this time.",
      keyPoints: [],
    };
  }

  try {
    const aiText = extractAIText(response.data);
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        tldr: parsed.tldr || "",
        detailed: parsed.detailed || "",
        keyPoints: parsed.keyPoints || [],
      };
    }
  } catch (error) {
    console.error("Error parsing AI summary:", error);
  }

  return {
    tldr: "Summary generated successfully",
    detailed: extractAIText(response.data),
    keyPoints: [],
  };
}

/**
 * Generate quiz questions from content
 */
export async function generateQuiz(
  content: string,
  questionCount: number = 5
): Promise<any[]> {
  const prompt = `
Generate ${questionCount} multiple-choice quiz questions based on this content:

${content}

Return a JSON array of questions in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option B",
    "explanation": "Why this is correct..."
  }
]
`;

  const response = await callDOAI(prompt, { maxTokens: 2000 });

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
 * Generate flashcards from content
 */
export async function generateFlashcards(
  content: string,
  cardCount: number = 10
): Promise<any[]> {
  const prompt = `
Create ${cardCount} flashcards from this content:

${content}

Return a JSON array in this exact format:
[
  {
    "front": "Question or concept",
    "back": "Answer or explanation"
  }
]
`;

  const response = await callDOAI(prompt, { maxTokens: 2000 });

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
 * Chat / Q&A with AI
 */
export async function chatWithAI(question: string, context?: string): Promise<string> {
  const prompt = context
    ? `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`
    : question;

  const response = await callDOAI(prompt, { maxTokens: 1000 });

  if (!response.success || !response.data) {
    return "I'm sorry, I couldn't generate a response at this time.";
  }

  return extractAIText(response.data);
}

/**
 * Rewrite or improve text
 */
export async function rewriteText(text: string, style: string = "clear"): Promise<string> {
  const prompt = `
Rewrite the following text to make it ${style} and easy to understand:

${text}

Improved version:
`;

  const response = await callDOAI(prompt, { maxTokens: 1500 });

  if (!response.success || !response.data) {
    return text;
  }

  return extractAIText(response.data);
}
