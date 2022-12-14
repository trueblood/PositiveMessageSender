// required
const express = require("express"),
    app = express(),
	dotenv = require("dotenv"),
	ejs = require("ejs")
const flash = require('connect-flash');

// initiate dotenv to load environment variables
dotenv.config();
// set the port number
app.set("port", process.env.PORT || 3000);

// get the index page at /
app.get("/", (req, res) => {
    res.render("index");
});

// display a message to user in the terminal window on what port the application is running on
app.listen(app.get("port"), () => {
    console.log(
        `Server running at http://localhost:${app.get(
            "port"
        )}`
    );
});

// The express.urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser
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
	secret: `${process.env.SECRET}`,
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

	// send message page, ensure that user is logged in
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

	// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/index' }), function (req, res) {
	console.log(req.user)
	messageController.sendLoginMessage(req.user.email);
	res.redirect('sendmessage');
});

// define my controllers here
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController")
const messageController = require("./controllers/messageController");
const userController = require("./controllers/userController");

app.get("/sentmessages", messageController.showSentMessages);
app.post("/sendmessage", messageController.saveSendMessage);
app.get("/index", homeController.showIndex);
app.get("/about", homeController.showAbout);
app.get("/thanks", homeController.postedSignUpForm);
app.get("/login", userController.login);
app.get("/create", userController.showCreate);
app.post("/create", userController.create);
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// define view engine here
const layouts = require("express-ejs-layouts");
app.set("view engine", "ejs");
app.use(layouts);


// here we setup our database connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clusterzone.qvfg7gm.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
mongoose.connect(
    uri,
    { useNewUrlParser: true }
);

// show the user i'm connected to the mongodb in the terminal window
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

mongoose.Promise = global.Promise;

const methodOverride = require("method-override");
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

