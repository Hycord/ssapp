import { Discord } from "./lib";
import { checkEnvironment } from "./util/env";
import { Suggest } from "./commands/suggest";
import { Suggestion } from "./commands/suggestion";
import { escapeMarkdown } from "discord.js";
import { handleCommand } from "./util/interactionHandlers/handleCommand";
import { handleModal } from "./util/interactionHandlers/handleModal";
import { handleButton as handleButton } from "./util/interactionHandlers/handleButton";

const { channelId, guildId, token } = checkEnvironment();

const client = new Discord.Client({
  guildId,
  channelId,
  intents: ["Guilds", "GuildMessages"],
  production: false,
});

client.once("ready", async () => {
  await client.guilds.fetch(client.guildId); // pre-fetch the dev guild during startup

  client.addCommand(new Suggest());
  client.addCommand(new Suggestion());

  await client.pushCommands();

  console.log(`I am now online!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.guild) return; // we should always have a guild ID

  if (interaction.isChatInputCommand()) {
    await handleCommand(client, interaction);
  } else if (interaction.isModalSubmit()) {
    await handleModal(client, interaction);
  } else if (interaction.isButton()) {
    await handleButton(client, interaction);
  }
});

client.login(token);
