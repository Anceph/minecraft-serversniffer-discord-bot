const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Replies with stats of the bot"),
    run: async (client, interaction) => {
        const scannedServerCount = countServers("./src/test_result_with_motd.txt")

        const embed = new EmbedBuilder()
            .setColor("#2f963b")
            .setTitle("Stats")
            .setDescription(`there are currently ${scannedServerCount} servers sniffed`)
        interaction.reply({ embeds: [embed] })
    }
};

function countServers(filename) {
    const fileContents = fs.readFileSync(filename, 'utf-8');
    const lines = fileContents.split('\n');
    const trimmedLines = lines.map(line => line.trim());
    const numServers = trimmedLines.filter(line => line !== '').length;
    
    return numServers;
}