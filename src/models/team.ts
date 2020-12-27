import { Schema, Document, ObjectId, model } from 'mongoose';
import { NotificationSchema } from './notification';

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
  },
  active_invites: [NotificationSchema['_id']]
});

export const Team = model<TeamInterface>('teams', TeamSchema);