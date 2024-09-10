const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const fileController = require('../controllers/fileController');

router.get('/', fileController.renderUploadFileForm);
router.post('/', upload.single('uploaded_file'), fileController.uploadFile);

router.get('/:id', fileController.showFileInfo);
router.post('/:id/delete', fileController.deleteFile);

module.exports = router;
