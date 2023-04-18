const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require('fs')

module.exports = {
    name: "test",
    aliases: [],
    cooldown: 0,
    run: async (client, message, args) => {
        if (args.length == "0") return message.reply('You have to provide something to search')
        console.log(args)
        // console.log(findServerByMotd(args, "./src/test_result_with_motd.txt"))
        // const search = args
        // console.log(search)
        // const results = await findServersByMotd("./src/test_result_with_motd.txt", search)
        // console.log(results[0])
        // message.reply(results)

        // // read the file contents
        // const fs = require('fs');
        // const fileContents = fs.readFileSync('./src/test_result_with_motd.txt', 'utf-8');

        // // split the contents into an array of lines
        // const lines = fileContents.split('\n');

        // // remove any leading or trailing white space from each line
        // const trimmedLines = lines.map(line => line.trim());

        // // count the number of non-empty lines
        // const numServers = trimmedLines.filter(line => line !== '').length;

        // message.reply(`There are ${numServers} Minecraft servers in the file.`);
    }
};

function findServerByMotd(motds, filePath) {
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
  
    return matchingServers;
}

// function findServerByMotd(motd, filePath) {
//     const serversRaw = fs.readFileSync(filePath, 'utf8').trim().split('\n');
//     const servers = [];
  
//     // Combine split MOTD lines into one server line
//     let previousLine = "";
//     for (const line of serversRaw) {
//       if (!line.startsWith(" ")) {
//         // This is a new server line
//         servers.push(previousLine.trim());
//         previousLine = line;
//       } else {
//         // This is a continuation of the previous server line's MOTD
//         previousLine += line.trim();
//       }
//     }
//     servers.push(previousLine.trim());
  
//     const matchingServers = [];
  
//     // Loop through each server in the list
//     for (const server of servers) {
//       // Check if the motd matches
//       if (server.includes(motd)) {
//         // Split the server info into its components
//         const [ip, version, playerCount, ...motdParts] = server.split(" ");
  
//         // Join the remaining parts of the motd to reconstruct it
//         const fullMotd = motdParts.join(" ");
  
//         // Add the server info to the list of matching servers
//         matchingServers.push({
//           ip,
//           version,
//           playerCount,
//           motd: fullMotd
//         });
//       }
//     }
  
//     return matchingServers;
//   }

// function findServerByMotd(motd, filePath) {
//     const servers = fs.readFileSync(filePath, 'utf8').trim().split('\n');
//     const matchingServers = [];
    
//     // Loop through each server in the list
//     for (const server of servers) {
//       // Check if the motd matches
//       if (server.includes(motd)) {
//         // Split the server info into its components
//         const [ip, version, playerCount, ...motdParts] = server.split(" ");
        
//         // Join the remaining parts of the motd to reconstruct it
//         const fullMotd = motdParts.join(" ");
        
//         // Add the server info to the list of matching servers
//         matchingServers.push({
//           ip,
//           version,
//           playerCount,
//           motd: fullMotd
//         });
//       }
//     }
    
//     return matchingServers;
//   }
function parseServer(fileContents) {
    // split file contents into an array of lines
    const file = fs.readFileSync(fileContents, 'utf-8');
    // console.log(asd)
    const lines = file.split(/\r?\n/);
    // console.log(lines)

    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;
    const versionRegex = /\d+/;

    const servers = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const ipMatches = line.match(ipRegex)

        if (ipMatches && ipMatches.length > 0) {
            const ipAddress = ipMatches[0];
            const index = line.indexOf(ipAddress);
            const extractedPart = line.slice(index + ipAddress.length).split(' ')[1];
            const MOTD = line.replace(ipAddress + ' ' + extractedPart, '')
            if (MOTD.match(versionRegex)) {
                let mahmut = MOTD.replace(/^./, '')
                console.log(mahmut)
            }
            servers.push(MOTD.trim());
        } else {
            // If no IP address was found, push an empty string to the extractedArr array
            servers.push(line);
        }
    }
    // console.log(servers)
  
    // loop through each line
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];

//     // if the line is empty, skip it
//     if (!line) {
//       continue;
//     }

//     // split the line into an array of properties
//     const properties = line.split(',');

//     // if the properties array has less than 4 items, skip it
//     if (properties.length < 4) {
//       continue;
//     }

//     // split the version property into an array of versions
//     const versions = properties[1].trim().split(',');

//     // create a server object from the properties array
//     const server = {
//       ip: properties[0].trim(),
//       versions: versions.map(v => v.trim()),
//       players: parseInt(properties[2].trim()),
//       motd: properties[3].trim()
//     };

//     // add the server object to the array of servers
//     servers.push(server);
//   }
  
    return servers;
}

function findServersByMotd(filename, searchString) {
    const fileContents = fs.readFileSync(filename, 'utf-8');
    const lines = fileContents.split('\n');

    const servers = [];
    let currentServer = {
        ip: '',
        version: '',
        activePlayers: '',
        motd: '',
        isMultiLineMotd: false
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        if (currentServer.ip === '') {
            currentServer.ip = line;
        } else if (currentServer.version === '') {
            currentServer.version = line;
        } else if (currentServer.activePlayers === '') {
            currentServer.activePlayers = line;
        } else if (currentServer.motd === '') {
            currentServer.motd = line;
            if (lines[i + 1] && !lines[i + 1].startsWith(' ')) {
                // The next line doesn't start with a space, so this is a single-line motd.
                currentServer.isMultiLineMotd = false;
                if (currentServer.motd.includes(searchString)) {
                    servers.push({
                        ip: currentServer.ip,
                        version: currentServer.version,
                        activePlayers: currentServer.activePlayers,
                        motd: currentServer.motd
                    });
                }
                currentServer = {
                    ip: '',
                    version: '',
                    activePlayers: '',
                    motd: '',
                    isMultiLineMotd: false
                };
            } else {
                // The next line starts with a space, so this is a multi-line motd.
                currentServer.isMultiLineMotd = true;
            }
        } else {
            // This line is part of a multi-line motd.
            currentServer.motd += '\n' + line;
            if (!lines[i + 1] || !lines[i + 1].startsWith(' ')) {
                // The next line doesn't exist or doesn't start with a space, so this is the last line of the motd.
                currentServer.isMultiLineMotd = false;
                if (currentServer.motd.includes(searchString)) {
                    servers.push({
                        ip: currentServer.ip,
                        version: currentServer.version,
                        activePlayers: currentServer.activePlayers,
                        motd: currentServer.motd
                    });
                }
                currentServer = {
                    ip: '',
                    version: '',
                    activePlayers: '',
                    motd: '',
                    isMultiLineMotd: false
                };
            }
        }
    }

    return servers;
}