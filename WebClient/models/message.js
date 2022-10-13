// schema is the set of rules
const mongoose = require("mongoose"),
    messageSchedma = mongoose.Schema({
        id: Number,
        message: String
    });

module.exports = mongoose.model("Message",
    messageSchedma);
