/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

import { logger } from "../utils/logger";

export const name = "Team";

// Create an interface for our Team model
export interface TeamInterface extends Document {
  name: string;
  tournamentNumber: number; // MMAI-##
  isPaid: boolean;
  isEligible: boolean; // Whether or not the team is eligible to win prizes
  owner: string; // The user ID of the team owner
  members: [string]; // An array of team member user IDs
  activeInvites: [string]; // An array of notification IDs for outgoing invites
  createdAt: Date; // When this team was created
  updatedAt: Date; // When this team was last updated
}

export const TeamSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  tournamentNumber: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isEligible: {
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
  activeInvites: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
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

    return next();
  },
};
