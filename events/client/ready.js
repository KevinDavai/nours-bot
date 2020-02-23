const { ErelaClient, Utils } = require("erela.js");
const { nodes } = require("../../private/botconfig.json");
let timeout

module.exports = async client => {
    console.log(`Connexion de ${client.user.username}... ==> OK.`);
    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => (console.log("Successfully created a new Node.")))
        .on("queueEnd", player => {
            const embedtime = new RichEmbed()
            .setDescription("I left the voice channel because I was inactive for too long.")
            timeout = setTimeout(() => {
                
                client.music.players.destroy(player.guild.id)
                player.textChannel.send(embedtime)
            }, 300000);
            
        })
        .on("trackStart", (player, {title, duration}) => {
            const textChannel = player.textChannel;
            player.setVolume(50)
            const embednp = new RichEmbed()
            .setTitle("🎶 Now playing")
            .setDescription(`\`${title}\`  \`${Utils.formatTime(duration, true)}\``)
            textChannel.send(embednp).then(m => m.delete(10000));
            if (timeout) {
                clearTimeout(timeout)
            }
        })


    client.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 015)
        .set("high", 0.25);
         
    client.user.setPresence({
        status: "online",
        game: {
            name: "The Empire of Nour's",
            type: "WATCHING"
        }
    });
}