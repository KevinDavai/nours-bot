module.exports = {
    name: "queue",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "dgfqs",
    category: "music",
    aliases: ["q"],
        run: async (client, message, args) => {
 
 const { voiceChannel  } = message.member;
    const player = this.client.music.players.get(message.guild.id);
    if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.");
    const { title, author, duration, thumbnail } = player.queue[0];

    
    if(voiceChannel && voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in a voice channel to use the leave command.");
    if(!player) return message.channel.send("No song/s currently playing in this guild.");

    const moment = require('moment');
    var timeend = moment();
    const ms = require('ms')
    const { Utils } = require("erela.js")
    const titleArray = [];
    player.queue.map(obj => {
      titleArray.push(obj);
    });
    var queueEmbed = new MessageEmbed()
      .setColor(1752220)
      .setTitle('Music Queue');
    for (let i = 0; i < titleArray.length; i++) {
      if (i < 1){
        queueEmbed.addField(`Now Playing:`, `${titleArray[i].title} \n Duration: \`${Utils.formatTime(titleArray[0].duration , true)}\` \n Requested By: ${titleArray[i].requester}`)
      }
      else if (i > 10){
        break
      }
      else{
        queueEmbed.addField(`${i}:`, `${titleArray[i].title} \n Duration: \`${Utils.formatTime(titleArray[0].duration , true)}\` \n Requested By: ${titleArray[i].requester}`)
      }
    }
    return message.say(queueEmbed)
    }
}