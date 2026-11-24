import { create, find, findById, findByIdAndUpdate, findOne } from "../../DB/database.repository.js";
import MessageModel from "../../DB/model/message.modal.js";
import userModel from "../../DB/model/user.model.js";
import { BadRequestException, NotFoundException } from "../../utils/response/error.response.js";
import sucessResponse from "../../utils/response/sucess.response.js";

// send message
export const sendMessage = async (req, res, next) => {
  const { receiverId } = req.params;
  const { content } = req.body;

  const receiver = await findOne({
    model: userModel,
    fillter: {
      _id: receiverId,
    },
  });

  if (!receiver) {
    throw NotFoundException({ message: " receiver not found" });
  }

  const message = await create({
    model: MessageModel,
    data: [{ content, receiverId }],
  });

  sucessResponse({ res, message: "Done", statusCode: 201, data: { message } });
};

// get all messages
export const getAllMessages = async (req, res, next) => {
  const { id } = req.params
  const message = await find({ model: MessageModel, filter: { receiverId: id } })
  if (!message) {
    throw BadRequestException({ message: "no message" })
  }
  sucessResponse({ res, message: "done", data: message })

}

// toggle read message
export const toggleReadMessage = async(req,res,next) =>{
  const {messageId} = req.params
  const message = await findById({model:MessageModel,id:messageId})
  if(!message){
    throw NotFoundException({message:"message not found"})
  } 
  message.isRead = !message.isRead
  await message.save()
  sucessResponse({ res, message: "done", data: message })
}

// is favorite message
export const markMessageAsFavorite = async (req, res, next) => {
  const { messageId } = req.params;

  const message = await findById({ model: MessageModel, id: messageId });
  if (!message) {
    throw NotFoundException({ message: "Message not found" });
  }
  message.isFavorite = true;
  await message.save();
  sucessResponse({ res, message: "done", data: message });
}