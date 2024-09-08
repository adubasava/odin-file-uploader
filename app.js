if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

//const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
require("./auth/passport");
//const pool = require("./db/pool");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));

const indexRouter = require("./routes/index");

app.use("/", indexRouter);
//app.use("/log-in", indexRouter);
app.use("/register", indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
