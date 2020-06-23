const { getMember } = require("../../functions.js");
const Discord = require("discord.js");
const moment = require('moment');

module.exports = {
    name: "whois",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Show information about a user.",
    aliases: ["userinfo", "user", "who"],
    category: "info",
    usage: "whois [username | id | mention]",
    cooldown: 5,
    run: async (client, message, args) => {

        const member = getMember(message, args.join(" "));
        
        const role = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") || "none";

        const permissions = member.permissions.toArray().sort()
            .map(permissions => `\`${permissions.split("_").map(x => x[0] + x.slice(1).toLowerCase()).join(" ")}\``)
            .join(", ") || "none";

        const embedDEV = new Discord.MessageEmbed()
            .setFooter('Nour\'s bot ©️', (client.user.displayAvatarURL({ format: 'png' })))
            .setThumbnail(member.user.displayAvatarURL({ format: 'png' }))
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setAuthor((member.user.tag), (member.user.displayAvatarURL({ format: 'png' })))
            .setTimestamp()
            .addField('**➢  Display name**⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪', `<@${member.user.id}>`, true)    
            .addField('⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪**➢  Nickname**', `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
            .addField('⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪', '⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪', false)
            .addField('**➢  ID**⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪', `\`${member.user.id}\``, true)
            .addField('**➢  Server Boost**', `${member.premiumSince !== null ? `Yes` : 'No'}`, true)
            .addField('⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪', '⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪', false)
            .addField('⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪**➢  Created Date**', `\`${moment.utc(member.user.createdAt).format("ddd DD MMM YYYY, H:mm:ss")}\``, true)
            .addField('⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪**➢  Joined Date**', `\`${moment.utc(member.joinedAt).format("ddd DD MMM YYYY, H:mm:ss")}\`⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪⁪`, true)
            .addField('**➢  Roles**', `${role}`, false)
            .addField('**➢  Permissions**', `${permissions}`, false)

        message.channel.send(embedDEV)
    }
}