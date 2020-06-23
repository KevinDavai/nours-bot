const Discord = require("discord.js")
const fetch = require('node-fetch');
const { getMember } = require("../../functions.js");
const { config } = require("dotenv");

config({
    path: "./private/.env"
});

module.exports = {
    name: "hug",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Hug you or mentioned user.",
    category: "social",
    aliases: ["cuddle"],
    usage: "hug [username | id | mention]",
    usage1: "hug random",
    cooldown: 10,
    run: async (client, message, args) => {

        const member = getMember(message, args.join(" "));

        const data = await fetch(`https://api.tenor.com/v1/random?q=anime_hug&key=${process.env.TENORKEY}&locale=en_US&limit=50`).then(res => res.json())

        const embedhug = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .setFooter("Hug ", message.author.displayAvatarURL({ format: 'png' }))
            .setTimestamp()
            .setImage(data.results[0].media[0].gif.url)

        let RandomMemberGuild = message.guild.members.cache.random();

        if (!args[0]) {
            message.channel.send(embedhug.setDescription(`😇 **${message.author.username}** hugs **${RandomMemberGuild.user.username}**`))
        } else {
            if (args[0] === "random") {
                message.channel.send(embedhug.setDescription(`😇 **${message.author.username}** hugs **${RandomMemberGuild.user.username}**`))
            } else {
                message.channel.send(embedhug.setDescription(`😇 **${message.author.username}** hugs **${member}**`))
            }
        }
    }
}

