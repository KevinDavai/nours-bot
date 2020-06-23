const Discord = require("discord.js");
module.exports = {
    name: "say",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Send a message with the bot",
    usage: "say [message]",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(`**${message.author.username}**, You do not have permissions to do this. Please contact a staff member.`)
                .then(m => m.delete({ timeout: 10000 }));
        }

        if (args.length < 1)
            return message.channel.send(`**${message.author.username}**, You need to say something.`).then(m => m.delete({ timeout: 5000 }));

        message.channel.send(args.join(" "));
    }
}
