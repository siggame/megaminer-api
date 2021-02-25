/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

export const name = "Badge";

export interface BadgeInterface extends Document {
  title: string;
  level: number;
  icon: string; // Path to the base badge icon
}

export const BadgeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

// Add a "virtual" property, which just adds a shortcut to the _id model property
BadgeSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const Badge = model<BadgeInterface>(name, BadgeSchema);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
};
