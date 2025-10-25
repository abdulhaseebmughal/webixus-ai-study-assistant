/**
 * Flashcard Model
 * Stores flashcard decks and individual cards
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICard {
  front: string;
  back: string;
  status: "new" | "learning" | "learned";
  reviewedAt?: Date;
}

export interface IFlashcard extends Document {
  _id: string;
  userId: string;
  documentId?: string;
  title: string;
  cards: ICard[];
  totalCards: number;
  learnedCards: number;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema(
  {
    front: {
      type: String,
      required: true,
    },
    back: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "learning", "learned"],
      default: "new",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { _id: false }
);

const FlashcardSchema = new Schema<IFlashcard>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    documentId: {
      type: String,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Flashcard deck title is required"],
      trim: true,
    },
    cards: {
      type: [CardSchema],
      required: true,
      validate: {
        validator: (v: ICard[]) => v.length > 0,
        message: "Flashcard deck must have at least one card",
      },
    },
    totalCards: {
      type: Number,
      required: true,
    },
    learnedCards: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard ||
  mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;
