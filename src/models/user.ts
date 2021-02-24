/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";
import { validate } from "email-validator";
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
  notifications: [string]; // An array of notification IDs
  badges: [string]; // An array of badge IDs
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
    type: [String],
    default: [],
  },
  badges: {
    type: [String],
    default: [],
  },
});

// Add a "virtual" property, which just adds a shortcut to the _id model property
UserSchema.virtual("id").get(function () {
  return this._id.toString();
});

// Validate email syntax
UserSchema.path("email").validate((email: string) => validate(email));

export const User = model<UserInterface>(name, UserSchema);

// Add a ton of hooks
export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  preCreate: async (req, res, next) => {
    // Validate and finish populating newly created users
    req.body.salt = await getRandomSalt();
    req.body.password = await getHashedPassword(
      req.body.password,
      req.body.salt
    );

    next();
  },
  postCreate: async (req, res, next) => {
    logger.info(`Created a new user: ${req.body.username}`);
    req.erm.result = cleanUserData(req.erm.result);
    next();
  },
  postRead: async (req, res, next) => {
    const result = req.erm.result;

    // After fetching user information, remove password information
    if (Array.isArray(result)) {
      // If we are listing users, remove each user's password info
      req.erm.result = result.map((user) => cleanUserData(user));
    } else {
      // If we are fetching a single user, remove their password info
      req.erm.result = cleanUserData(req.erm.result);
    }

    next();
  },
};
