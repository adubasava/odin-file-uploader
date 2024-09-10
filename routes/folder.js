const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const validateFolder = [
  body('name')
    .trim()
    .notEmpty()
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage(
      `Folder name must only contain letters, digits, white spaces and hyphens, and can not be empty!`,
    ),
];

const folderController = require('../controllers/folderController');

router.get('/', folderController.browseFolders);

router.get('/new', folderController.newFolderForm);

router.post('/new', [validateFolder], folderController.createNewFolder);

router.get('/:id', folderController.renderFolder);

router.get('/:id/edit', folderController.editFolderForm);

router.post('/:id/edit', [validateFolder], folderController.editFolder);

router.get('/:id/delete', folderController.deleteFolderForm);

router.post('/:id/delete', folderController.deleteFolder);

module.exports = router;
