const { Utils } = require("erela.js")
const Discord = require("discord.js")

module.exports = {
    name: "queue",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Show list of music in the queue.",
    category: "music",
    aliases: ["q"],
        run: async (client, message, args) => {
 
            const player = client.music.players.get(message.guild.id);
            if (!player || !player.queue[0]) return message.channel.send({embed :{
                description: "No song/s currently playing in this guild.",
                color: "0xFFFFFF"
                
            }}).catch(err => message.channel.send(err.message))
            const { title, requester, uri} = player.queue[0];
    
            let queue = player.queue
            
            if(player.queue.length < 1) return message.channel.send(`**:x: Nothing playing in this server**`);
            
            if(!player.queue[1]) return message.channel.send('', {embed: {
            description: `🎧 Now Playing:\n[${title}](${uri}) [<@${requester.id}>]`,
            author: {
            name: `${message.guild.name}'s Queue.`,
            icon_url: message.guild.iconURL
            },
            color: 0xFFFFFF
            }});
            else {
                let x;
                if(args > 1) {
                 x = Math.floor(args)*10+1
                } else {
                  x = Math.floor(11)
                }
                let i;
                if(args > 1) {
                    i = x-11
                   } else {
                     i = 0
                   }
                let queuelist = player.queue.slice(x-10,x).map(song => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n')
                if(!queuelist) return message.channel.send(`<:megX:476797393283710991> | Page doesn't exist!`)
                const embed = new Discord.MessageEmbed()
                embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`)
                embed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/7/73/YouTube_Music.png")
                embed.setAuthor(`${message.guild.name}'s Queue (${Math.floor(x/10)} / ${Math.floor((player.queue.slice(1).length+10) /10)})`)
                embed.setFooter(`Total items in queue: ${player.queue.length}`)
                embed.setColor("red");
                message.channel.send(embed).then(async msg => {
                    if(Math.floor((player.queue.slice(1).length+10) /10) > 1) {
                        await msg.react("⏪")
                        await msg.react("◀")
                        await msg.react("🟣")
                        await msg.react("▶")
                        await msg.react("⏩")
                        const pages = Math.floor((player.queue.slice(1).length+10) /10)
                        let page = Math.floor(x/10)
                        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "◀" && user.id === message.author.id, {time: 60000})
                        const doubleback = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "⏪" && user.id === message.author.id, {time: 60000})
                        const doubleforwad = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "⏩" && user.id === message.author.id, {time: 60000})
                        const forwad = msg.createReactionCollector((reaction, user) => reaction.emoji.name === "▶" && user.id === message.author.id, {time: 60000})
                        back.on('collect', async r => {
                            if(page === 1) return;
                            //await r.remove(message.author);
                            await page--
                            x = Math.floor(page)*10+1
                            i = x-11
                            queuelist = player.queue.slice(x-10,x).map(song => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n')
                            embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`)
                            embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`)
                            msg.edit(embed)
                        })
                        forwad.on('collect', async r => {
                            if(page === pages) return;
                           // await r.remove(message.author);
                            await page++
                            x = Math.floor(page)*10+1
                            i = x-11
                            queuelist = player.queue.slice(x-10,x).map(song => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n')
                            embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`)
                            embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`)
                            msg.edit(embed)
                        })
                        doubleback.on('collect', async r => {
                            if(page === 1) return;
                           // await r.remove(message.author);
                            page = 1
                            x = Math.floor(page)*10+1
                            i = x-11
                            queuelist = player.queue.slice(x-10,x).map(song => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n')
                            embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`)
                            embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`)
                            msg.edit(embed)
                        })
                        doubleforwad.on('collect', async r => {
                            if(page === pages) return;
                            //await r.remove(message.author);
                            page = pages
                            x = Math.floor(page)*10+1
                            i = x-11
                            queuelist = player.queue.slice(x-10,x).map(song => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n')
                            embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`)
                            embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`)
                            msg.edit(embed)
                        })
                    } else return;
                }) 
            }
        }
    }
