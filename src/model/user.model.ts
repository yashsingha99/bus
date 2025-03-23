import mongoose, { Schema, Document } from "mongoose";

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  COORDINATE = "COORDINATE",
}

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  OTP: number;
  OTPExpiry: Date;
  isVerified: boolean;
  notifications: mongoose.Types.ObjectId[];
  role: ROLE;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
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
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER
    },

    OTP: {
      type: Number,
      required: true,
    },

    OTPExpiry: {
      type: Date,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
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

export const UserModel = mongoose.model<IUser>("UserModel", userSchema);
