/**
 * Quiz Model
 * Stores generated quizzes and user attempts
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
}

export interface IQuiz extends Document {
  _id: string;
  userId: string;
  documentId?: string;
  title: string;
  questions: IQuizQuestion[];
  score?: number;
  totalQuestions: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
    },
  },
  { _id: false }
);

const QuizSchema = new Schema<IQuiz>(
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
      required: [true, "Quiz title is required"],
      trim: true,
    },
    questions: {
      type: [QuizQuestionSchema],
      required: true,
      validate: {
        validator: (v: IQuizQuestion[]) => v.length > 0,
        message: "Quiz must have at least one question",
      },
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
