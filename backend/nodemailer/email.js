import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    secure:true,
    host: 'smtp.gmail.com',
    port:465,
    auth: {
        user:'tataihomeassistant@gmail.com',
        pass:'rrfycxyyltkinjbi'
    }
})

export const sendResetToken = (to, otp) =>  {
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #007bff;">Your One-Time Password (OTP)</h2>
                <p style="font-size: 16px; color: #333;">Use the token below to proceed with your password change:</p>
                <div style="font-size: 24px; font-weight: bold; color: #ffffff; background: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                    ${otp}
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">You can only recieve this email 5 times in one day.</p>
            </div>
        </div>
    `;

    transporter.sendMail({
        from: 'tataihomeassistant@gmail.com',
        to: to,
        subject: "Reset Password Token",
        html: htmlTemplate
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

export const sendVerificationToken = (to, otp) =>  {
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #007bff;">Your One-Time Password (OTP)</h2>
                <p style="font-size: 16px; color: #333;">Use the token below to verify your TatAi Account:</p>
                <div style="font-size: 24px; font-weight: bold; color: #ffffff; background: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                    ${otp}
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">Get home repairs done with ease with help o TatAi.</p>
            </div>
        </div>
    `;

    transporter.sendMail({
        from: 'tataihomeassistant@gmail.com',
        to: to,
        subject: "Verify your account",
        html: htmlTemplate
    }, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

export const sendConcern = (from, message) => {
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

  transporter.sendMail(
    {
      from: from,
      to: "tataihomeassistant@gmail.com",
      subject: "User concern",
      html: htmlTemplate,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
};

export const sendReportEmail = ({ from, type, guideTitle, comment, posterName }) => {
  const subject = `User Report - ${type === "Guide" ? "Guide" : "Comment"}`;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">User Report Submitted</h2>

        <div style="margin-top: 20px;">
          <p style="margin: 8px 0;"><strong>Reporter:</strong> ${from}</p>
          <p style="margin: 8px 0;"><strong>Type:</strong>Reported ${type}</p>
          ${
            type === "Guide"
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

  transporter.sendMail(
    {
      from: from,
      to: "tataihomeassistant@gmail.com",
      subject,
      html: htmlTemplate,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending report email:", err);
      } else {
        console.log("Report email sent:", info.response);
      }
    }
  );
};

export const sendGuideStatusUpdate = (guideTitle, status, recipientEmail) => {
  const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);
  
  const extraMessage = (status === 'pending' || status === 'rejected') 
    ? `<p style="margin-top: 20px; font-size: 14px; color: #888;">
         For more information, contact <a href="mailto:tataihomeassistant@gmail.com">tataihomeassistant@gmail.com</a>.
       </p>`
    : '';

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
        <h2 style="color: #333333; text-align: center;">Guide Status Updated</h2>
        <p style="font-size: 16px; color: #555;">The status of your submitted guide has been updated.</p>

        <div style="margin-top: 20px;">
          <p><strong>Guide Title:</strong> ${guideTitle}</p>
          <p><strong>New Status:</strong> <span style="color: ${status === 'accepted' ? '#28a745' : status === 'pending' ? '#ffc107' : '#dc3545'};">${statusCapitalized}</span></p>
        </div>

        ${extraMessage}

        <p style="margin-top: 30px; font-size: 14px; color: #aaa;">Thank you for contributing to TatAi.</p>
      </div>
    </div>
  `;

  transporter.sendMail(
    {
      from: "tataihomeassistant@gmail.com",
      to: recipientEmail,
      subject: `Guide Status Update: ${guideTitle}`,
      html: htmlTemplate,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending status update email:", err);
      } else {
        console.log("Status update email sent:", info.response);
      }
    }
  );
};

//NEW STUFF
export const sendPasswordResetEmail = (to, resetLink) => {
  const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; background-color: #f0f8ff; padding: 20px; text-align: center;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #0818A8;">Reset Your TatAi Password</h2>
                <p style="font-size: 16px; color: #333;">
                    We received a request to reset your password. Click the button below to set a new one:
                </p>
                <a href="${resetLink}" style="display: inline-block; background-color: #0818A8; color: #ffffff; padding: 12px 24px; margin: 20px 0; border-radius: 5px; text-decoration: none; font-weight: bold;">
                    Reset Password
                </a>
                <p style="font-size: 14px; color: #666;">
                    If you didn’t request this, you can safely ignore this email.
                </p>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                    Get home repairs done with ease – thanks for using TatAi.
                </p>
            </div>
        </div>
    `;

  transporter.sendMail(
    {
      from: "tataihomeassistant@gmail.com",
      to: to,
      subject: "Reset your TatAi password",
      html: htmlTemplate,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Password reset email sent:", info.response);
      }
    }
  );
};