const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = require("./models/user");
const User = mongoose.model("User", UserSchema);

passport.use(
	new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		User.findOne({ email: email }).then((user) => {
			if (!user) {
				console.log("not reg");
				return done(null, false, { message: "username does not exist!" });
			}
			try {
				if (bcrypt.compare(password, user.pwd)) {
					console.log("login");
					return done(null, user);
				} else {
					console.log("wrong");
					return done(null, false, { message: "password is incorrect!" });
				}
			} catch (e) {
				return done(e);
			}
		});
	})
);

passport.serializeUser(function (user, done) {
	console.log(123123);
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, done);
});

// const LocalStrategy = require("passport-local").Strategy;
