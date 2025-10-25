/**
 * POST /api/quizzes/[id]/submit
 * Submit quiz answers and calculate score
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import Progress from "@/lib/models/Progress";
import { requireAuth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = requireAuth(request);
    await connectDB();

    const body = await request.json();
    const { answers } = body; // { "0": "answer1", "1": "answer2", ... }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Answers are required",
        },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findOne({
      _id: params.id,
      userId: authUser.userId,
    });

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
        },
        { status: 404 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index.toString()];
      if (userAnswer) {
        question.userAnswer = userAnswer;
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / quiz.totalQuestions) * 100);

    // Update quiz
    quiz.score = score;
    quiz.completed = true;
    quiz.completedAt = new Date();
    await quiz.save();

    // Update user progress
    const progress = await Progress.findOne({ userId: authUser.userId });
    if (progress) {
      progress.quizzesCompleted += 1;
      progress.sessionsCompleted += 1;

      // Update average score
      const totalScore = progress.averageScore * (progress.quizzesCompleted - 1) + score;
      progress.averageScore = Math.round(totalScore / progress.quizzesCompleted);

      await progress.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quiz submitted successfully",
        data: {
          score,
          correctAnswers,
          totalQuestions: quiz.totalQuestions,
          questions: quiz.questions,
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

    console.error("Submit quiz error:", error);
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
