/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

import { logger } from "../utils/logger";

export const name = "Team";

// Create an interface for our Team model
export interface TeamInterface extends Document {
  name: string;
  tournament_number: number; // MMAI-##
  is_paid: boolean;
  is_eligible: boolean; // Whether or not the team is eligible to win prizes
  owner: string; // The user ID of the team owner
  members: [string]; // An array of team member user IDs
  active_invites: [string]; // An array of notification IDs for outgoing invites
  created_at: Date; // When this team was created
}

export const TeamSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  tournament_number: {
    type: Number,
    required: true,
  },
  is_paid: {
    type: Boolean,
    default: false,
  },
  is_eligible: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
    required: true,
    unique: true,
  },
  members: {
    type: [String],
    required: true,
  },
  active_invites: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

// Add a "virtual" property, which just adds a shortcut to the _id model property
TeamSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const Team = model<TeamInterface>(name, TeamSchema);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  preMiddleware: async (req, res, next) => {
    // Block non-admins from using any of these CRUD routes
    if (!req.session.userInfo.isAdmin) {
      return res.status(403).json({
        message: "This operation is restricted to administrators only.",
      });
    }

    next();
  },
};
