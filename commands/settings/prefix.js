const Prefix = require('../../models/prefix.js');

module.exports = {
    name: "prefix",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Show or change bot prefix.",
    aliases: ["prfx"],
    category: "settings",
    usage: "prefix [new prefix]",
    //usage: `${pre.prefix}prefix [new prefix]`,
    //aliases: [`${pre.prefix}prfx`],
    run: async (client, message, args) => {

        Prefix.findOne({ guildID: message.guild.id }, (err, pre) => {
            let newPrefix = args[0]

            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.reply("❌ You do not have permissions to do this! Please contact a staff member.")
            }

            if (!args[0]) {
                return message.reply(`Current guild prefix is : \`${pre.prefix}\``)
            }

            if (args[0] === pre.prefix) {
                return message.reply("❌ It's already this prefix.")
            }

            if (newPrefix.length >= 5) {
                return message.reply("❌ There are more than 5 characters.")
            }
         
            pre.prefix = newPrefix;
            pre.save().catch(err => console.log(err));    

           message.channel.send(`👍 ** Prefix set to  \`${newPrefix}\`**`);   
        })
    }
};



