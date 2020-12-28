import { Schema, Document, ObjectId, model } from 'mongoose';
import { NotificationSchema } from './notification';
import { logger } from '../utils/logger';

export interface TeamInterface extends Document {
  name: String,
  tournament_number: Number,
  is_paid: Boolean,
  is_eligible: Boolean,
  owner: String,
  members: [String],
  active_invites: [ObjectId]
};

export const TeamSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  tournament_number: {
    type: Number,
    required: true
  },
  is_paid: {
    type: Boolean,
    required: true
  },
  is_eligible: {
    type: Boolean,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  members: {
    type: [String],
    required: true
  }
});

export const name = 'team';

export const Team = model<TeamInterface>(name, TeamSchema);

export const restifyOptions  = {
  prefix: '',
  version: '',
  postCreate: async (req, res, next) => {
    logger.info(`Created a new team: ${req.body.name}`);
  }
};