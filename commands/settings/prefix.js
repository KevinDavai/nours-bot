const Prefix = require('../../models/prefix.js');

module.exports = {
    name: "prefix",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Show or change bot prefix.",
    aliases: ["prfx"],
    category: "settings",
    usage: "prefix [new prefix]",
    cooldown: 3,
    run: async (client, message, args) => {

        Prefix.findOne({ guildID: message.guild.id }, (err, pre) => {
            let newPrefix = args[0]

            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send(`**${message.author.username}**, You do not have permissions to do this! Please contact a staff member.`)
            }

            if (!args[0]) {
                return message.channel.send(`**${message.author.username}**, Current guild prefix is : \`${pre.prefix}\``)
            }

            if (newPrefix.length >= 5) {
                return message.channel.send(`**${message.author.username}**, Prefix is too long!`)
            }

            pre.prefix = newPrefix;
            pre.save().catch(err => console.log(err));

            message.channel.send(`**${message.author.username}**, New guild prefix is : \`${newPrefix}\``);
        })
    }
};



