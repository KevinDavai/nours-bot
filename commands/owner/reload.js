const { RichEmbed } = require("discord.js")
const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = {
    name: "reload",
    ownerOnly: true,
    run: async (client, message, args) => {

        if (!args[0]) return message.channel.send("Please provide a command to reload!");

        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

        if (!command) return message.channel.send("That command doesn't exist. Try again.");


        readdirSync(join(__dirname, "..")).forEach(f => {
            const files = readdirSync(join(__dirname, "..", f));

            if (files.includes(`${commandName}.js`)) {

                const file = `../${f}/${commandName}.js`;
                
                try {
                    delete require.cache[require.resolve(file)];
                    client.commands.delete(commandName);
                    const pull = require(file);
                    client.commands.set(commandName, pull);
                    return message.channel.send(`Successfully reloaded ${commandName}.js!`);
                }
                catch (err) {
                    message.channel.send(`Could not reload: ${args[0].toUpperCase()}\``);
                    return console.log(err.stack || err);
                }
            }
        });
    }
};