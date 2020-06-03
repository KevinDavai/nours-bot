const Disccord = require("discord.js");
module.exports = {
    name: "pause",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Makes the bot pause/resume the music currently playing.",
    category: "music",
    aliases: ["resume"],
    run: async (client, message, args) => {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if (!player) return message.channel.send("No song/s currently playing in this guild.");
        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
        if(!voiceChannel) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");

        player.pause(player.playing);
        const pauseembed = new Disccord.MessageEmbed()
        .setDescription(`${player.playing ? "▶️" : "⏸"}   Music is now **${player.playing ? "resumed" : "paused"}**.`)
    
        return message.channel.send(pauseembed)
    }
}