const Prefix = require('../../models/prefix.js');
const Discord = require("discord.js")
const { stripIndents } = require("common-tags");

module.exports = async (client, guild1) => {

    const id = guild1.id
    Prefix.findOne({
        guildID: id
    }, (err, guild) => {
        if (err) console.error(err);

        if (!guild) {
            const newConfig = new Prefix({
                guildID: id
            });

            newConfig.save();
            guild = { guildID: id, prefix: '_' }
        }

        const dmOwnerEmbed = new Discord.MessageEmbed()
        .setDescription("**Hi, thanks for adding me to your server !**\n** **")
        .setAuthor((client.user.username), (client.user.displayAvatarURL()))
        .setColor("ORANGE")

        .addField('Prefix', stripIndents`Current prefix of __**${guild1.name}**__ is \`${guild.prefix}\`
        To execute commands, first write the prefix and then the command, example :
        \`${guild.prefix}whois\``, false)

        .addField('Details of a command', stripIndents`Use \`${guild.prefix}help <command>\` for more information about a command.
        **Example :** \`${guild.prefix}help prefix\` `, false)

        .addField('Useful link', stripIndents`**Support server :** *soon*`, false)

       guild1.owner.send(dmOwnerEmbed)

    })
}