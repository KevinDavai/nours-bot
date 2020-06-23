const Discord = require("discord.js")
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    category: "moderation",
    description: "Kick an user with an optional reason",
    usage: "kick [user] <reason>",
    cooldown: 3,
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

        if (message.deletable) await message.delete();

        // No author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, You do not have permissions to ban members. Please contact a staff member.`)
                .then(m => m.delete({ timeout:10000 }));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.channel.send(`**${message.author.username}**, I do not have permissions to ban members. Please contact a staff member.`)
                .then(m => m.delete({ timeout:10000 }));
        }

        // No mention
        if (!args[0]) {
            return message.channel.send(`**${message.author.username}**, Please provide a person to ban.`)
                .then(m => m.delete({ timeout:10000 }));
        }

        const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        // No member Found
        if (!toKick) {
            return message.channel.send(`**${message.author.username}**, Couldn't find that member, try again!`)
                .then(m => m.delete({ timeout:10000 }));
        }

        let reason = args[1]

        // Kickable
        if (!toKick.kickable) {
            return message.channel.send(`**${message.author.username}**, I can't ban that person due to role hierarchy, I suppose.`)
                .then(m => m.delete({ timeout:10000 }));
        }

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL({ format: 'png' }))
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ format: 'png' }))
            .setTimestamp()

            
        if (!reason) {
            embed.setDescription(stripIndents`**➢ Kicked member:** ${toKick} (${toKick.id})
            **➢ Kicked by:** ${message.author} (${message.author.id})`);
        };
        
        if (reason) {
            embed.setDescription(stripIndents`**➢ Kicked member:** ${toKick} (${toKick.id})
            **➢ Kicked by:** ${message.author} (${message.author.id})
            **➢ Reason:** ${args.slice(1).join(" ")}`);
        };

        
        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to kick ${toKick}?`);

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            
            if (emoji === "✅") {
                msg.delete();
 
                toKick.kick({
                    reason: (reason)
                }).catch(err => {
                        if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`);
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.channel.send(`**${message.author.username}**, You canceled the kick...`)
                    .then(m => m.delete({ timeout: 10000 }));
            } else {
                msg.delete()
                message.channel.send(`**${message.author.username}**, You reacted with neither, the kick was canceled...`)
                   .then(m => m.delete({ timeout:10000 }));
            }
        });
    }
};