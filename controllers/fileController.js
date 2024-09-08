const { validationResult } = require("express-validator");
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function renderUploadFileForm(req, res) {
  try {
    res.render("upload-file", { user: req.user });
  } catch {
    res.redirect("/");
  }
}

async function uploadFile(req, res) {
  try {
    res.render("upload-file", { user: req.user });
  } catch {
    res.redirect("/");
  }
}

module.exports = {
  renderUploadFileForm,
  uploadFile,
};
