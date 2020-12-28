import { Schema, Document, model } from 'mongoose';

export const name = 'Badge';

export interface BadgeInterface extends Document {
  title: string,
  level: number,
  icon: string
};

export const BadgeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
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

export const Badge = model<BadgeInterface>(name, BadgeSchema);

export const restifyOptions = {
  prefix: '',
  version: '',
  name: name + 's'
};