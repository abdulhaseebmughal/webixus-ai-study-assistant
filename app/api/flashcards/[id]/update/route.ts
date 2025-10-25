/**
 * PATCH /api/flashcards/[id]/update
 * Update flashcard status (new, learning, learned)
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Flashcard from "@/lib/models/Flashcard";
import Progress from "@/lib/models/Progress";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = requireAuth(request);
    await connectDB();

    const body = await request.json();
    const { cardIndex, status } = body;

    if (cardIndex === undefined || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Card index and status are required",
        },
        { status: 400 }
      );
    }

    if (!["new", "learning", "learned"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Must be: new, learning, or learned",
        },
        { status: 400 }
      );
    }

    const deck = await Flashcard.findOne({
      _id: params.id,
      userId: authUser.userId,
    });

    if (!deck) {
      return NextResponse.json(
        {
          success: false,
          message: "Flashcard deck not found",
        },
        { status: 404 }
      );
    }

    if (cardIndex < 0 || cardIndex >= deck.cards.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid card index",
        },
        { status: 400 }
      );
    }

    // Update card status
    const oldStatus = deck.cards[cardIndex].status;
    deck.cards[cardIndex].status = status;
    deck.cards[cardIndex].reviewedAt = new Date();

    // Update learned cards count
    if (oldStatus !== "learned" && status === "learned") {
      deck.learnedCards += 1;
    } else if (oldStatus === "learned" && status !== "learned") {
      deck.learnedCards -= 1;
    }

    await deck.save();

    // Update user progress
    await Progress.findOneAndUpdate(
      { userId: authUser.userId },
      {
        $inc: { flashcardsReviewed: 1 },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Flashcard status updated",
        data: {
          card: deck.cards[cardIndex],
          learnedCards: deck.learnedCards,
          totalCards: deck.totalCards,
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

    console.error("Update flashcard error:", error);
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
