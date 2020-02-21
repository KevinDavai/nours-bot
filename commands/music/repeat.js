const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")


module.exports = {
    name: "repeat",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Repeats the audio again and again",
    category: "music",
    aliases: ["loop"],
        run: async (client, message, args) => {

            const player = client.music.players.get(message.guild.id);
            if(!player) return message.channel.send("No song/s currently playing");
            let previousState = player.trackRepeat;
            
            player.setTrackRepeat(!previousState);
            if(!previousState){  // means trackRepeat is not true ie false
                message.channel.send('Repeat Mode ON!!')
            }else{
            message.channel.send('Repeat Mode OFF!!')
        }
    }
}