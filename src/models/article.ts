/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

import { logger } from "../utils/logger";

export const name = "Article";

export interface ArticleInterface extends Document {
  title: string; // The title of the article
  type: string; // The type of article this is
  authors: [string]; // The user IDs of the authors
  created_at: Date;
  updated_at: Date;
  thumbnail: string; // The path to the article's thumbnail image
  content: string; // The content of the article
}

export const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
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
ArticleSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const Article = model<ArticleInterface>(name, ArticleSchema);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  postCreate: async (req, res, next) => {
    logger.info(`Created a new blog article: ${req.body.title}`);
    next();
  },
};
