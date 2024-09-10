const { validationResult } = require('express-validator');
const {
  getFolders,
  createFolder,
  findFolder,
  getFiles,
  updateFolder,
  removeFolder,
  getFolderId,
} = require('../prisma/queries');

async function browseFolders(req, res) {
  try {
    const folders = await getFolders(req.user.id);
    res.render('folders/index', { folders: folders, user: req.user });
  } catch {
    res.redirect('/');
  }
}

async function newFolderForm(req, res) {
  try {
    res.render('folders/new', { user: req.user });
  } catch {
    res.redirect('/folders');
  }
}

async function createNewFolder(req, res) {
  const folderName = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('folders/new', {
      name: folderName,
      errorMessage: errors.mapped()['name'].msg,
      user: req.user,
    });
  }
  try {
    await createFolder(folderName, req.user.id);
    const folders = await getFolders(req.user.id);
    res.render('folders/index', {
      folders: folders,
      user: req.user,
    });
  } catch {
    res.render('folders/new', {
      name: folderName,
      errorMessage: 'Error creating Folder. Folder names must be unique!',
      user: req.user,
    });
  }
}

async function renderFolder(req, res) {
  const folderName = req.params.id;
  try {
    const folder = await findFolder(folderName, req.user.id);
    const files = await getFiles(folder.id);
    res.render('folders/folder', {
      folder: folder,
      files: files,
      user: req.user,
    });
  } catch {
    res.redirect('/');
  }
}

async function editFolderForm(req, res) {
  const name = req.params.id;
  try {
    res.render('folders/edit', { name: name, user: req.user });
  } catch {
    res.redirect('/folders');
  }
}

async function editFolder(req, res) {
  const oldName = req.params.id;
  const newName = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('folders/edit', {
      name: oldName,
      errorMessage: errors.mapped()['name'].msg,
      user: req.user,
    });
  }
  try {
    if (newName !== oldName) {
      await updateFolder(oldName, req.user.id, newName);
    }
    const folder = await findFolder(newName, req.user.id);
    const files = await getFiles(folder.id);
    res.render('folders/folder', {
      folder: folder,
      user: req.user,
      files: files,
    });
  } catch {
    res.render('folders/edit', {
      name: oldName,
      errorMessage: 'Error editing Folder',
      user: req.user,
    });
  }
}

async function deleteFolderForm(req, res) {
  const name = req.params.id;
  try {
    res.render('folders/delete', { name: name, user: req.user });
  } catch {
    res.redirect('/folders');
  }
}

async function deleteFolder(req, res) {
  const folderName = req.params.id;
  try {
    await removeFolder(folderName, req.user.id);
    const folders = await getFolders(req.user.id);
    res.render('folders/index', {
      folders: folders,
      user: req.user,
    });
  } catch {
    const folderId = await getFolderId(folderName, req.user.id);
    const files = await getFiles(folderId);
    const errorMessage = files
      ? 'Cannot delete non-empty Folder!'
      : 'Error deleting Folder!';
    const folders = await getFolders(req.user.id);
    res.render('folders/index', {
      folders: folders,
      errorMessage: errorMessage,
      user: req.user,
    });
  }
}

module.exports = {
  browseFolders,
  newFolderForm,
  createNewFolder,
  renderFolder,
  editFolderForm,
  editFolder,
  deleteFolderForm,
  deleteFolder,
};
