/**
 * POST /api/flashcards - Generate flashcards
 * GET /api/flashcards - Get all flashcard decks for authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Flashcard from "@/lib/models/Flashcard";
import DocumentModel from "@/lib/models/Document";
import { requireAuth } from "@/lib/auth";
import { generateFlashcards } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { text, documentId, title, cardCount = 10 } = body;

    let contentForFlashcards = text;
    let deckTitle = title || "Generated Flashcards";

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

      contentForFlashcards = document.content;
      deckTitle = `Flashcards: ${document.title}`;
    }

    if (!contentForFlashcards || contentForFlashcards.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No content provided to generate flashcards",
        },
        { status: 400 }
      );
    }

    // Generate flashcards using AI
    const cards = await generateFlashcards(contentForFlashcards, cardCount);

    if (cards.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate flashcards",
        },
        { status: 500 }
      );
    }

    // Add status to each card
    const cardsWithStatus = cards.map((card) => ({
      ...card,
      status: "new",
    }));

    // Create flashcard deck in database
    const flashcardDeck = await Flashcard.create({
      userId: "demo-user",
      documentId: documentId || undefined,
      title: deckTitle,
      cards: cardsWithStatus,
      totalCards: cardsWithStatus.length,
      learnedCards: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Flashcards generated successfully",
        data: {
          deck: {
            id: flashcardDeck._id,
            title: flashcardDeck.title,
            totalCards: flashcardDeck.totalCards,
            cards: flashcardDeck.cards,
            createdAt: flashcardDeck.createdAt,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Generate flashcards error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate flashcards",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const flashcards = await Flashcard.find({}).sort({
      createdAt: -1,
    }).limit(10);

    return NextResponse.json(
      {
        success: true,
        data: {
          flashcards: flashcards.map((deck) => ({
            id: deck._id,
            title: deck.title,
            totalCards: deck.totalCards,
            learnedCards: deck.learnedCards,
            createdAt: deck.createdAt,
          })),
          total: flashcards.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get flashcards error:", error);
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
