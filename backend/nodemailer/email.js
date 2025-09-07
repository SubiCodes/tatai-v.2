// mailer.js (refactored to Gmail API)
import { sendEmail } from "../utils/gmailClient.js";

export const sendVerificationToken = async (to, otp) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #007bff;">Your One-Time Password (OTP)</h2>
        <p style="font-size: 16px; color: #333;">Use the token below to verify your TatAi Account:</p>
        <div style="font-size: 24px; font-weight: bold; color: #ffffff; background: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
          ${otp}
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">Get home repairs done with ease with help of TatAi.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to,
    subject: "Verify your account",
    html: htmlTemplate,
  });
};

export const sendConcern = async (from, message) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">User Concern Submitted</h2>
        <p style="font-size: 16px; color: #555;">You have received a new concern from a user via TatAi.</p>
        <div style="margin-top: 20px;">
          <p style="margin: 8px 0;"><strong>Email:</strong> ${from}</p>
        </div>
        <div style="margin-top: 20px;">
          <p style="font-size: 15px; color: #333;"><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background-color: #f9f9f9; border-left: 4px solid #007bff; padding: 12px; border-radius: 4px; color: #444;">
            ${message}
          </div>
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">Please address this concern at your earliest convenience.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: from,
    fromEmail: "tataihomeassistant@gmail.com",
    to: "tataihomeassistant@gmail.com",
    subject: "User concern",
    html: htmlTemplate,
  });
};

export const sendReportEmail = async ({ from, type, guideTitle, comment, posterName }) => {
  const subject = `User Report - ${type === "Guide" ? "Guide" : "Comment"}`;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">User Report Submitted</h2>
        <div style="margin-top: 20px;">
          <p style="margin: 8px 0;"><strong>Reporter:</strong> ${from}</p>
          <p style="margin: 8px 0;"><strong>Type:</strong> Reported ${type}</p>
          ${type === "Guide"
      ? `<p style="margin: 8px 0;"><strong>Guide Title:</strong> ${guideTitle}</p>
                 <p style="margin: 8px 0;"><strong>Posted By:</strong> ${posterName}</p>`
      : `<p style="margin: 8px 0;"><strong>Comment:</strong> ${comment}</p>
                 <p style="margin: 8px 0;"><strong>Commented By:</strong> ${posterName}</p>`
    }
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">Please review this report in the admin dashboard.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: from,
    fromEmail: "tataihomeassistant@gmail.com",
    to: "tataihomeassistant@gmail.com",
    subject,
    html: htmlTemplate,
  });
};

export const sendGuideStatusUpdate = async (guideTitle, status, recipientEmail, reason = "") => {
  const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);

  const extraMessage =
    status === "pending" || status === "rejected"
      ? `<p style="margin-top: 20px; font-size: 14px; color: #888;">
           For more information, contact <a href="mailto:tataihomeassistant@gmail.com">tataihomeassistant@gmail.com</a>.
         </p>`
      : "";

  const reasonMessage = reason
    ? `<div style="margin-top: 20px;">
         <p><strong>Reason:</strong></p>
         <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
           ${reason}
         </p>
       </div>`
    : "";

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">Guide Status Updated</h2>
        <p style="font-size: 16px; color: #555;">The status of your submitted guide has been updated.</p>
        <div style="margin-top: 20px;">
          <p><strong>Guide Title:</strong> ${guideTitle}</p>
          <p><strong>New Status:</strong> 
            <span style="color: ${status === "accepted"
      ? "#28a745"
      : status === "pending"
        ? "#ffc107"
        : "#dc3545"
    };">${statusCapitalized}</span>
          </p>
        </div>
        ${reasonMessage}
        ${extraMessage}
        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">Thank you for contributing to TatAi.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to: recipientEmail,
    subject: `Guide Status Update: ${guideTitle}`,
    html: htmlTemplate,
  });
};

export const sendPasswordResetEmail = async (to, resetLink) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #0818A8;">Reset Your TatAi Password</h2>
        <p style="font-size: 16px; color: #333;">We received a request to reset your password. Click the button below to set a new one:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #0818A8; color: #ffffff; padding: 12px 24px; margin: 20px 0; border-radius: 5px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
        <p style="font-size: 14px; color: #666;">If you didn’t request this, you can safely ignore this email.</p>
        <p style="margin-top: 20px; font-size: 14px; color: #666;">Get home repairs done with ease – thanks for using TatAi.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to,
    subject: "Reset your TatAi password",
    html: htmlTemplate,
  });
};

export const sendResetToken = async (to, otp) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #007bff;">Your Reset Password Token</h2>
        <p style="font-size: 16px; color: #333;">Use the token below to proceed with your password change:</p>
        <div style="font-size: 24px; font-weight: bold; color: #ffffff; background: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
          ${otp}
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to,
    subject: "Reset Password Token",
    html: htmlTemplate,
  });
};

export const sendUserStatusUpdate = async (userName, status, recipientEmail) => {
  const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);

  // Different color for each status
  const statusColor =
    status === "Verified"
      ? "#28a745" // Green
      : status === "Unverified"
        ? "#ffc107" // Yellow
        : status === "Restricted"
          ? "#fd7e14" // Orange
          : "#dc3545"; // Red for banned

  // Static reason messages based on status
  const reasonMessage =
    status === "Unverified"
      ? `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             You need to verify your account to be able to log in again.
           </p>
         </div>`
      : status === "Verified"
        ? `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             Your account is verified and ready to go. You have full access to all features.
           </p>
         </div>`
        : status === "Restricted"
          ? `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             Your account is restricted. You cannot post guides or give feedback.
           </p>
         </div>`
          : `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             Your account has been banned. You can no longer open or use the app.
           </p>
         </div>`;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">Account Status Update</h2>
        <p style="font-size: 16px; color: #555;">Hello ${userName}, your account status has been updated.</p>
        <div style="margin-top: 20px;">
          <p><strong>New Status:</strong> 
            <span style="color: ${statusColor};">${statusCapitalized}</span>
          </p>
        </div>
        ${reasonMessage}
        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">Thank you for being part of TatAi.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to: recipientEmail,
    subject: `Account Status Update: ${statusCapitalized}`,
    html: htmlTemplate,
  });
};

export const sendUserRoleUpdate = async (userName, newRole, recipientEmail) => {
  const roleCapitalized = newRole.charAt(0).toUpperCase() + newRole.slice(1);

  // Different colors depending on role
  const roleColor =
    newRole === "super admin"
      ? "#6f42c1" // Purple
      : newRole === "admin"
        ? "#007bff" // Blue
        : "#28a745"; // Green for normal user

  // Static messages for each role
  const roleMessage =
    newRole === "user"
      ? `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             You are a regular User. You can use the app normally with standard access.
           </p>
         </div>`
      : newRole === "admin"
        ? `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             You are now an Admin. You can manage guides, feedback, and oversee user activity.
           </p>
         </div>`
        : `<div style="margin-top: 20px;">
           <p><strong>Note:</strong></p>
           <p style="font-size: 14px; color: #555; background: #f9f9f9; padding: 10px; border-radius: 6px; border: 1px solid #eee;">
             You are now a Super Admin. You have full control over the platform, including managing Admins and system-wide settings.
           </p>
         </div>`;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">Role Update Notification</h2>
        <p style="font-size: 16px; color: #555;">Hello ${userName}, your account role has been updated.</p>
        <div style="margin-top: 20px;">
          <p><strong>New Role:</strong> 
            <span style="color: ${roleColor};">${roleCapitalized}</span>
          </p>
        </div>
        ${roleMessage}
        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">Thank you for being part of TatAi.</p>
      </div>
    </div>
  `;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to: recipientEmail,
    subject: `Account Role Update: ${roleCapitalized}`,
    html: htmlTemplate,
  });
};

export const sendReportReviewed = async (to) => {
  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);">
      
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background-color: #0818A8; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-size: 18px; font-weight: bold;">
          TatAi Notification
        </div>
      </div>
      
      <h2 style="color: #0818A8; text-align: center; margin-bottom: 16px;">Report Reviewed</h2>
      
      <p style="font-size: 16px; color: #444; line-height: 1.6;">
        One of our admins has reviewed your submitted report. 
      </p>

      <p style="font-size: 15px; color: #555; line-height: 1.6; margin-top: 12px;">
        We appreciate your effort in helping us maintain a safe and reliable community here at <strong style="color: #0818A8;">TatAi</strong>.
      </p>

      <div style="margin-top: 30px; text-align: center;">
        <a href="#" style="background-color: #0818A8; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: bold; display: inline-block;">
          View Report
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 13px; color: #888; text-align: center;">
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  </div>
`;

  await sendEmail({
    fromName: "TatAI",
    fromEmail: "tataihomeassistant@gmail.com",
    to,
    subject: "Report Reviewed",
    html: htmlTemplate,
  });
};

