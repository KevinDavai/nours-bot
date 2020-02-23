const { Client, RichEmbed, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");

config({
    path: "./private/.env"
});

mongoose.connect(`mongodb://${process.env.DB_ADRESSE}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) =>{
    if (err) return console.error(err);
    console.log('Connexion a MongoDB... ==> OK.');
});

const client = new Client({
    disableEveryone: true
});

const Tenor = require("tenorjs").client({
    "Key": `${process.env.TENORKEY}`, // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});


client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command", "event"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});





/*client.on("voiceStateUpdate", (oldMember, GuildMember, player) => {
    const voiceConnection = GuildMember.guild.voiceConnection;
    const ChannelBot = client.voiceChannelID
    if(voiceConnection !== null && voiceConnection.channel.members.filter(m => !m.user.bot).size < 1) {
      console.log("test")
    } else {
      console.log("test2")
      client.music.players.destroy(player.guild.id)
    }
  })
*/



client.login(process.env.TOKEN);
