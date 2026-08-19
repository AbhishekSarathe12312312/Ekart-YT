import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTPMail = async (otp, email) => {
  console.log("MAIL_USER:", process.env.MAIL_USER);
  console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);
  console.log("Sending OTP to:", email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    await transporter.verify();

    console.log("✅ Gmail transporter is ready");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    console.log("✅ EMAIL SENT");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

    return info;
  } catch (error) {
    console.log("❌ MAIL ERROR");
    console.log(error);
    throw error;
  }
};
