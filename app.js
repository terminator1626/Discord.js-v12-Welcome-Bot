const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./client.json")
const fs = require("fs")

client.on("ready", () => {
    console.log("I am online!")
    const memberID = client.channels.cache.get('823949970381602866')
    memberID.send("I am online!")
    client.user.setActivity(`welcome and bye! | ${config.prefix}help`, { type: "STREAMING" })
});

client.welcome = require("./database/wel.json")
client.on('guildMemberAdd', async(member) => {
    var wel = client.welcome[member.guild.id].ch
    if (!wel) return console.log("Nenalezeno místo pro welcome!")
    const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle('New Member')
        .setDescription(`**${member.displayName}** welcome to ${member.guild.name}, we now have ${member.guild.memberCount} members!`)
    client.channels.cache.get(wel).send(embed)
});
client.leave = require("./database/le.json")
client.on('guildMemberRemove', async(member) => {
    var lea = client.leave[member.guild.id].ch
    if (!wel) return console.log("Nenalezeno místo pro welcome!")
    const embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setTitle('A member left the server :(')
    .setDescription(`**${member.displayName}** has left ${member.guild.name}, we now have ${member.guild.memberCount} members!`)
    client.channels.cache.get(lea).send(embed)
});

client.on('message', async message => {
    if(!message.content.startsWith(config.prefix)) return;
    if(message.author.bot) return;
    if(!message.guild) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "leave") {
        if(message.author.id !== `${config.devid}`)
            return message.reply(`This command is only ${config.devname}`)
        message.delete();
        const text = args.join(" ")
        client.guilds.cache.get(text).leave()
    }

    if (command === "sw" || command === "setwelcome") {
        if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You do not have the perms to use this cmd! Only \`ADMINISTRATOR\`")
        }

        const cmd = args.join(" ").split(" ")
        if (!cmd[0]) {
            return message.channel.send("Example: !setwelcome channel_id")
        }

        client.welcome [cmd[0]] = {
            ch: cmd[0]
        }

        fs.writeFile("./database/wel.json", JSON.stringify(client.welcome, null, 4), err => {
            if (err) throw err
            message.reply(`Successfully added welcome channel to <#${cmd[0]}>!`)
        })
    }
    if (command === "sl" || command === "setleave") {
        if(!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("You do not have the perms to use this cmd! Only \`ADMINISTRATOR\`")
        }

        const cmd = args.join(" ").split(" ")
        if (!cmd[0]) {
            return message.channel.send("Example: !setleave channel_id")
        }

        client.leave [cmd[0]] = {
            ch: cmd[0]
        }

        fs.writeFile("./database/le.json", JSON.stringify(client.leave, null, 4), err => {
            if (err) throw err
            message.reply(`Successfully added leave channel to <#${cmd[0]}>!`)
        })
    }

    if (command === "help") {
        message.channel.send(new Discord.MessageEmbed()
        .setTitle("HELP").setColor("ORANGE")
        .addFields({
            name: "Welcome setting",
            value: `${config.prefix}setwelcome channel_id`,
        }, {
            name: "Leave settings",
            value: `${config.prefix}setleave channel_id`,
        }, {
            name: "Aliases",
            value: `${config.prefix}setwelcome 837098756909432833\n${config.prefix}sw 837098756909432833\n\n${config.prefix}setleave 837098756909432833\n${config.prefix}sl 837098756909432833`,
        })
        )
    }
});

client.login(config.token);
