"use strict";
const Router = require("koa-router");
const User = require("./models/user");
const Pro = require("./models/pro");
const Booking = require("./models/booking");
const mongoose = require("mongoose");

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

/** API for Pro model
 *
 *
 */
//Create a Pro
router.post("/api/pro", async (ctx) => {
  try {
    const body = ctx.request.body;
    console.log("request body" + JSON.stringify(body));
    const newPro = new Pro(body);
    const res = await newPro.save();
    ctx.status = 201;
    console.log(res);
    ctx.body = {
      message: "a new pro has been created successfully",
      id: res._id,
    };
  } catch (e) {}
});

module.exports = router;
