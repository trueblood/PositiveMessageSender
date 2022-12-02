// schema is the set of rules
const mongoose = require("mongoose"),
    sentMessageSchema = mongoose.Schema({
        name: String,
        from: String,
        email: String,
        phoneNumber: Number,
        message: String,
        date: String,
        username: String
    });

module.exports = mongoose.model("SentMessage",
    sentMessageSchema);


