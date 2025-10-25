/**
 * POST /api/documents - Upload and store a document
 * GET /api/documents - Get all documents for authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DocumentModel from "@/lib/models/Document";
import Progress from "@/lib/models/Progress";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    await connectDB();

    const body = await request.json();
    const { title, content, fileType = "text" } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and content are required",
        },
        { status: 400 }
      );
    }

    // Create document
    const document = await DocumentModel.create({
      userId: authUser.userId,
      title,
      content,
      fileType,
      fileSize: content.length,
    });

    // Update user progress
    await Progress.findOneAndUpdate(
      { userId: authUser.userId },
      {
        $inc: { documentsProcessed: 1 },
      },
      { upsert: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        data: {
          document: {
            id: document._id,
            title: document.title,
            fileType: document.fileType,
            createdAt: document.createdAt,
          },
        },
      },
      { status: 201 }
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

    console.error("Document upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    await connectDB();

    // Get all documents for the user
    const documents = await DocumentModel.find({ userId: authUser.userId })
      .select("-content")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: {
          documents: documents.map((doc) => ({
            id: doc._id,
            title: doc.title,
            fileType: doc.fileType,
            fileSize: doc.fileSize,
            hasSummary: !!doc.summary,
            createdAt: doc.createdAt,
          })),
          total: documents.length,
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

    console.error("Get documents error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
