/**
 * Progress Model
 * Tracks user learning progress and statistics
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProgress extends Document {
  _id: string;
  userId: string;
  totalStudyHours: number;
  sessionsCompleted: number;
  averageScore: number;
  streak: number;
  lastStudyDate?: Date;
  quizzesCompleted: number;
  flashcardsReviewed: number;
  documentsProcessed: number;
  stats: {
    date: Date;
    hoursStudied: number;
    quizzesTaken: number;
    flashcardsReviewed: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalStudyHours: {
      type: Number,
      default: 0,
    },
    sessionsCompleted: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
    },
    quizzesCompleted: {
      type: Number,
      default: 0,
    },
    flashcardsReviewed: {
      type: Number,
      default: 0,
    },
    documentsProcessed: {
      type: Number,
      default: 0,
    },
    stats: [
      {
        date: { type: Date, required: true },
        hoursStudied: { type: Number, default: 0 },
        quizzesTaken: { type: Number, default: 0 },
        flashcardsReviewed: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Progress: Model<IProgress> =
  mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);

export default Progress;
