
exports.showCourses = (req, res) => {
    res.render("courses", {
        offeredCourses: courses
    });
};
exports.showSignUp = (req, res) => {
    res.render("contact");
};
exports.postedSignUpForm = (req, res) => {
    res.render("thanks");
};
exports.showIndex = (req, res) => {
    res.render("index");
};
exports.showAbout = (req, res) => {
    res.render("about");
};

