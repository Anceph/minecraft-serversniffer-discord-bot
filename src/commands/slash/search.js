const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require('fs')
const mcstatus = require('node-mcstatus')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Searches the given input in the database and returns matching servers")
        .addStringOption(option =>
            option
                .setName('search')
                .setDescription('Search for IP, Version and MOTD')
                .setRequired(true)),
    run: async (client, interaction) => {
        await interaction.reply('Searching...')
        const args = interaction.options.getString('search')
        // console.log(args)
        const matching = await findServerByMotd([args], "./src/result_with_motd.txt")
        console.log(matching[0].playerList)

        const pages = []

         matching.forEach((i, index) => {
            const currentPage = index + 1
            
            console.log(i.playerList)

            const embed = new EmbedBuilder()
                .setColor("#2f963b")
                .setTitle("Search Results")
                .setDescription(`Result ${currentPage}/${matching.length}`)
                .addFields(
                    { name: 'IP', value: `${i.ip}`, inline: true },
                    { name: 'Version', value: `${i.version}`, inline: true},
                    { name: `${i.playerCount} Player(s) Online`, value: `**${i.playerList[1]}** (_${i.playerList[0]}_)`},
                    { name: 'MOTD', value: `${i.motd}` },
                )
            pages.push(embed)
        });

        buttonPages(interaction, pages)
    }
};

async function findServerByMotd(motds, filePath) {
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

    const matchingServers = [];
    const checked = []
    const playerLists = []

    // Loop through each server in the list
    for (const server of servers) {
        // Loop through each motd to check for matches
        for (const motd of motds) {
            // Check if the motd matches (case insensitive)
            if (server.toLowerCase().includes(motd.toLowerCase())) {
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
        }
    }

    for (let i = 0; i < matchingServers.length; i++) {
        await mcstatus.statusJava(matchingServers[i].ip, 25565)
            .then(async (result) => {
                (async function() {
                    for (let i = 0; i < result.players.list.length; i++) {
                        await playerLists.push(result.players.list[i].uuid, result.players.list[i].name_clean)
                    }
                    console.log(playerLists)
                })()

                await checked.push({
                    ip: matchingServers[i].ip,
                    version: result.version.name_clean,
                    playerCount: result.players.online,
                    playerList: playerLists,
                    motd: result.motd.clean
                })
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return checked;
}

async function buttonPages(interaction, pages, time = 60000) {
    if (!interaction) throw new Error("Please provide an interaction argument")
    if (!pages) throw new Error("Please provide a page argument")
    if (!Array.isArray(pages)) throw new Error("Pages must be an array")

    if (typeof time !== "number") throw new Error("Time must be a number")
    if (parseInt(time) < 30000)
        throw new Error("Time must be greater than 30 seconds")

    if (pages.length === 1) {
        const page = await interaction.editReply({
            content: '',
            embeds: pages,
            components: [],
            fetchReply: true,
        })

        return page
    }

    const prev = new ButtonBuilder()
        .setCustomId("prev")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)

    const next = new ButtonBuilder()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle(ButtonStyle.Primary)

    const buttonRow = new ActionRowBuilder().addComponents(prev, next)
    let index = 0

    const currentPage = await interaction.editReply({
        content: '',
        embeds: [pages[index]],
        components: [buttonRow],
        fetchReply: true,
    })

    const collector = await currentPage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time,
    })

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id)
            return i.reply({
                content: "You can't use these buttons",
                ephemeral: true,
            })

        await i.deferUpdate()

        if (i.customId === "prev") {
            if (index > 0) index--
        } else if (i.customId === "next") {
            if (index < pages.length - 1) index++
        }

        if (index === 0) prev.setDisabled(true)
        else prev.setDisabled(false)

        if (index === pages.length - 1) next.setDisabled(true)
        else next.setDisabled(false)

        await currentPage.edit({
            embeds: [pages[index]],
            components: [buttonRow],
        })

        collector.resetTimer()
    })

    collector.on("end", async (i) => {
        await currentPage.edit({
            embeds: [pages[index]],
            components: [],
        })
    })
    return currentPage
}