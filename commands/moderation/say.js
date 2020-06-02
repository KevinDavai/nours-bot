const { RichEmbed } = require("discord.js");
module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Envoyer un message grâcee au bot",
    usage: "<message>",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("❌ You do not have permissions to do this")
                .then(m => m.delete(10000));
        }

        if (args.length < 1) 
            return message.reply("Rien a dire ?").then(m => m.delete(5000));
        
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "fffff" : message.guild.me.displayHexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setImage(client.user.displayAvatarURL)
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setFooter(client.user.username, client.user.displayAvatarURL)

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}