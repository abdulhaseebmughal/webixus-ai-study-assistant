/**
 * POST /api/quizzes - Generate a new quiz
 * GET /api/quizzes - Get all quizzes for authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import DocumentModel from "@/lib/models/Document";
import Progress from "@/lib/models/Progress";
import { requireAuth } from "@/lib/auth";
import { generateQuiz } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { text, documentId, title, questionCount = 5 } = body;

    let contentForQuiz = text;
    let quizTitle = title || "Generated Quiz";

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

      contentForQuiz = document.content;
      quizTitle = `Quiz: ${document.title}`;
    }

    if (!contentForQuiz || contentForQuiz.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No content provided to generate quiz",
        },
        { status: 400 }
      );
    }

    // Generate quiz questions using AI
    const questions = await generateQuiz(contentForQuiz, questionCount);

    if (questions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate quiz questions",
        },
        { status: 500 }
      );
    }

    // Create quiz in database
    const quiz = await Quiz.create({
      userId: "demo-user",
      documentId: documentId || undefined,
      title: quizTitle,
      questions,
      totalQuestions: questions.length,
      completed: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quiz generated successfully",
        data: {
          quiz: {
            id: quiz._id,
            title: quiz.title,
            totalQuestions: quiz.totalQuestions,
            questions: quiz.questions,
            createdAt: quiz.createdAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Generate quiz error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate quiz",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const quizzes = await Quiz.find({}).sort({
      createdAt: -1,
    }).limit(10);

    return NextResponse.json(
      {
        success: true,
        data: {
          quizzes: quizzes.map((quiz) => ({
            id: quiz._id,
            title: quiz.title,
            totalQuestions: quiz.totalQuestions,
            score: quiz.score,
            completed: quiz.completed,
            completedAt: quiz.completedAt,
            createdAt: quiz.createdAt,
          })),
          total: quizzes.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get quizzes error:", error);
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
