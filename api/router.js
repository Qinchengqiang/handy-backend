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
 * * Plsease follow the CRUD order for each section
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
//List all the bookings of a user:
router.get("/api/user/bookings/:userId", async (ctx) => {
  const { userId } = ctx.params;
  //console.log("id is " + id);
  const res = User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  }).populate({ path: "bookings" });
  ctx.body = await res.then((data) => data);
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
//List all available pros with matching service type and time
router.get("/api/pro/:type/:date", async (ctx) => {
  let { type, date } = ctx.params;
  date = new Date(date);
});

/** API for Booking model
 *  For simplicity sake, our handy.com clone only supports same date
 * booking, meaning the user can only book a job lasts less than 29
 * time sessions
 */
//Create a Booking
router.post("/api/booking", async (ctx) => {
  try {
    const body = ctx.request.body;
    const proId = new mongoose.Types.ObjectId(body.proId);
    const customerId = new mongoose.Types.ObjectId(body.customerId);
    const bookingDate = new Date(body.bookingDate);
    /**
     * TODO validate against pro's availability, then update pro's availability
     */
    /* const proAvail = Pro.findOne(
      {
            _id: proId,
            availability: [{
              
          }]
      },
      {}
    ); */
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
//

module.exports = router;
