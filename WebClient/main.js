const express = require("express"),
    app = express();
const flash = require('connect-flash');


app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(app.get("port"), () => {
    console.log(
        `Server running at http://localhost:${app.get(
            "port"
        )}`
    );
});

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(express.static("public"));
const 
	bodyParser = require('body-parser'), // parser middleware
	session = require('express-session'),  // session middleware
	passport = require('passport'),  // authentication
	connectEnsureLogin = require('connect-ensure-login');// authorization

const User = require('./models/user.js'); // User Model

// Configure Sessions Middleware
app.use(session({
	secret: '',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req, res, next) => {
	res.locals.flashMessages = req.flash();
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	res.render("dashboard");
});

app.get('/sendmessage', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
	res.render("sendmessage");
});

// Route to Log out
app.get('/logout', function (req, res, next) {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/index');
	});
});

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController")
const messageController = require("./controllers/messageController");
const userController = require("./controllers/userController");

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/index' }), function (req, res) {
	console.log(req.user)
	messageController.sendLoginMessage(req.user.email);
	res.redirect('sendmessage');
});

//app.get("/sendmessage", messageController.showSendMessage);
app.get("/sentmessages", messageController.showSentMessages);
app.post("/sendmessage", messageController.saveSendMessage);

app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.get("/index", homeController.showIndex);
app.get("/about", homeController.showAbout);
app.post("/contact", homeController.postedSignUpForm);

app.get("/thanks", homeController.postedSignUpForm);

app.get("/login", userController.login);
app.get("/create", userController.showCreate);
app.post("/create", userController.create);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

const layouts = require("express-ejs-layouts");
app.set("view engine", "ejs");
app.use(layouts);

const uri = "";
const mongoose = require("mongoose");
mongoose.connect(
    uri,
    { useNewUrlParser: true }
);

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

mongoose.Promise = global.Promise;

const methodOverride = require("method-override");
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

