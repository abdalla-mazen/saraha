import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASS } from "../../../config/config.service.js";

export default async function sendEmail({ to = "", subject = "", text = "", html = "" }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: USER_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"ABDALLAH MAZEN" <${USER_EMAIL}>`, // sender address
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}
