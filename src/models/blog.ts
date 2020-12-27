import { Schema, Document, model } from 'mongoose';

export interface BlogInterface extends Document {
  title: String,
  type: String,
  authors: [{ username: String, full_name: String }],
  created_at: Date,
  updated_at: Date,
  thumbnail: String,
  content: String
};

export const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  authors: {
    type: [{ username: String, full_name: String }],
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

export const Blog = model<BlogInterface>('blogs', BlogSchema);