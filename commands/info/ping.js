module.exports = {
    name: "ping",
    remind: "Hooks such as [] or <> are not to be used when using commands.",
    description: "Show bot ping.",
    category: "info",
    usage: "ping",
    cooldown: 3,
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);
        msg.edit(`🏓 Pong **(${Math.round(client.ws.ping)}ms)**`);
    }
}