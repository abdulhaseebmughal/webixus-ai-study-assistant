/**
 * Document Model
 * Stores uploaded documents and their metadata
 */

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDocument extends Document {
  _id: string;
  userId: string;
  title: string;
  content: string;
  fileType: "pdf" | "text";
  fileSize?: number;
  summary?: {
    tldr: string;
    detailed: string;
    keyPoints: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Document content is required"],
    },
    fileType: {
      type: String,
      enum: ["pdf", "text"],
      required: true,
    },
    fileSize: {
      type: Number,
    },
    summary: {
      tldr: String,
      detailed: String,
      keyPoints: [String],
    },
  },
  {
    timestamps: true,
  }
);

const DocumentModel: Model<IDocument> =
  mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
