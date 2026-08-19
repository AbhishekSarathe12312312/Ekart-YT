import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPMail = async (otp, email) => {
  try {
    console.log("Sending OTP to:", email);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Password Reset OTP",
      html: `
        <div>
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      throw new Error(error.message);
    }

    console.log("✅ EMAIL SENT");
    console.log("Email ID:", data.id);

    return data;
  } catch (error) {
    console.error("❌ MAIL ERROR:", error);
    throw error;
  }
};
