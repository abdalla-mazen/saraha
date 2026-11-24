import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: [true, "content is required"],
      minlength: [1, "content must be at least 1 character"],
      maxlength: [500, "content must be at most 500 characters"],
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ receiverId: 1 });

const MessageModel =  mongoose.models.Message || model("Message", messageSchema);

export default MessageModel;
