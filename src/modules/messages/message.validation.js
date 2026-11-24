import { z } from "zod";
import { generalFileds } from "../../utils/validation/genaralfildes.js";

// send message validation schema
export const sendMessageSchema = {
  params: z.strictObject({
    receiverId: generalFileds.id,
  }),
  body: z.strictObject({
    content: z.string().trim().min(1).max(500),
  }),
};

// get all messages validation schema
export const getAllMessagesSchema = {
  params: z.strictObject({
    id: generalFileds.id,
  }),
};

// toggle read message validation schema
export const toggleReadMessageSchema = {
  params: z.strictObject({
    messageId: generalFileds.id,
  }),
};

// mark message as favorite validation schema
export const markMessageAsFavoriteSchema = {
  params: z.strictObject({
    messageId: generalFileds.id,
  }),
};
