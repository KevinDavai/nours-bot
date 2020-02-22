const mongoose = require("mongoose");

const prefixSchema = mongoose.Schema({
    guildID: String,
    prefix: { type: String, default: "_" }
});

module.exports = mongoose.model("Prefix", prefixSchema);