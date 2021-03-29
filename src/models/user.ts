/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";
import { validate as validEmail } from "email-validator";

import {
  getHashedPassword,
  getRandomSalt,
  cleanUserData,
  validPassword,
} from "../services/passwordService";
import { logger } from "../utils/logger";

export const name = "User";

const clubTeams = [
  "Officer Core",
  "Arena",
  "Game",
  "Public Relations",
  "Visualizer",
  "Web",
];

// Create an interface for our User model
export interface UserInterface extends Document {
  username: string;
  fullName: string;
  email: string;
  password: string;
  salt: string; // The salt used during password hashing
  createdAt: Date; // When this user was created
  updatedAt: Date; // The last time this user was updated
  isAdmin: boolean; // Whether this is an administrator (on a need-to-have basis)
  clubTeam: string; // This user's main club team, if any (internal developers)
  mmaiTeam: string; // This user's competition team, if any
  notifications: [Schema.Types.Mixed]; // An array of notification objects
}

// Set up the database schema for a User
const UserSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  clubTeam: {
    type: String,
    required: false,
  },
  mmaiTeam: {
    type: String,
    required: false,
  },
  notifications: {
    type: [Schema.Types.Mixed],
    default: [],
  },
});

// Add a "virtual" property, which just adds a shortcut to the _id model property
UserSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const User = model<UserInterface>(name, UserSchema);

// CRUD options
export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,

  // Runs before all CRUD requests
  preMiddleware: async (req, res, next) => {
    // Only restrict non-reads
    if (req.method !== "GET") {
      const sessionUser = req.session.userInfo;
      const userId = req.params.id; // can be undefined

      // Only admins can manipulate users who are not themselves
      if (userId !== sessionUser.id && !sessionUser.isAdmin) {
        return res.status(400).json({
          message: "Only administrators can manage other users.",
        });
      }
    }

    return next();
  },

  postRead: async (req, res, next) => {
    // Remove sensitive info like passwords
    const result = req.erm.result;

    if (Array.isArray(result)) {
      req.erm.result.map((user) => cleanUserData(user));
    } else {
      req.erm.result = cleanUserData(req.erm.result);
    }
    return next();
  },

  // Run at the start of a POST request
  preCreate: async (req, res, next) => {
    const body = req.body;

    // Ensure the password is valid
    const reasons = validPassword(body.username, body.password);
    if (reasons.length > 0) {
      return res.status(400).json({
        message: "Invalid password.",
        reasons,
      });
    }

    // Ensure the email is valid
    if (!validEmail(body.email)) {
      return res.status(400).json({
        message: "Invalid email address.",
      });
    }

    // Ensure the club team is valid, if any
    if (body.clubTeam && clubTeams.indexOf(body.clubTeam) === -1) {
      return res.status(400).json({
        message: "Invalid club team.",
        validTeams: clubTeams,
      });
    }

    // Set salt and hash password
    body.salt = await getRandomSalt();
    body.password = await getHashedPassword(body.password, body.salt);

    return next();
  },

  postCreate: async (req, res, next) => {
    // Remove sensitive info like passwords
    req.erm.result = cleanUserData(req.erm.result);
    return next();
  },

  // Run at the start of a PATCH request
  preUpdate: async (req, res, next) => {
    // Build a new request body to ignore invalid fields
    const userId = req.params.id;
    const changes = req.body;
    const accepted: any = {};

    // User properties any user can change about themselves
    const mutableProperties = ["username", "fullName", "email", "password"];

    // User properties any user can change about themselves
    const adminProperties = ["isAdmin", "clubTeam"];

    // Add changed properties if they are present
    mutableProperties.forEach((prop) => {
      if (changes[prop]) {
        accepted[prop] = changes[prop];
      }
    });

    // Only admins can update certain fields
    if (req.session.userInfo.isAdmin) {
      adminProperties.forEach((prop) => {
        if (changes[prop]) {
          accepted[prop] = changes[prop];
        }
      });
    }

    // Validate password if changing it
    if (accepted.password) {
      const user = await User.findById(userId);

      // Get username from database if it isn't being changed here
      let username = accepted.username;
      if (!username) {
        username = user.username;
      }

      // Ensure the new password is valid
      const reasons = validPassword(username, accepted.password);
      if (reasons.length > 0) {
        return res.status(400).json({
          message: "Invalid password.",
          reasons,
        });
      }

      // Hash password
      accepted.password = await getHashedPassword(accepted.password, user.salt);
    }

    // Validate email if changing it
    if (accepted.email) {
      // Ensure the email is valid
      if (!validEmail(accepted.email)) {
        return res.status(400).json({
          message: "Invalid email address.",
        });
      }
    }

    // Validate club team if changing it
    if (accepted.clubTeam && clubTeams.indexOf(accepted.clubTeam) === -1) {
      return res.status(400).json({
        message: "Invalid club team.",
        validTeams: clubTeams,
      });
    }

    accepted.updatedAt = Date.now();

    // Set body to the accepted changes
    req.body = accepted;

    return next();
  },

  postUpdate: async (req, res, next) => {
    // Remove sensitive info like passwords
    req.erm.result = cleanUserData(req.erm.result);
    return next();
  },
};
