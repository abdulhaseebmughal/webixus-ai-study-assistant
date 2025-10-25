/**
 * GET /api/progress
 * Get user's learning progress and statistics
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Progress from "@/lib/models/Progress";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authUser = requireAuth(request);
    await connectDB();

    let progress = await Progress.findOne({ userId: authUser.userId });

    // Create progress if doesn't exist
    if (!progress) {
      progress = await Progress.create({
        userId: authUser.userId,
      });
    }

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastStudy = progress.lastStudyDate
      ? new Date(progress.lastStudyDate)
      : null;

    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff > 1) {
        // Streak broken
        progress.streak = 0;
      } else if (daysDiff === 1) {
        // Continue streak
        progress.streak += 1;
      }
      // If daysDiff === 0, same day, don't change streak
    }

    progress.lastStudyDate = new Date();
    await progress.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          progress: {
            totalStudyHours: progress.totalStudyHours,
            sessionsCompleted: progress.sessionsCompleted,
            averageScore: progress.averageScore,
            streak: progress.streak,
            quizzesCompleted: progress.quizzesCompleted,
            flashcardsReviewed: progress.flashcardsReviewed,
            documentsProcessed: progress.documentsProcessed,
            lastStudyDate: progress.lastStudyDate,
            stats: progress.stats.slice(-30), // Last 30 days
          },
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

    console.error("Get progress error:", error);
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
