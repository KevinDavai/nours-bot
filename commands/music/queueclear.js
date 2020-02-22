const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")


module.exports = {
    name: "queueclear",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Clear the current queue.",
    category: "music",
    aliases: ["queuedelete", "qclear", "qdelete"],
        run: async (client, message, args) => {

            const player = client.music.players.get(message.guild.id);
            
            if(!player) return message.channel.send("No song/s currently playing");

            const { voiceChannel } = message.member;
    
            if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
            if(!voiceChannel) return message.channel.send("You need to be in the same channel of the bot to use the leave command.");
            
            if (!args[0]) {
            player.queue.clear()
            return message.channel.send("Queue clear");
            }

            const toRemove = message.guild.members.get(args[0]);
            if(isNaN(args[0])) {
                return message.channel.send(`${args[0]} is not a number.`)
            } else {
                if (args[1] === toRemove) {
                
                    player.queue.removeFrom(Number(args[0]),(Number(args[0]) + 0.1))
                    return message.channel.send(`${args[0]} was delete from the queue`)
                }
            }
        }
}