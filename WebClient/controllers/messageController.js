const Message = require("../models/message");
const SentMessage = require("../models/sentmessage");

exports.showSendMessage = (req, res) => {
    res.render("sendmessage");
};

exports.saveSendMessage = (req, res) => {
    let newMessage = new SentMessage({
        name: req.body.name,
        from: req.body.from,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        message: req.body.message,
        date: req.body.curDate,
        username: req.body.username
    });

    newMessage.save()
        .then(() => {
            res.render("thanks", { name: newMessage.name, from: newMessage.from });
        })
        .catch(error => {
            res.send(error);
            console.log(error);
        });
    this.sendMessage(newMessage.email, newMessage.message, newMessage.phoneNumber);
};

exports.showSentMessages = (req, res) => {
    SentMessage.find({})
        .exec()
        .then((sentmessages) => {
            res.render("sentmessages", {
                sentmessages: sentmessages
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.showUserSentMessages = (req, res) => {
    SentMessage.find({ username: req.user})
        .exec()
        .then((sentmessages) => {
            res.render("sentmessages", {
                sentmessages: sentmessages
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};


exports.sendMessage = async function sendMessage(sendToEmail, message, phoneNumber) {
    // Dependencies to install:
    // $ npm install node-fetch --save

    const fetch = require('node-fetch');

    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: ''
        },
        body: JSON.stringify({
            "message": {
                "content": {
                    "title": "Positive Message For You",
                    "body": message
                },
                "to": {
                    "email": sendToEmail,
                    "phone_number": phoneNumber
                },
                "routing": {
                    "method": "all",
                    "channels": ["sms", "email"]
                },
            }
        })
    };

    fetch('https://api.courier.com/send', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

exports.sendSignUpMessage = async function sendSignUpMessage(sendToEmail) {
    // Dependencies to install:
    // $ npm install node-fetch --save

    const fetch = require('node-fetch');

    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: ''
        },
        body: JSON.stringify({
            "message": {
                "template": "Y9142EXJEG4GC0HK5DME85PAX19Y",
                "to": {
                    "email": sendToEmail,
                    "phone_number": ""
                }
            }
        })
    };

    fetch('https://api.courier.com/send', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

exports.sendLoginMessage = async function sendLoginMessage(sendToEmail) {
    // Dependencies to install:
    // $ npm install node-fetch --save

    const fetch = require('node-fetch');

    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: ''
        },
        body: JSON.stringify({
            "message": {
                "template": "DT3FDDFGBJ4TSTG9VX6P33DZE2VH",
                "to": {
                    "email": sendToEmail,
                    "phone_number": ""
                }
            }
        })
    };

    fetch('https://api.courier.com/send', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}