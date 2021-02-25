import { Schema, Document, ObjectId, model } from "mongoose";

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

export const Team = model<TeamInterface>(name, TeamSchema);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  preCreate: async (req, res, next) => {
    // Allow admins to specify owners
    if (!(req.session.userInfo.isAdmin && req.body.owner)) {
      // By default, set the owner to the one sending the request
      req.body.owner = req.session.userInfo.id;
    }

    // Admins cannot specify members directly
    req.body.members = [req.body.owner];
    next();
  },
  postCreate: async (req, res, next) => {
    logger.info(`Created a new team: ${req.body.name}`);
    next();
  },
};
