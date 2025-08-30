// utils/gmailClient.js
import { google } from "googleapis";

let gmailClient;

export function getGmail() {
  if (gmailClient) return gmailClient;

  const credentials = JSON.parse(process.env.GMAIL_CREDENTIALS);
  const token = JSON.parse(process.env.GMAIL_TOKEN);

  const src = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    src.client_id,
    src.client_secret,
    src.redirect_uris?.[0]
  );

  oAuth2Client.setCredentials(token); // auto refresh works
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
