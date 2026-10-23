import EventEmitter from "node:events";
import sendEmail from "../email/nodemailer.email.js";
import { emailSubjectEnum } from "../enums/emailSubject.enum.js";
import { template } from "../email/generateHTML.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubjectEnum.confirmEmail,
    html: template(data.code, data.firstName, emailSubjectEnum.confirmEmail),
  }).catch((err) => {
    console.log("Error while sending mail:", err);
  });
});

emailEvent.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailSubjectEnum.resetPassword,
    html: template(data.code, data.firstName, emailSubjectEnum.confirmEmail),
  }).catch((err) => {
    console.log("Error while sending mail:", err);
  });
});
