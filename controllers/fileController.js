const {
  getFolders,
  getFolderId,
  createFile,
  findFile,
  findFolderByFile,
  getFiles,
  removeFile,
  checkFile,
} = require('../prisma/queries');

const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const { upload, getPublicUrl } = require('../storage/provider');

async function renderUploadFileForm(req, res) {
  const message = '';
  const folders = await getFolders(req.user.id);
  try {
    res.render('files/upload-file', {
      user: req.user,
      folders: folders,
      message: message,
    });
  } catch {
    res.redirect('/');
  }
}

async function uploadFile(req, res) {
  const { file_folder } = req.body;
  const folders = await getFolders(req.user.id);

  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const { originalname, mimetype, path, size } = file;

  const check = await checkFile(originalname, req.user.id);
  if (check === null) {
    try {
      await upload(originalname, mimetype, path);
    } catch (e) {
      console.log(e);
    }

    try {
      const publicUrl = await getPublicUrl(originalname);
      const folderId = await getFolderId(file_folder, req.user.id);
      await createFile(originalname, size, publicUrl, folderId, req.user.id);
      await unlinkAsync(path);
      res.render('files/upload-file', {
        user: req.user,
        folders: folders,
        message: 'File uploaded successfully!',
      });
    } catch (e) {
      console.log(e);
      res.redirect('/');
    }
  } else {
    res.render('files/upload-file', {
      user: req.user,
      folders: folders,
      message: 'File already exists!',
    });
  }
}

async function showFileInfo(req, res) {
  const fileId = parseInt(req.params.id);
  const file = await findFile(fileId);
  const folder = await findFolderByFile(file.folderId);

  try {
    res.render('files/file', {
      user: req.user,
      file: file,
      folder: folder,
    });
  } catch {
    res.redirect('/');
  }
}

async function deleteFile(req, res) {
  const fileId = parseInt(req.params.id);
  const file = await findFile(fileId);
  const folder = await findFolderByFile(file.folderId);
  try {
    await removeFile(fileId);
    const files = await getFiles(folder.id);
    res.render('folders/folder', {
      folder: folder,
      files: files,
      user: req.user,
    });
  } catch {
    const file = await findFile(fileId);
    res.render('files/file', {
      user: req.user,
      file: file,
      folder: folder,
      errorMessage: 'Error deliting File',
    });
  }
}

module.exports = {
  renderUploadFileForm,
  uploadFile,
  showFileInfo,
  deleteFile,
};
