const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");
const fetch = require('node-fetch');
const { getMember, formatDate } = require("../../functions.js");
const { config } = require("dotenv");

module.exports = {
    name: "hug",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Hug you or mentioned user.",
    category: "social",
    aliases: ["cuddle"],
    usage: "hug @user",
    usage1: "hug random",
    cooldown: 10,
        run: async (client, message, args) => {   

        const member = getMember(message, args.join(" "));

        const apikey = "HE2DHUE13GS0";
        let search_term = "anime hug";
        const lmt = "15";
        const offset = "0";
        const rating = "G";
        const lang = "en_US"
        const mediafilter = "gif";
        const data = await fetch(`https://api.tenor.com/v1/random?q=anime_hug&key=HE2DHUE13GS0&locale=en_US&limit=50`).then(res => res.json())
        

        const embedhug = new RichEmbed()
        .setColor("ORANGE")
        .setFooter("hug ", message.author.displayAvatarURL)
        .setTimestamp()
        .setImage(data.results[0].media[0].gif.url)

        let RandomMemberGuild = message.guild.members.random();


        if (!args[0] || "random") {
            message.channel.send(embedhug.setDescription(`😇 **${message.author.username}** hugs **${RandomMemberGuild.user.username}**`))
            return
        }

    

        const toHug = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member Found
        if (toHug) {
            message.channel.send(embedhug.setDescription(`😇 **${message.author.username}** hugs **${toHug}**`))
        }
    }
}

  