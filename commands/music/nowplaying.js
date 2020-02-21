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


        const player = client.music.players.get(message.guild.id);
        if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.");
          if (player.position > 5000){
            getnowplaying()
          }
          if (player.position < 5000){
            setTimeout(() => {
            getnowplaying()
            },3000)
          }
          
          function getnowplaying(){
          let { title, author, duration, thumbnail, requester } = player.queue[0];
          let amount = `00:${Utils.formatTime(player.position, true)}`
          const part = Math.floor((player.position / duration) * 10);
          const giveEmbed = new RichEmbed()
            .setColor("AQUA")
            .setDescription(`${player.playing ? "▶️" : "⏸️"} Currently Playing ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\nRequested By: ${requester.tag}`)

        message.channel.send({embed: giveEmbed}).then(m => {
          const counter = setInterval(() => {
            if(player.playing !== true){
              clearInterval(counter)
            }
          if(player.position>5000){
          if(player.position < 60000){
            if(player.playing === true){
            let { title, author, duration, thumbnail, requester } = player.queue[0];
            let amount = `00:${Utils.formatTime(player.position, true)}`
            const part = Math.floor((player.position / duration) * 10);
            giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} Currently Playing ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\nRequested By: ${requester.tag}`)
            }
          }else{
            if(player.playing === true){
            let { title, author, duration, thumbnail, requester } = player.queue[0];
            const amount = `${Utils.formatTime(player.position, true)}`
            const part = Math.floor((player.position / duration) * 10);
            giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} Currently Playing ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(9 - part)}[${amount} / ${Utils.formatTime(duration, true)}]\nRequested By: ${requester.tag}`)
            }
          }
        }
          m.edit(giveEmbed)
          },4000)
      })
    }
}
}