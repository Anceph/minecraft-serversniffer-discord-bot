const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('fs')
const mcstatus = require('node-mcstatus');
const { delay } = require("lodash");

const playerLists = []

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Picks a random server"),
    run: async (client, interaction) => {
        await interaction.reply('Picking a random server...')
        const server = await randomServer("./src/result_with_motd.txt")

        await mcstatus.statusJava(server.ip, 25565)
            .then(async (result) => {
                const embed = new EmbedBuilder()
                    .setColor("#2f963b")
                    .setTitle("Random Server")
                    .addFields(
                        { name: 'IP', value: `${server.ip}`, inline: true },
                        { name: 'Version', value: `${result.version.name_clean}`, inline: true },
                        { name: `Player(s) Online`, value: `**${result.players.online}**` },
                        { name: 'MOTD', value: `${result.motd.clean}` },
                    )

                await interaction.editReply({
                    content: '',
                    embeds: [embed],
                })
            })
            .catch((err) => console.error(err))
    }
};

async function randomServer(filePath) {
    const serversRaw = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    const servers = [];

    // Combine split MOTD lines into one server line
    let previousLine = "";
    for (const line of serversRaw) {
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(line)) {
            // This is a new server line
            servers.push(previousLine.trim());
            previousLine = line;
        } else {
            // This is a continuation of the previous server line's MOTD
            previousLine += line.trim();
        }
    }
    servers.push(previousLine.trim());

    const matchingServers = []

    // Loop through each server in the list
    for (const server of servers) {
        // Split the server info into its components
        const [ip, version, playerCount, ...motdParts] = server.split(" ");

        // Join the remaining parts of the motd to reconstruct it
        const fullMotd = motdParts.join(" ");

        // Add the server info to the list of matching servers
        matchingServers.push({
            ip,
            version,
            playerCount,
            motd: fullMotd
        });
    }

    const random = Math.floor(Math.random() * matchingServers.length)

    return matchingServers[random]
}
