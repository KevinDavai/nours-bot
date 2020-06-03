const { Utils } = require("erela.js")
module.exports = {
    name: "shuffle",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Shuffle the queue",
    category: "music",
    aliases: ["shfl"],
    run: async (client, message, args) => {

        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!player) return message.channel.send("No song/s currently playing in this guild.");
        if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same channel of the bot to use the shuffle command.");
        if(!voiceChannel) return message.channel.send("You need to be in the same channel of the bot to use the shuffle command.");

        player.queue.shuffle() 
    

        return message.channel.send("Shuffle the queue!");
    }
}