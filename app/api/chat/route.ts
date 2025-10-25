/**
 * POST /api/chat
 * Chat with AI Study Buddy - Q&A and explanations
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { chatWithAI } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, context } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Question is required",
        },
        { status: 400 }
      );
    }

    // Get AI response
    const answer = await chatWithAI(question, context);

    return NextResponse.json(
      {
        success: true,
        data: {
          question,
          answer,
          timestamp: new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get AI response",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
