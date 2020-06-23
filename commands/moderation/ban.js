const Discord = require("discord.js")
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    category: "moderation",
    description: "Ban an user with an optional reason",
    usage: "ban [user] <reason>",
    cooldown: 3,
    run: async (client, message, args) => {
        // log [BETA]
        const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

        if (message.deletable) await message.delete();

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, You do not have permissions to ban members. Please contact a staff member.`)
                .then(m => m.delete({ timeout: 10000 }));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, I do not have permissions to ban members. Please contact a staff member.`)
                .then(m => m.delete({ timeout: 10000 }));
        }

        // No mention
        if (!args[0]) {
            return message.channel.send(`**${message.author.username}**, Please provide a person to ban.`)
                .then(m => m.delete({ timeout: 10000 }));
        }

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        // No member Found
        if (!toBan) {
            return message.channel.send(`**${message.author.username}**, Couldn't find that member, try again!`)
                .then(m => m.delete({ timeout: 10000 }));
        }

        let reason = args[1]

        // banable
        if (!toBan.bannable) {
            return message.channel.send(`**${message.author.username}**, I can't ban that person due to role hierarchy, I suppose.`)
                .then(m => m.delete({ timeout: 10000 }));
        }

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL({ format: 'png' }))
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ format: 'png' }))
            .setTimestamp()

        if (!reason) {
            embed.setDescription(stripIndents`**➢ Baned member:** ${toBan} (${toBan.id})
            **➢ Baned by:** ${message.author} (${message.author.id})`);
        };

        if (reason) {
            embed.setDescription(stripIndents`**➢ Baned member:** ${toBan} (${toBan.id})
            **➢ Baned by:** ${message.author} (${message.author.id})
            **➢ Reason:** ${args.slice(1).join(" ")}`);
        };

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to ban ${toBan}?`);

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toBan.ban({
                    reason: (reason)
                }).catch(err => {
                        if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`);
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.channel.send(`**${message.author.username}**, You canceled the ban...`)
                    .then(m => m.delete({ timeout: 10000 }));
            } else {
                msg.delete()
                message.channel.send(`**${message.author.username}**, You reacted with neither, the ban was canceled...`)
                    .then(m => m.delete({ timeout: 10000 }));
            }
        });
    }
};