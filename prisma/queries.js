const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// USERS
async function createUser(email, hashedPassword) {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  return user;
}

// FOLDERS

async function getFolders(ownerId) {
  const folders = await prisma.folder.findMany({
    where: {
      ownerId: ownerId,
    },
  });

  return folders;
}

async function findFolder(folderName, ownerId) {
  const folder = await prisma.folder.findUnique({
    where: {
      name_ownerId: {
        name: folderName,
        ownerId: ownerId,
      },
    },
  });

  return folder;
}

async function getFolderId(folderName, ownerId) {
  const folder = await prisma.folder.findUnique({
    where: {
      name_ownerId: {
        name: folderName,
        ownerId: ownerId,
      },
    },
  });

  return folder.id;
}

async function createFolder(folderName, ownerId) {
  await prisma.folder.create({
    data: {
      name: folderName,
      ownerId: ownerId,
    },
  });
}

async function updateFolder(oldName, ownerId, newName) {
  await prisma.folder.update({
    where: {
      name_ownerId: {
        name: oldName,
        ownerId: ownerId,
      },
    },
    data: {
      name: newName,
    },
  });
}

async function removeFolder(folderName, ownerId) {
  await prisma.folder.delete({
    where: {
      name_ownerId: {
        name: folderName,
        ownerId: ownerId,
      },
    },
  });
}

// FILES
async function getFiles(folderId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });

  return files;
}

module.exports = {
  createUser,
  getFolders,
  findFolder,
  getFolderId,
  createFolder,
  updateFolder,
  removeFolder,
  getFiles,
};
