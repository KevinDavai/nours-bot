const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");

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


client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

["command", "event"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

client.login(process.env.TOKEN);
