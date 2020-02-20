const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "Ban un membre",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) await message.delete();

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete(10000));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete(10000));
        }

        // No mention
        if (!args[0]) {
            return message.reply("Please provide a person to ban")
                .then(m => m.delete(10000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to ban")
                .then(m => m.delete(10000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member Found
        if (!toBan) {
            return message.reply("Couldn't find that member, try again!")
                .then(m => m.delete(10000));
        }

        // Can't ban urself
        if (message.author.id === toBan.id) {
            return message.reply("Can't ban yourself lol")
                .then(m => m.delete(10000));
        }

        // Can't ban urself
        if (message.guild.me.id === toBan.id) {
            return message.reply("You can't ban me, nice try :)")
                .then(m => m.delete(10000));
        }

        // banable
        if (!toBan.bannable) {
            return message.reply("I can't ban that person due to role hierarchy, I suppose.")
                .then(m => m.delete(10000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**➢ Baned member:** ${toBan} (${toBan.id})
            **➢ Baned by:** ${message.author} (${message.author.id})
            **➢  Reason:** ${args.slice(1).join(" ")}`);
        
        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to ban ${toBan}?`);

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);
            
            if (emoji === "✅") {
                msg.delete();
 
                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`);
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply("ban canceled...")
                    .then(m => m.delete(10000));
            } else {
                msg.delete()
                message.reply("You reacted with neither, the ban was canceled...")
                   .then(m => m.delete(10000));
            }
        });
    }
};