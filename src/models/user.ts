/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */

import { Schema, Document, model } from "mongoose";

import { logger } from "../utils/logger";

export const name = "User";

// Create an interface for our User model
export interface UserInterface extends Document {
  username: string;
  full_name: string;
  email: string;
  password: string;
  salt: string; // The random bytes added to their password before hashing
  hash_iterations: number; // The number of times their password is hashed
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
  hash_iterations: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: true,
  },
  is_admin: {
    type: Boolean,
    required: true,
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

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.virtual("id").get(function () {
  return this._id.toString();
});

export const User = model<UserInterface>(name, UserSchema);

export const restifyOptions = {
  prefix: "",
  version: "",
  name: `${name}s`,
  preCreate: async (req, res, next) => {
    next();
  },
  postCreate: async (req, res, next) => {
    logger.info(`Created a new user: ${req.body.username}`);
    next();
  },
  postRead: async (req, res, next) => {
    req.erm.result.map((user) => {
      delete user.hash_iterations;
      delete user.password;
      delete user.salt;
    });
    next();
  },
};
