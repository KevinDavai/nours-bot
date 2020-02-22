const { Client, RichEmbed, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const Prefix = require('./models/prefix.js');
const { stripIndents } = require("common-tags");
const { ErelaClient, Utils } = require("erela.js");
const { nodes } = require("./private/botconfig.json");

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

["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

const cooldowns = new Map();
 let timeout

client.on("ready", () => {
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
            textChannel.send(embednp)
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
});

client.on("guildCreate", guild1 => {
    const id = guild1.id
    Prefix.findOne({
        guildID: id
    }, (err, guild) => {
        if (err) console.error(err);

        if (!guild) {
            const newConfig = new Prefix({
                guildID: id
            });

            newConfig.save();
            guild = { guildID: id, prefix: '_' }
        }

        const dmOwnerEmbed = new RichEmbed()
        .setDescription("**Hi, thanks for adding me to your server !**\n** **")
        .setAuthor((client.user.username), (client.user.displayAvatarURL))
        .setColor("ORANGE")

        .addField('Prefix', stripIndents`Current prefix of __**${guild1.name}**__ is \`${guild.prefix}\`
        To execute commands, first write the prefix and then the command, example :
        \`${guild.prefix}whois\``, false)

        .addField('Details of a command', stripIndents`Use \`${guild.prefix}help <command>\` for more information about a command.
        **Example :** \`${guild.prefix}help prefix\` `, false)

        .addField('Useful link', stripIndents`**Support server :** *soon*`, false)

       guild1.owner.send(dmOwnerEmbed)

    });
});

client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
  


    Prefix.findOne({
             guildID: message.guild.id
       }, (err, guild) => {
           if (err) console.error(err);

           if (!guild) {
            const newConfig = new Prefix({
                guildID: message.guild.id
            });

            newConfig.save();
            guild = { guildID: message.guild.id, prefix: '_' }
        }
           
         let prefix = guild.prefix;

        if (!message.content.startsWith(prefix)) return;
        if (!message.member) message.member = message.guild.fetchMember(message);

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return;

        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));

        if (!command) {
           return
        }


        if (command.ownerOnly && message.author.id !== "644117619514802177") {
             return message.reply("only the owner can use this command")
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Map());
        }
        
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown) * 1000;
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = Math.ceil((expirationTime - now) / 1000);
                return message.reply(`please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

         command.run(client, message, args);
    })      
});

client.login(process.env.TOKEN);
