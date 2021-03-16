/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";
import { validate as validEmail } from "email-validator";
import {
  getHashedPassword,
  getRandomSalt,
  cleanUserData,
} from "../services/passwordService";
import { logger } from "../utils/logger";

export const name = "User";

// Create an interface for our User model
export interface UserInterface extends Document {
  username: string;
  full_name: string;
  email: string;
  password: string;
  salt: string; // The salt used during password hashing
  created_at: Date; // When this user was created
  updated_at: Date; // The last time this user was updated
  is_admin: boolean; // Whether this is an administrator (on a need basis)
  mmai_team: string; // This user's competition team, if any
  club_team: string; // This user's main club team, if any (internal developers)
  notifications: [Schema.Types.Mixed]; // An array of notification objects
}

// Set up the database schema for a User
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validEmail,
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  mmai_team: {
    type: String,
    required: false,
  },
  club_team: {
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

// Add a ton of hooks
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
