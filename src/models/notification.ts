/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

export const name = "Notification";

export interface NotificationInterface extends Document {
  type: string; // invite, announcement, submission status, etc.
  title: string; // What the notification actually says
  link: string; // Where you are routed on clicking the notification
}

export const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
});

// Add a "virtual" property, which just adds a shortcut to the _id model property
NotificationSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const Notification = model<NotificationInterface>(
  name,
  NotificationSchema
);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  postCreate: async (req, res, next) => {
    // Notify the user
    next();
  },
};
