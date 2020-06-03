module.exports = {
    name: "skip",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Skips the song currently playing.",
    category: "music",
    aliases: ["next"],
    run: async (client, message, args) => {

        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!player) return message.channel.send("No song/s currently playing in this guild.");

        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
        if(!voiceChannel) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");

        player.stop();
    

        return message.channel.send("Skipped the current song!");
    }
}