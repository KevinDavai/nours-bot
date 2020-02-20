module.exports = {
    name: "ping",
    category: "info",
    description: "Renvoie la latence et le ping de l'API",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);

        msg.edit(`🏓 Pong\nLa latence est de ${Math.floor(msg.createdAt - message.createdAt)}\nAPI Latency ${Math.round(client.ping)}ms`);
    }
}