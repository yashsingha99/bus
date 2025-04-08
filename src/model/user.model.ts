import mongoose, { Schema, Document } from "mongoose";

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  COORDINATE = "COORDINATE",
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  clerkId: string;
  notifications: mongoose.Types.ObjectId[];
  role: ROLE;
}

const userSchema: Schema<IUser> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER
    },

    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "NotificationModel",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.models.UserModel || mongoose.model<IUser>("UserModel", userSchema);
