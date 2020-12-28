import { Schema, Document, model } from 'mongoose';

export interface BadgeInterface extends Document {
  title: String,
  level: Number,
  icon: String
};

export const BadgeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
});

export const name = 'badge';

export const Badge = model<BadgeInterface>(name, BadgeSchema);

export const restifyOptions  = {
  prefix: '',
  version: ''
};