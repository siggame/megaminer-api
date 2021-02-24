import { Schema, Document, model } from "mongoose";

export const name = "Notification";

export interface NotificationInterface extends Document {
  type: string; // invite, announcement, submission status, etc.
  title: string; // what the notification actually says
  link: string; // where you are routed on clicking the notification
}

export const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    requireD: true,
  },
  link: {
    type: String,
  },
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
