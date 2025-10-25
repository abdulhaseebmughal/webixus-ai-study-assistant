/**
 * POST /api/summarize
 * Generate AI summary for text content or document
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DocumentModel from "@/lib/models/Document";
import { requireAuth } from "@/lib/auth";
import { generateSummary } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    console.log("🔵 [API /summarize] Request received");
    await connectDB();

    const body = await request.json();
    const { text, documentId } = body;
    console.log("🔵 [API /summarize] Request body:", { textLength: text?.length, documentId });

    let contentToSummarize = text;

    // If documentId is provided, fetch the document
    if (documentId) {
      const document = await DocumentModel.findOne({
        _id: documentId,
      });

      if (!document) {
        return NextResponse.json(
          {
            success: false,
            message: "Document not found",
          },
          { status: 404 }
        );
      }

      contentToSummarize = document.content;
    }

    if (!contentToSummarize || contentToSummarize.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No content provided to summarize",
        },
        { status: 400 }
      );
    }

    // Generate summary using AI
    console.log("🔵 [API /summarize] Calling generateSummary...");
    const summary = await generateSummary(contentToSummarize);
    console.log("🔵 [API /summarize] Summary generated:", summary);

    // If documentId provided, save summary to document
    if (documentId) {
      await DocumentModel.findByIdAndUpdate(documentId, {
        summary: {
          tldr: summary.tldr,
          detailed: summary.detailed,
          keyPoints: summary.keyPoints,
        },
      });
    }

    console.log("✅ [API /summarize] Success - Returning response");
    return NextResponse.json(
      {
        success: true,
        message: "Summary generated successfully",
        data: {
          summary,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [API /summarize] Error:", error);
    console.error("❌ [API /summarize] Stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate summary",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
