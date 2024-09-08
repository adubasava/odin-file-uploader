const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const alphaNumErr =
  "must only contain letters and digits and can not be empty!";

const validateFolder = [
  body("name")
    .trim()
    .isAlphanumeric()
    .withMessage(`Folder name ${alphaNumErr}`),
];

const folderController = require("../controllers/folderController");

router.get("/", folderController.browseFolders);

router.get("/new", folderController.newFolderForm);

router.post("/new", [validateFolder], folderController.createNewFolder);

router.get("/:id", folderController.renderFolder);

router.get("/:id/edit", folderController.editFolderForm);

router.post("/:id/edit", [validateFolder], folderController.editFolder);

router.get("/:id/delete", folderController.deleteFolderForm);

router.post("/:id/delete", folderController.deleteFolder);

module.exports = router;
