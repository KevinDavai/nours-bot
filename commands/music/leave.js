module.exports = {
    name: "leave",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Makes the bot leave the voice channel.",
    category: "music",
    aliases: ["lev", "stop"],
    run: async (client, message, args) => {

        const { voiceChannel } = message.member;
        const player = client.music.players.get(message.guild.id);

        if(!message.guild.me.voiceChannel) return message.channel.send("I'm not in a voice channel");

        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
        if(!voiceChannel) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
 
        client.music.players.destroy(message.guild.id);
        return message.channel.send("Successfully stopped the music.")
    }
}