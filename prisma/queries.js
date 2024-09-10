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

async function findUserByEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

async function findUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
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
    orderBy: [
      {
        name: 'asc',
      },
    ],
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

async function findFolderByFile(fileFolderId) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: fileFolderId,
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
    orderBy: [
      {
        uploadTime: 'desc',
      },
    ],
  });

  return files;
}

async function findFile(fileId) {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  return file;
}

async function checkFile(fileName, ownerId) {
  const file = await prisma.file.findUnique({
    where: {
      name_ownerId: {
        name: fileName,
        ownerId: ownerId,
      },
    },
  });

  return file;
}

async function createFile(originalname, size, publicUrl, folderId, ownerId) {
  await prisma.file.create({
    data: {
      name: originalname,
      size: size,
      url: publicUrl,
      folderId: folderId,
      ownerId: ownerId,
    },
  });
}

async function removeFile(fileId) {
  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getFolders,
  findFolder,
  findFolderByFile,
  getFolderId,
  createFolder,
  updateFolder,
  removeFolder,
  getFiles,
  findFile,
  checkFile,
  createFile,
  removeFile,
};
