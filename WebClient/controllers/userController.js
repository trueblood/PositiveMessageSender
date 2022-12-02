// required
const User = require('../models/user'),
    messageController = require('./messageController');

    // login page
exports.login = (req, res) => {
    res.render("users/login");
}

    // show users created successfully page
exports.showCreate = (req, res) => {
    res.render("users/create");
}

// method that creates a new user and saves it to the database
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