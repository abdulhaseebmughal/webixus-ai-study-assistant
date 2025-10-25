/**
 * POST /api/rewrite
 * Rewrite or improve text using AI
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { rewriteText } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);

    const body = await request.json();
    const { text, style = "clear" } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Text is required",
        },
        { status: 400 }
      );
    }

    // Valid styles: clear, concise, detailed, simple, academic
    const validStyles = ["clear", "concise", "detailed", "simple", "academic"];
    const selectedStyle = validStyles.includes(style) ? style : "clear";

    // Get AI rewritten text
    const rewritten = await rewriteText(text, selectedStyle);

    return NextResponse.json(
      {
        success: true,
        data: {
          original: text,
          rewritten,
          style: selectedStyle,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Please login",
        },
        { status: 401 }
      );
    }

    console.error("Rewrite error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to rewrite text",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
