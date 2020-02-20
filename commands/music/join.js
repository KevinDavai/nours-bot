module.exports = {
   name: "join",
   remind: "Hooks such as [] or <> are not to be used when using commands.",
   description: "Makes the bot leave the voice channel.",
   category: "music",
   aliases: ["connect"],
   run: async (client, message, args) => {

     // check if member is in a channel
       if (!message.member.voiceChannel) {
           return message.channel.send("You are not in a voice channel")
       }

       const { voiceChannel } = message.member;
       const player = client.music.players.get(message.guild.id);

    // Check if the bot is already in a voice channel: if not so create it
    if(!message.guild.me.voiceChannel) {
       const player = client.music.players.spawn({
           guild: message.guild,
           textChannel: message.channel,
           voiceChannel
       });
    }
    // Check if member is already in the same voice channel of the bot
    if(message.guild.me.voiceChannel && voiceChannel.id === player.voiceChannel.id) {
       return message.channel.send("Im already in your voice channel")
    }

    // check if the bot is already in a voice channel: if true so don't create it and just move him.
    if(message.guild.me.voiceChannel && voiceChannel.id !== player.voiceChannel.id) {
       client.music.players.destroy(message.guild.id)
       const player = client.music.players.spawn({
         guild: message.guild,
         textChannel: message.channel,
         voiceChannel
     });

     if (queue.player.status === 1) {
      if (message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send("your not in the same voice channel as me");
      }
    }


    }
   
   
}