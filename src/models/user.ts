import { Schema, Document, ObjectId, model} from 'mongoose';
import { BadgeInterface, BadgeSchema } from './badge';
import { NotificationInterface } from './notification';
import { logger } from '../utils/logger';

// Create an interface for our User model
// Notifications are an array of Mongo IDs
// Badges are an array of Badge objects
export interface UserInterface extends Document {
  username: string,
  full_name: string,
  email: string,
  password: string,
  salt: string,
  hash_iterations: number,
  created_at: Date,
  updated_at: Date,
  is_admin: boolean,
  current_team: string,
  notifications: [NotificationInterface['_id']]
  badges: [ObjectId]
};

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  hash_iterations: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  },
  is_admin: {
    type: Boolean,
    required: true
  },
  current_team: {
    type: String,
    required: false
  },
  badges: {
    type: [BadgeSchema],
    required: true
  }
});

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.virtual('id').get(function() {
  return this._id.toString();
});

export const name = 'user';

export const User = model<UserInterface>(name, UserSchema);

export const restifyOptions  = {
  prefix: '',
  version: '',
  postCreate: async (req, res, next) => {
    logger.info(`Created a new user: ${req.body.username}`);
  }
};