import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });
export function checkEnvironment() {
  if (!process.env.DISCORD_CHANNEL_ID)
    throw new Error("Invalid Environment: No Guild ID Specified");
  if (!process.env.DISCORD_GUILD_ID)
    throw new Error("Invalid Environment: No Guild ID Specified");
  if (!process.env.DISCORD_TOKEN)
    throw new Error("Invalid Environment: No Token Specified");

  if (!process.env.DATABASE_URL)
    throw new Error("Invalid Environment: No Database URL Specified");

  return {
    guildId: process.env.DISCORD_GUILD_ID!,
    token: process.env.DISCORD_TOKEN!,
    channelId: process.env.DISCORD_CHANNEL_ID!,
  };
}
