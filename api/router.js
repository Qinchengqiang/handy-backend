"use strict";
const Router = require("koa-router");
const mongoose = require("mongoose");
const BookingSchema = require("./models/booking");
const GoodsItemSchema = require("./models/goodsitem");
const OrderSchema = require("./models/order");
const ProSchema = require("./models/pro");
const UserSchema = require("./models/user");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const passport = require("koa-passport");
const initializePassport = require("./auth");
const User = mongoose.model("User", UserSchema);
const Pro = mongoose.model("Pro", ProSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const GoodsItem = mongoose.model("GoodsItem", GoodsItemSchema);
const Order = mongoose.model("Order", OrderSchema);

const router = new Router();

/**
 * TODO aggregate and calculate a pro's rating when user submit feedback
 * TODO finish make a booking logic
 *
 */

/** API for User Model
 * * Please add comment at the beginning of your code block
 * * Please follow the CRUD order for each section
 *
 */
// Create a User
router.post("/api/user", async (ctx) => {
	try {
		const body = ctx.request.body;
		const newUser = new User(body);

		//check if email address has already been used.
		await User.findOne({ email: body.email }).then((user) => {
			if (user) {
				//user exist
				console.log(1);
				ctx.status = 403;
				ctx.body = {
					message: "The username is already existed",
				};
				return;
			}
			// Hash password
			bcrypt.genSalt(10, (err, salt) =>
				bcrypt.hash(newUser.pwd, salt, (err, hash) => {
					if (err) throw err;
					//Set password to hash
					newUser.pwd = hash;
					console.log(newUser.pwd);
					//save user
					newUser.save();
				})
			);
			ctx.status = 201;
			ctx.body = {
				message: "new user has been created successfully",
				id: newUser.save()._id,
			};
		});
	} catch (e) {}
});

// User login
router.post("/api/login", async (ctx, next) => {
	await User.findOne({ email: ctx.request.body.email }).then((user) => {
		if (!user) {
			console.log("not reg");
			ctx.body = {
				message: "Username does not exist!",
			};
			return;
		} else {
			bcrypt.compare(ctx.request.body.pwd, user.pwd).then((compare) => {
				console.log(user.pwd);
				console.log(ctx.request.body.pwd);
				console.log(compare);
				if (compare) {
					console.log(1);

					ctx.body = {
						message: "Login successfully!",
						token: jsonwebtoken.sign(
							{
								data: user.email,
								exp: Math.floor(Date.now() / 1000) + 60 * 60,
							},
							"secret"
						),
					};
				} else {
					ctx.body = {
						message: "Password is not correct!",
					};
				}
			});
		}
	});
});

//Read
//list a given userId's basic info excluding upcoming bookings and orders
router.get("/api/user/:id", async (ctx) => {
	const { id } = ctx.params;
	const res = await User.findById(id, (err, data) => {
		if (err) {
			console.error(err);
		}
		return data;
	});
	ctx.status = 200;
	ctx.body = res;
});

/** API for Pro model
 *
 *
 */
//Create a Pro
router.post("/api/pro", async (ctx) => {
	try {
		const body = ctx.request.body;
		/* const convertedAvail = body.availability.map((item) => ({
      startDate: new Date(item.startDate),
      startSession: item.startSession,
      endDate: new Date(item.endDate),
      endSession: item.endSession,
    })); */
		const proPayload = {
			...body,
			//availability: [...convertedAvail],
		};

		console.log("request body" + JSON.stringify(proPayload));
		const newPro = new Pro(proPayload);
		const res = await newPro.save();
		ctx.status = 201;
		console.log(res);
		ctx.body = {
			message: "a new pro has been created successfully",
			id: res._id,
		};
	} catch (e) {}
});
//Read
//List a given proId's account info and availability:
router.get("/api/pro/:id", async (ctx) => {
	const { id } = ctx.params;
	await Pro.findById(id, (err, data) => {
		if (err) {
			console.error(err);
			ctx.status = 404;
		}
		ctx.status = 200;
		ctx.body = {
			message: "success",
			data,
		};
	});
});
//show all matching available pros:
router.post("/api/pro/avail", async (ctx) => {
	const {
		serviceType,
		bookingDate,
		startSession,
		endSession,
	} = ctx.request.body;
	const start = Number.parseInt(startSession, 10);
	const end = Number.parseInt(endSession, 10);
	const res = await Pro.find(
		{
			serviceType: serviceType,
			"availability.startDate": { $lte: bookingDate },
			"availability.startSession": { $lte: start },
			"availability.endDate": { $gte: bookingDate },
			"availability.endSession": { $gte: end },
		},
		{
			_id: 1,
			firstName: 1,
			serviceType: 1,
			//availability: 1,
			availability: {
				$elemMatch: {
					startDate: { $lte: bookingDate },
					startSession: { $lte: start },
					endDate: { $gte: bookingDate },
					endSession: { $gte: end },
				},
			},
		},

		(err, data) => {
			if (err) {
				console.error(err);
			}
			return data;
		}
	);
	ctx.status = 200;
	ctx.body = res;
});
//Update
//Update a pro's availability
router.put("/api/pro/:id/avail", async (ctx) => {
	const { id } = ctx.params;
	const newAvail = ctx.request.body;
	console.log(newAvail);
	const res = await Pro.findOneAndUpdate(
		{
			_id: new mongoose.Types.ObjectId(id),
		},
		{
			$set: { availability: newAvail },
		},
		(err, data) => {
			if (err) {
				console.error(err);
			}
			return data;
		}
	);
	ctx.status = 201;
	ctx.body = {
		message: "successfully updated the availability",
		data: res,
	};
});

/** API for Booking model
 *  For simplicity sake, our handy.com clone only supports same date
 * booking, meaning the user can only book a job lasts less than 29
 * time sessions
 */
//Create
//Create a new booking
router.post("/api/booking", async (ctx) => {
	try {
		const body = ctx.request.body;
		const notes = body.notes;
		const proId = new mongoose.Types.ObjectId(body.proId);
		const customerId = new mongoose.Types.ObjectId(body.customerId);
		const serviceType = body.serviceType;
		const bookingDate = body.bookingDate;
		const start = body.startSession;
		const end = body.endSession;

		//step 1: validate request against availability in db
		const validateRes = await Pro.find(
			{
				_id: proId,
				//serviceType: serviceType,
				"availability.startDate": { $lte: bookingDate },
				"availability.startSession": { $lte: start },
				"availability.endDate": { $gte: bookingDate },
				"availability.endSession": { $gte: end },
			},
			{
				availability: {
					$elemMatch: {
						startDate: { $lte: bookingDate },
						startSession: { $lte: start },
						endDate: { $gte: bookingDate },
						endSession: { $gte: end },
					},
				},
			},
			(err, doc) => {
				if (err) {
					console.error(err);
				}
				return doc;
			}
		);
		//console.log(`validate Res==${validateRes}`);

		if (validateRes.length == 0) {
			throw "error when retrieving matched availability's objectId";
		}
		//step 2: update corresponding pro's availability
		const {
			_id: oldId,
			startDate: oldStartDate,
			startSession: oldStartSession,
			endDate: oldEndDate,
			endSession: oldEndSession,
		} = validateRes[0].availability[0];

		const deleteAvailRes = await Pro.findOneAndUpdate(
			{
				_id: proId,
			},
			{
				$pull: {
					availability: {
						_id: oldId,
					},
				},
			},
			(err, data) => {
				if (err) {
					throw err;
				}
				return data;
			}
		);
		//console.log(deleteAvailRes);
		console.log("successfully pulled the old availability");
		//step 2a: constructing two new availabilities docs:
		const newAvailHead = {
			startDate: oldStartDate,
			startSession: oldStartSession,
			endDate: new Date(bookingDate),
			endSession: start - 1, //haven't consider 0
		};
		const newAvailTail = {
			startDate: new Date(bookingDate),
			startSession: end + 1, //haven't consider 30
			endDate: oldEndDate,
			endSession: oldEndSession,
		};

		let availPayload = [];
		//step 2b: handel three exceptions:

		/* let headStartDate = new Date(newAvailHead.startDate);
    let headEndDate = new Date(newAvailHead.endDate);
    let tailStartDate = new Date(newAvailTail.startDate);
    let tailEndDate = new Date(newAvailTail.endDate); */
		if (
			newAvailHead.startDate.valueOf() == newAvailHead.endDate.valueOf() &&
			newAvailHead.startSession == newAvailHead.endSession &&
			newAvailTail.startDate.valueOf() == newAvailTail.endDate.valueOf() &&
			newAvailTail.startSession == newAvailTail.endSession
		) {
			availPayload = [];
		} else if (
			newAvailHead.startDate.valueOf() == newAvailHead.endDate.valueOf() &&
			newAvailHead.startSession == newAvailHead.endSession &&
			(newAvailTail.startDate.valueOf() != newAvailTail.endDate.valueOf() ||
				newAvailTail.startSession != newAvailTail.endSession)
		) {
			availPayload = [newAvailTail];
		} else if (
			(newAvailHead.startDate.valueOf() != newAvailHead.endDate.valueOf() ||
				newAvailHead.startSession != newAvailHead.endSession) &&
			newAvailTail.startDate.valueOf() == newAvailTail.endDate.valueOf() &&
			newAvailTail.startSession == newAvailTail.endSession
		) {
			availPayload = [newAvailHead];
		} else {
			availPayload = [newAvailHead, newAvailTail];
		}
		console.log(availPayload);
		//step 3, push availPayload to db
		const updateAvailRes = await Pro.findOneAndUpdate(
			{
				_id: proId,
			},
			{
				$addToSet: { availability: availPayload },
			},
			(err, data) => {
				if (err) {
					throw err;
				}
				return data;
			}
		);
		console.log(`update Avail completed`);

		const bookingPayload = {
			notes,
			customerId,
			proId,
			bookingDate,
			startSession: start,
			endSession: end,
		};
		const newBooking = new Booking(bookingPayload);
		const res = await newBooking.save();
		await User.findOneAndUpdate(
			{
				_id: customerId,
			},
			{ $push: { bookings: res._id } }
		);
		await Pro.findOneAndUpdate(
			{
				_id: proId,
			},
			{ $push: { bookings: res._id } }
		);

		ctx.status = 201;
		ctx.body = {
			message: "a booking has been created successfully",
			id: res._id,
		};
	} catch (e) {
		console.error(e);
	}
});
//Read
//list all bookings of a given proId
router.get("/api/bookings/pro/:id", async (ctx) => {
	console.log(ctx.params);
	const { id } = ctx.params;
	//console.log("id is " + id);
	const res = Pro.findOne({
		_id: new mongoose.Types.ObjectId(id),
	}).populate({ path: "bookings" });
	ctx.body = await res.then((data) => data);
});
//List all the bookings of a given userId:
router.get("/api/bookings/user/:id", async (ctx) => {
	const { id } = ctx.params;
	//console.log("id is " + id);
	const res = User.findOne({
		_id: new mongoose.Types.ObjectId(id),
	}).populate({ path: "bookings" });
	ctx.body = await res.then((data) => data);
});

//Update
//Add rating and feedback:
router.put("/api/booking", async (ctx) => {
	const payload = ctx.request.body;
	await Booking.findOneAndUpdate(
		{
			_id: new mongoose.Types.ObjectId(payload.bookingId),
		},
		{
			$set: {
				feedback: payload.feedback,
				rating: payload.rating,
				status: payload.status,
			},
		},
		(err, data) => {
			if (err) {
				console.error(err);
				ctx.status = 500;
				ctx.body = {
					message: "Internal error, please try again",
				};
			}
			console.log(data);
			ctx.status = 201;
		}
	);
});

module.exports = router;
