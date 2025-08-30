import fs from "fs";
import readline from "readline";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

// 1) Put your downloaded file next to this script as credentials.json
const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf8"));
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// 2) Generate auth URL (offline = get refresh token; prompt=consent ensures it's returned)
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: SCOPES,
});

console.log("\nAuthorize this app by visiting this URL:\n", authUrl, "\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Paste the code here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    // tokens contains access_token, refresh_token, expiry_date
    fs.writeFileSync("./token.json", JSON.stringify(tokens, null, 2));
    console.log("\n✅ token.json created with a refresh token.\n");
  } catch (err) {
    console.error("Failed to exchange code for tokens:", err);
  }
});
