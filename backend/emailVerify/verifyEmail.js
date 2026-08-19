import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (token, email) => {
  try {
    const verificationUrl = `https://ekart-yt.vercel.app/verify/${token}`;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Email Verification",
      html: `
        <h2>Email Verification</h2>

        <p>Hi! There,</p>

        <p>You have recently visited our website and entered your email.</p>

        <p>Please click the button below to verify your email:</p>

        <a
          href="${verificationUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#6366f1;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Verify Email
        </a>

        <p>Thanks</p>
      `,
    });

    if (error) {
      console.error("❌ VERIFICATION MAIL ERROR:", error);
      throw new Error(error.message);
    }

    console.log("✅ Verification Email Sent Successfully");
    console.log("Message ID:", data.id);

    return data;
  } catch (error) {
    console.error("❌ VERIFICATION MAIL ERROR:", error);
    throw error;
  }
};
