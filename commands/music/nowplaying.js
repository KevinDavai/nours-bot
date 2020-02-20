const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = {
    name: "nowplaying",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Displays what the bot is currently playing.",
    category: "music",
    aliases: ["np", "now"],
    run: async (client, message, args) => {


        const { voiceChannel } = message.member;
        const player = client.music.players.get(message.guild.id);
        if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.");

        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
        if(!voiceChannel) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
      

        const { title, author, duration, thumbnail } = player.queue[0];

        const embed = new RichEmbed()
          .setAuthor("Current Song Playing.", message.author.displayAvatarURL)
          .setThumbnail(thumbnail)
          .setDescription(stripIndents`
          ${player.playing ? "▶️" : "⏸️"} **${title}** \`${Utils.formatTime(duration, true)}\` by ${author}
          `);

        return message.channel.send(embed);
    }
}