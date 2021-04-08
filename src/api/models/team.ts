/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

export const name = "Team";

// Create an interface for our Team model
export interface TeamInterface extends Document {
  name: string;
  isPaid: boolean;
  isEligible: boolean; // Whether or not the team is eligible to win prizes
  owner: string; // The username of the team owner
  members: [string]; // An array of team member usernames
  activeInvites: [string]; // An array of usernames who have been invited
  createdAt: Date; // When this team was created
  updatedAt: Date; // When this team was last updated
}

export const TeamSchema = new Schema({
  name: {
    type: String,
    unique: true,
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
    // Restrict updates and deletes to owners or admins only
    const restrictedMethods = ["PATCH", "DELETE"];
    if (restrictedMethods.indexOf(req.method) !== -1) {
      const sessionUser = req.session.userInfo;
      const teamId = req.params.id;
      const team = await Team.findById(teamId);
      res.locals.team = team;

      // Only admins can manipulate teams they do not own
      if (team.owner !== sessionUser.username && !sessionUser.isAdmin) {
        return res.status(400).json({
          message: "Only administrators can manage other teams.",
        });
      }
    }

    return next();
  },

  // Run at the start of a POST request
  preCreate: async (req, res, next) => {
    const userInfo = req.session.userInfo;
    const body = req.body;

    // Only admins can create teams for other people
    if (body.owner !== userInfo.username && !userInfo.isAdmin) {
      return next({
        status: 400,
        message: "Only administrators may create a team for a different user.",
      });
    }

    // Ensure the owner is a part of the members list
    if (body.members.indexOf(body.owner) === -1) {
      return next({
        status: 400,
        message: "The owner of a team must be within the members list.",
      });
    }

    // Only admins can set members upon team creation
    if (body.members !== [body.owner] && !userInfo.isAdmin) {
      return next({
        status: 400,
        message:
          "Only administrators may create teams with additional members.",
      });
    }

    // Only admins can set active invites upon team creation
    if (body.activeInvites.length !== 0 && !userInfo.isAdmin) {
      return next({
        status: 400,
        message: "Only administrators may create teams with active invites.",
      });
    }

    // Only admins can set isPaid and isEligible to true
    if ((body.isPaid || body.isEligible) && !userInfo.isAdmin) {
      return next({
        status: 400,
        message: "Only administrators may set team eligibility or paid status.",
      });
    }
  },
};
