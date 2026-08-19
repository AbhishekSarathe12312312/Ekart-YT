import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const verifyEmail = async (token, email) => {
  try {
    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Hi! There,

You have recently visited our website and entered your email.

Please follow the given link to verify your email:

http://localhost:5173/verify/${token}

Thanks`,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("✅ Verification Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ VERIFICATION MAIL ERROR:", error);
    throw error;
  }
};
