const mongoose = require("mongoose");

const prefixSchema = mongoose.Schema({
    guildID: String,
    prefix: String,
});

module.exports = mongoose.model("Prefix", prefixSchema);