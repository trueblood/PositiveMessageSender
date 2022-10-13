const User = require('../models/user'),
    messageController = require('../controllers/messageController');

exports.login = (req, res) => {
    res.render("users/login");
}

exports.showCreate = (req, res) => {
    res.render("users/create");
}

exports.create = (req, res, next) => {
    if (req.skip) return next();

    let newUser = new User({
        username: req.body.username,
        email: req.body.email
    });

    User.register(newUser, req.body.password, (error, user) => {
        if (user) {
            req.flash("success", `${newUser.username}'s account created
 successfully!`);
            messageController.sendSignUpMessage(newUser.email);
            res.redirect('login');
            next();
        } else {
            req.flash("error", `Failed to create user account because:
 ${error.message}.`);
            res.redirect('create');
            next();
        }
    });

}