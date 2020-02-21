module.exports = {
    name: "volume",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Change the volume of the music.",
    category: "music",
    run: async (client, message, args) => {

        const player = client.music.players.get(message.guild.id);


        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.reply("❌ You do not have permissions to do this! Please contact a staff member.")
        }

        if(!message.guild.me.voiceChannel) return message.channel.send("I'm not in a voice channel");
        if(!player) return message.channel.send("No song/s currently playing in this guild.");
        if(!args[0]) return message.channel.send(`Current Volume: ${player.volume}`);
        if(Number(args[0]) <= 0 || Number(args[0]) > 100) return message.channel.send("You may only set the volume 1-100");

        player.setVolume(Number(args[0]));
        return message.channel.send(`Successfuly set the volume to: ${args[0]}.`)

    }
}