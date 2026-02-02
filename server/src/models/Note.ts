import mongoose, { Schema, Types } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high';
export type NoteColor = 'yellow' | 'purple' | 'mint' | 'blue' | 'peach';

export interface INote {
  userId: Types.ObjectId;
  title: string;
  body?: string;
  priority: Priority;
  dueAt?: Date | null;
  completed: boolean;

  // ✅ new
  color: NoteColor;
  tags: string[];
  pinned: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueAt: { type: Date, default: null },
    completed: { type: Boolean, default: false },

    // ✅ new
    color: { type: String, enum: ['yellow', 'purple', 'mint', 'blue', 'peach'], default: 'yellow' },
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', NoteSchema);
