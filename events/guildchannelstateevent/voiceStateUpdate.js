
const { RichEmbed } = require("discord.js")



module.exports = async (client, GuildMember, message) => {
       const player = client.music.players.get(message.guild.id);

        if (!GuildMember.guild.me.voiceChannel) { // Check if bot is in a channel if not return
            return
        }
    
        const NumberChannel = GuildMember.guild.me.voiceChannel.members.size
        let timeout
        const embedtime = new RichEmbed()
        .setDescription("I left the voice channel because I was alone for too long.")
    
        if (NumberChannel < 2) { // If bot is alone
            timeout = setTimeout(() => {
                    if (GuildMember.guild.me.voiceChannel.members.size < 2) {
                        player.textChannel.send(embedtime).then(m => m.delete(10000))
                        client.music.players.destroy(player.guild.id)
                    }
            }, 300000);
        } 
}
