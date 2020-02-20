const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "kick un membre",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) await message.delete();

        // No author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ You do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete(10000));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete(10000));
        }

        // No mention
        if (!args[0]) {
            return message.reply("Please provide a person to kick")
                .then(m => m.delete(10000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to kick")
                .then(m => m.delete(10000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member Found
        if (!toKick) {
            return message.reply("Couldn't find that member, try again!")
                .then(m => m.delete(10000));
        }

        // Can't kick urself
        if (message.author.id === toKick.id) {
            return message.reply("Can't kick yourself lol")
                .then(m => m.delete(10000));
        }

        // Can't kick urself
        if (message.guild.me.id === toKick.id) {
            return message.reply("You can't kick me, nice try :)")
                .then(m => m.delete(10000));
        }

        // Kickable
        if (!toKick.kickable) {
            return message.reply("I can't kick that person due to role hierarchy, I suppose.")
                .then(m => m.delete(10000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**➢ Kicked member:** ${toKick} (${toKick.id})
            **➢ Kicked by:** ${message.author} (${message.author.id})
            **➢  Reason:** ${args.slice(1).join(" ")}`);
        
        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to kick ${toKick}?`);

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            
            if (emoji === "✅") {
                msg.delete();
 
                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`);
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply("Kick canceled...")
                    .then(m => m.delete(10000));
            } else {
                msg.delete()
                message.reply("You reacted with neither, the kick was canceled...")
                   .then(m => m.delete(10000));
            }
        });
    }
};