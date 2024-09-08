const bcrypt = require("bcryptjs");
//const db = require("../db/queries");
const { validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function renderIndexPage(req, res) {
  try {
    //const messages = await db.getAllMessages();
    res.render("index", { user: req.user });
  } catch {
    res.redirect("/");
  }
}

async function renderRegisterForm(req, res) {
  try {
    res.render("register-form", {
      email: "",
      password: "",
      user: req.user,
    });
  } catch {
    res.redirect("/");
  }
}

async function register(req, res, next) {
  const errors = myValidationResult(req).array();
  const { email, password } = req.body;
  if (errors.length > 0) {
    return res.render("register-form", {
      errorMessage: errors.join(" "),
      email: email,
      password: password,
      user: req.user,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.render("login", { email: email, password: password, user: user });
  } catch (err) {
    return next(err);
  }
}

async function renderLoginForm(req, res, next) {
  let errorMessage = "";
  /*   if (req.session.messages) {
    errorMessage = req.session.messages[req.session.messages.length - 1];
  } */
  res.render("login", {
    email: "",
    password: "",
    user: req.user,
    errorMessage: errorMessage,
  });
  //req.session.messages = undefined;
}

async function login(req, res) {
  res.redirect("/");
}

async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = {
  renderIndexPage,
  renderRegisterForm,
  renderLoginForm,
  register,
  login,
  logout,
};
