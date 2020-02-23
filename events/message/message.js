const cooldowns = new Map();
const Prefix = require('../../models/prefix.js');
module.exports = async (client, message) => {

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
}



