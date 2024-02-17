const { SlashCommandBuilder } = require("discord.js");

const { askQuestion } = require("../../modules/nikolaiModule.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quiz")
    .setDescription("Nikolai asks you a question on demand"),

  async execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();
    askQuestion(interaction.guild, interaction.channel, true);
  },
};
