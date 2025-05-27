import mongoose, { Schema, Document } from "mongoose";

export interface INotifications extends Document {
  title: string;
  content: string;
  notifyTo: mongoose.Types.ObjectId;
}

const notificationsSchema: Schema<INotifications> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    notifyTo: {
      type: Schema.Types.ObjectId,
      ref: "UserModel", 
      required: true,
    },
  },
  {
    timestamps: true,  
  }
);

export const NotificationsModel = mongoose.model<INotifications>("NotificationsModel", notificationsSchema);
