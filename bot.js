const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ChannelType,
} = require("discord.js");
const { token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { askQuestion } = require("./assets/modules/nikolaiModule.js");

client.commands = new Collection();

const foldersPath = path.join(__dirname, "assets/commands");
const commandFolders = fs.readdirSync(foldersPath);

client.commands = new Collection();

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const quizDuration = 7200000;

async function checkAndCreateRole(roleName) {
  try {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
      try {
        const role = guild.roles.cache.find((role) => role.name === roleName);

        if (!role) {
          const createdRole = await guild.roles.create({
            name: roleName,
            color: 0xffffff,
            reason: "nikolai was here 😝",
          });
          console.log(
            `Role "${createdRole.name}" created in guild "${guild.name}"`
          );
        }
      } catch (error) {
        console.error(`Error in guild "${guild.name}": ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching guilds: ${error}`);
  }
}

async function checkAndCreateChannel(channelName) {
  try {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
      try {
        const channel = guild.channels.cache.find(
          (channel) => channel.name === channelName
        );

        if (!channel) {
          const createdChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            topic: "i ask questions here every 2 hours!",
            reason: "nikolai was here 😝 (again)",
          });
          console.log(
            `Channel "${createdChannel.name}" created in guild "${guild.name}"`
          );
        }
      } catch (error) {
        console.error(`Error in guild "${guild.name}": ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching guilds: ${error}`);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const deploy = require("./assets/scripts/deploy-commands.js");
  await checkAndCreateRole("🎲 Nikolai's Quiz Time");
  await checkAndCreateChannel("nikolais_quiz_time");

  setTimeout(function () {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
      askQuestion(guild, undefined, false);
    }
  }, 10 * 1000);

  setInterval(function () {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
      askQuestion(guild, undefined, false);
    }
  }, quizDuration);
});

client.login(token);
