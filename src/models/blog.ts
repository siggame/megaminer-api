/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

import { logger } from "../utils/logger";

export const name = "Blog";

export interface BlogInterface extends Document {
  title: string;
  type: string;
  authors: [{ username: string; full_name: string }];
  created_at: Date;
  updated_at: Date;
  thumbnail: string;
  content: string;
}

export const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  authors: {
    type: [{ username: String, full_name: String }],
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Add a "virtual" property, which just adds a shortcut to the _id model property
BlogSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const Blog = model<BlogInterface>(name, BlogSchema);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  postCreate: async (req, res, next) => {
    logger.info(`Created a new blog post: ${req.body.title}`);
    next();
  },
};
