const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
//const db = require("../db/queries");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const mainController = require("../controllers/mainController");

const validateUser = [
  body("email").custom(async (value) => {
    const user = await prisma.user.findUnique({
      where: {
        email: value,
      },
    });
    if (user !== null) {
      throw new Error("E-mail already in use!");
    }
  }),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage(`The password must be at least 5 characters long!`),
  body("passwordConfirmation")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return value === req.body.password;
    }),
];

const check = passport.authenticate("local", {
  failureRedirect: "/log-in",
  failureMessage: true,
  badRequestMessage: "Re-check email and/or password!",
});

router.get("/", mainController.renderIndexPage);
router.get("/register", mainController.renderRegisterForm);
router.post("/register", [validateUser], mainController.register);

router.get("/log-in", mainController.renderLoginForm);
router.post("/log-in", [check], mainController.login);

router.get("/log-out", mainController.logout);

module.exports = router;
