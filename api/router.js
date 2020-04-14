"use strict";
const Router = require("koa-router");
const mongoose = require("mongoose");
const BookingSchema = require("./models/booking");
const GoodsItemSchema = require("./models/goodsitem");
const OrderSchema = require("./models/order");
const ProSchema = require("./models/pro");
const UserSchema = require("./models/user");

const User = mongoose.model("User", UserSchema);
const Pro = mongoose.model("Pro", ProSchema);
const Booking = mongoose.model("Booking", BookingSchema);
const GoodsItem = mongoose.model("GoodsItem", GoodsItemSchema);
const Order = mongoose.model("Order", OrderSchema);

const router = new Router();

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
    const res = await newUser.save();
    ctx.status = 201;
    ctx.body = {
      message: "new user has been created successfully",
      id: res._id,
    };
  } catch (e) {}
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
    const convertedAvail = body.availability.map((item) => ({
      startDate: new Date(item.startDate),
      startSession: item.startSession,
      endDate: new Date(item.endDate),
      endSession: item.endSession,
    }));
    const proPayload = {
      ...body,
      availability: [...convertedAvail],
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

/**
 * TODO List all available pros with matching service type and time
router.get("/api/pro/:type/:date", async (ctx) => {
  let { type, date } = ctx.params;
  date = new Date(date);
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
    const proId = new mongoose.Types.ObjectId(body.proId);
    const customerId = new mongoose.Types.ObjectId(body.customerId);
    const bookingDate = new Date(body.bookingDate);
    /**
     * TODO validate against pro's availability, then update pro's availability
     */
    const bookingPayload = {
      ...body,
      customerId: customerId,
      proId: proId,
      bookingDate,
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
  } catch (e) {}
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
