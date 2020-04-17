"use strict";
const Koa = require("koa");
const { oas } = require("koa-oas3");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const config = require("./api/config");
const router = require("./api/router");
const cors = require("@koa/cors");

mongoose.connect(config.db.uri, config.db.options);
const app = new Koa();

app.use(
  oas({
    endpoint: "/openapi.json",
    file: path.resolve(process.cwd(), "./api", "openapi.yml"),
    uiEndpoint: "/oas",
    validatePaths: ["/else"],
  })
);

const corsOptions = {
  allowMethods: "GET,POST,PUT",
};

app.use(cors(corsOptions));
app.use(bodyParser());
app.use(router.routes());
app.listen(4000);
