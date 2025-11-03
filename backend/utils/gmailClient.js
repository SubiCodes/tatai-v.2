// utils/gmailClient.js
import { google } from "googleapis";

let gmailClient;

export function getGmail() {
  if (gmailClient) return gmailClient;

  try {
    // Check if GMAIL_TOKEN exists
    if (!process.env.GMAIL_TOKEN) {
      throw new Error("GMAIL_TOKEN environment variable is not set");
    }

    // Parse the token.json contents from your environment
    const token = JSON.parse(process.env.GMAIL_TOKEN);

    // Validate required fields
    if (!token.client_id || !token.client_secret || !token.refresh_token) {
      throw new Error("GMAIL_TOKEN is missing required fields (client_id, client_secret, or refresh_token)");
    }

    console.log("📧 Initializing Gmail client...");

    // Create OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      token.client_id,
      token.client_secret,
      token.redirect_uris?.[0] || "http://localhost" // optional
    );

    // Only set the refresh_token (Google will use it to fetch access tokens automatically)
    oAuth2Client.setCredentials({
      refresh_token: token.refresh_token,
    });

    gmailClient = google.gmail({ version: "v1", auth: oAuth2Client });
    console.log("✅ Gmail client initialized successfully");
    return gmailClient;
  } catch (error) {
    console.error("❌ Failed to initialize Gmail client:", error.message);
    throw error;
  }
}

/** helper to send any email */
export async function sendEmail({ to, subject, html, fromName = "TatAI", fromEmail }) {
  try {
    const gmail = getGmail();

    const fromHeader = fromEmail ? `${fromName} <${fromEmail}>` : fromName;

    const message = [
      `To: ${to}`,
      `From: ${fromHeader}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
    ].join("\r\n");

    const encodedMessage = Buffer.from(message, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    console.log(`✅ Email sent successfully to ${to} - MessageId: ${response.data.id}`);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    if (error.response) {
      console.error("Gmail API Error Details:", error.response.data);
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
