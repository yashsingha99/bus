import mongoose, { Schema, Document } from "mongoose";

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  COORDINATE = "COORDINATE",
}

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
  bookings: mongoose.Types.ObjectId[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  notifications: mongoose.Types.ObjectId[];
  role: ROLE;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
    },

    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "BookingModel",
      },
    ],
    verifyCode: {
      type: String,
      required: true,
    },
    verifyCodeExpiry: {
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
