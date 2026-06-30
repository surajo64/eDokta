import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create SMTP Transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generic email sender
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"eDokta" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("sendEmail Error:", error);
    throw error;
  }
};

/**
 * Send user verification email
 */
export const sendVerificationEmail = async (to, name, token) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verifyUrl = `${clientUrl}/verify-email/${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #004d99; padding: 24px 32px; color: #fff;">
        <h1 style="margin: 0; font-size: 22px;">Verify Your Email</h1>
      </div>
      <div style="padding: 24px 32px; color: #333;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for registering. Please click the button below to verify your email address and activate your account.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #004d99; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">Verify Email Address</a>
        </div>
        <p>If you did not sign up for an account, you can safely ignore this email.</p>
        <p>Best regards,<br><strong>eDokta Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(to, "Email Verification – eDokta", html);
};

/**
 * Send course enrollment confirmation email to student
 */
export const sendEnrollmentConfirmationEmail = async ({
  studentName,
  studentEmail,
  courseTitle,
  courseMode,
  attendanceType,
  courseAddress,
  meetingUrl,
  classSchedule,
  amount,
}) => {
  const currency = process.env.CURRENCY || "NGN";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #2e7d32; padding: 24px 32px; color: #fff;">
        <h1 style="margin: 0; font-size: 22px;">Enrollment Successful!</h1>
      </div>
      <div style="padding: 24px 32px; color: #333;">
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>You have successfully enrolled in the course: <strong>${courseTitle}</strong>.</p>
        <h3>Details:</h3>
        <ul>
          <li><strong>Mode:</strong> ${courseMode || "N/A"}</li>
          <li><strong>Attendance Type:</strong> ${attendanceType}</li>
          ${courseAddress ? `<li><strong>Address:</strong> ${courseAddress}</li>` : ""}
          ${meetingUrl ? `<li><strong>Class Link:</strong> <a href="${meetingUrl}">${meetingUrl}</a></li>` : ""}
          ${classSchedule ? `<li><strong>Schedule:</strong> ${classSchedule}</li>` : ""}
          <li><strong>Amount Paid:</strong> ${amount} ${currency}</li>
        </ul>
        <p>Best regards,<br><strong>eDokta Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(studentEmail, `Course Enrollment Confirmation - ${courseTitle}`, html);
};

/**
 * Send course enrollment notification email to educator
 */
export const sendEnrollmentNotificationEmail = async ({
  educatorName,
  educatorEmail,
  studentName,
  studentEmail,
  courseTitle,
  attendanceType,
  amount,
}) => {
  const currency = process.env.CURRENCY || "NGN";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background: #004d99; padding: 24px 32px; color: #fff;">
        <h1 style="margin: 0; font-size: 22px;">New Student Enrolled</h1>
      </div>
      <div style="padding: 24px 32px; color: #333;">
        <p>Dear <strong>${educatorName}</strong>,</p>
        <p>A new student has enrolled in your course: <strong>${courseTitle}</strong>.</p>
        <h3>Student Info:</h3>
        <ul>
          <li><strong>Name:</strong> ${studentName}</li>
          <li><strong>Email:</strong> ${studentEmail}</li>
          <li><strong>Attendance Type:</strong> ${attendanceType}</li>
          <li><strong>Amount:</strong> ${amount} ${currency}</li>
        </ul>
        <p>Best regards,<br><strong>eDokta Team</strong></p>
      </div>
    </div>
  `;
  return sendEmail(educatorEmail, `New Student Enrolled - ${courseTitle}`, html);
};
