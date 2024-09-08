const { validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function browseFolders(req, res) {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        ownerId: req.user.id,
      },
    });
    res.render("folders/index", { folders: folders, user: req.user });
  } catch {
    res.redirect("/");
  }
}

async function newFolderForm(req, res) {
  try {
    res.render("folders/new", { user: req.user });
  } catch {
    res.redirect("/folders");
  }
}

async function createNewFolder(req, res) {
  const errors = validationResult(req);
  const folderName = req.body.name;
  if (!errors.isEmpty()) {
    return res.render("folders/new", {
      name: folderName,
      errorMessage: errors.mapped()["name"].msg,
      user: req.user,
    });
  }
  try {
    const folder = await prisma.folder.create({
      data: {
        name: folderName,
        ownerId: req.user.id,
      },
    });
    res.redirect("/");
  } catch {
    res.render("folders/new", {
      name: folderName,
      errorMessage: "Error creating Folder. Folder names must be unique!",
      user: req.user,
    });
  }
}

async function renderFolder(req, res) {
  const folderName = req.params.id;
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        name_ownerId: {
          name: folderName,
          ownerId: req.user.id,
        },
      },
    });
    //const tours = await db.getTourByCategory(categoryName);
    res.render("folders/folder", {
      folder: folder,
      user: req.user,
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
}

async function editFolderForm(req, res) {
  try {
    const name = req.params.id;
    res.render("folders/edit", { name: name, user: req.user });
  } catch {
    res.redirect("/folders");
  }
}

async function editFolder(req, res) {
  const oldName = req.params.id;
  const newName = req.body.name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("folders/edit", {
      name: oldName,
      errorMessage: errors.mapped()["name"].msg,
      user: req.user,
    });
  }
  try {
    if (newName !== oldName) {
      await prisma.folder.update({
        where: {
          name_ownerId: {
            name: oldName,
            ownerId: req.user.id,
          },
        },
        data: {
          name: newName,
        },
      });
    }
    const folder = await prisma.folder.findUnique({
      where: {
        name_ownerId: {
          name: newName,
          ownerId: req.user.id,
        },
      },
    });
    res.render("folders/folder", {
      folder: folder,
      user: req.user,
    });
  } catch {
    res.render("folders/edit", {
      name: oldName,
      errorMessage: "Error editing Folder",
      user: req.user,
    });
  }
}

async function deleteFolderForm(req, res) {
  try {
    const name = req.params.id;
    res.render("folders/delete", { name: name, user: req.user });
  } catch {
    res.redirect("/folders");
  }
}

async function deleteFolder(req, res) {
  const folderName = req.params.id;
  const folders = await prisma.folder.findMany({
    where: {
      ownerId: req.user.id,
    },
  });
  //const tours = await db.getTourByCategory(categoryName);
  try {
    await prisma.folder.delete({
      where: {
        name_ownerId: {
          name: folderName,
          ownerId: req.user.id,
        },
      },
    });
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.render("folders/index", {
      folders: folders,
      errorMessage: "Error deliting Folder",
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
