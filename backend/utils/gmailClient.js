// utils/gmailClient.js
import { google } from "googleapis";

let gmailClient;

export function getGmail() {
  if (gmailClient) return gmailClient;

  // Parse the token.json contents from your environment
  const token = JSON.parse(process.env.GMAIL_TOKEN);

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
  return gmailClient;
}

/** helper to send any email */
export async function sendEmail({ to, subject, html, fromName = "TatAI", fromEmail }) {
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

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });
}
