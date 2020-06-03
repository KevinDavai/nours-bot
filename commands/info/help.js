const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const Prefix = require('../../models/prefix.js');

module.exports = {
    name: "help",
    aliases: ["h"],   
    category: "info",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
      Prefix.findOne({ guildID: message.guild.id }, (err, guild) => {

        // If there's an args found
        // Send the info of that command found
        // If no info found, return not found embed.
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            // Otherwise send all the commands available
            // Without the cmd info
            return getAll(client, message);
        }


        
        function getAll(client, message) {
          const embed = new Discord.MessageEmbed()
              .setColor("ORANGE");
      
      
      const commands = client.commands.filter(c => !c.ownerOnly).reduce((acc, val) => {
        const idx = acc.findIndex(cmd => cmd.category === val.category);
      
        idx > -1
          ? acc[idx].commands.push(val)
          : acc.push({ category: val.category, commands: [val] });
      
        return acc;
      }, []);
      


      commands.forEach(command => {
          embed.addField(`${command.category} (${command.commands.length})`,
            command.commands.map(cmd => `\`${cmd.name}\``).join(", ")
          )
        })
      
          return message.author.send(embed)
          .then(() => message.reply("DM has been sent"))
          .catch(() => message.reply("I was not able to send you a DM"))
      }
      
      function getCMD(client, message, input) {
          const embed = new Discord.MessageEmbed()
          .setFooter('Nour\'s bot ©️', (client.user.displayAvatarURL()))
          .setTimestamp()  

      
          // Get the cmd by the name or alias
          const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
          
          let info = `No information found for command **${input.toLowerCase()}**`;
          let NameCmdTitle = ` `;
          let usageField = ` `;
          let description = ` `;
          let aliasesField = ` `;
          let cooldownField = ` `;
      

          if (cmd.ownerOnly) {
            return message.channel.send(embed.setColor("RED").setDescription(info));
          }
          // If no cmd is found, send not found embed
          if (!cmd) {
              return message.channel.send(embed.setColor("RED").setDescription(info));
          }
          if (cmd) {
            embed.setColor("ORANGE");
          }
      
          // Add all cmd info to the embed
          if (cmd.name) NameCmdTitle = `**Command :** ${cmd.name}`;
          if (cmd.description) description += `\n**Description :** ${cmd.description}`;
          if (cmd.remind) description += `\n**Remind :** ${cmd.remind}`;
          if (cmd.aliases) aliasesField += `\`${guild.prefix}${cmd.aliases.map(a => `${a}\``).join(", ")}`;
          if (cmd.usage) usageField += `\`${guild.prefix}${cmd.usage}\``;
          if (cmd.usage1) usageField += `\n\`${guild.prefix}${cmd.usage1}\``;
          if (cmd.cooldown) cooldownField += `${cmd.cooldown} seconds`

          if (cmd.name) {
            embed.setTitle(NameCmdTitle)
          }
          if (cmd.description) {
            embed.setDescription(description)
          }
          if (cmd.remind) {
            embed.setDescription(description)
          }
          if (cmd.usage) {
            embed.addField('Usage', (usageField), false)
          }
          if (cmd.aliases) {
            embed.addField('Aliases', (aliasesField), false)
          }
          if (cmd.cooldown) {
            embed.addField('Cooldown', (cooldownField), false)
          }
      
          return message.channel.send(embed);
      }
    })
  }
}


