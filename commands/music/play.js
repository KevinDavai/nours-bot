const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")


module.exports = {
    name: "play",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Play a song/playlist or search for a song from youtube.",
    category: "music",
    aliases: ["p", "pplay"],
        run: async (client, message, args) => {

            function emoji (id) {
                return client.emojis.get(id).toString();
            }


            const { voiceChannel } = message.member;
            if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music.");
            
    
            const permissions = voiceChannel.permissionsFor(client.user);
            if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!");
            if (!permissions.has("SPEAK")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!");
    
            if (!args[0]) return message.channel.send("Please provide a song name or link to search.");
    
            const player = client.music.players.spawn({
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel
            });

            if (voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in the same voice channel of the bot to play music.");
    
            
            client.music.search(args.join(" "), message.author).then(async res => {
                switch (res.loadType) {
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        const queueAdd = new RichEmbed()
                        .setDescription(`🎶 Queued \`${res.tracks[0].title}\` \[` + (message.author) + `\]`)
                        message.channel.send(queueAdd).then(m => m.delete(15000));
                        if (!player.playing) player.play()
                        break;
                    
                    case "SEARCH_RESULT":
                        let index = 1;
                        const tracks = res.tracks.slice(0, 5);
                        message.channel.send((emoji("667774816396378138")) + `**  Searching**  🔎  ` + "\`" + (args.join(" ")) + "\`")
                        const embed = new RichEmbed()
                            .setAuthor("Song Selection.", message.author.displayAvatarURL)
                            .setDescription(tracks.map(video => `**${index++} -** ${video.title}`))
                            .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");
    
                        await message.channel.send(embed);
    
                        const collector = message.channel.createMessageCollector(m => {
                            
                            return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                        }, { time: 30000, max: 1});
    
                        collector.on("collect", m => {
                            if (/cancel/i.test(m.content)) return collector.stop("cancelled")

                            if (!player.queue.empty) {
                                const queueAdd = new RichEmbed()
                            .setDescription(`🎶 Queued \`${res.tracks[0].title}\` \[` + (message.author) + `\]`)
                            message.channel.send(queueAdd).then(m => m.delete(15000));
                            }
    
                            const track = tracks[Number(m.content) - 1];
                            player.queue.add(track)
                        
                            if(!player.playing) player.play();
                        });
    
                        collector.on("end", (_, reason) => {
                            if(["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.")
                        });
                        break;
    
                    case "PLAYLIST_LOADED":
                        res.playlist.tracks.forEach(track => player.queue.add(track));
                        const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({duration: acc.duration + cur.duration})).duration, true);
                        message.channel.send(`Enqueuing \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``);
                        if(!player.playing) player.play()
                        break;
                }
                
            }).catch(err => message.channel.send(err.message))

            
        }
}