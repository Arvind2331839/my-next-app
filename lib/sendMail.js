import nodemailer from "nodemailer";

export const sendMail = async (subject, receiver, body) => {
   
  // basic validation
  if (!subject || !receiver || !body) {
    return { success: false, message: "Subject, receiver, and body are required." };
  }

  // ensure required env vars are present
  const {
    NODEMAILER_HOST,
    NODEMAILER_PORT,
    NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD,
  } = process.env;

  if (!NODEMAILER_HOST || !NODEMAILER_PORT || !NODEMAILER_EMAIL || !NODEMAILER_PASSWORD) {
    return { success: false, message: "Missing mail configuration in environment variables." };
  }
  
  const port = parseInt(NODEMAILER_PORT, 10);
  const secure = port === 465; // secure true only for port 465

  const transporter = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: port,
    secure: secure,
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Arvind Kumar" <${NODEMAILER_EMAIL}>`,
    to: receiver,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    // you can log error here if desired
    return { success: false, message: error.message || "Failed to send email." };
  }
};
