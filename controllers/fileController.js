const { validationResult } = require('express-validator');
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});
const fs = require('fs');

const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dntzvugzbvhuxqjtmuss.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const { data, error } = supabase.storage.createBucket('avatars', {
  public: true,
  allowedMimeTypes: ['image/*'],
  fileSizeLimit: '1MB',
});

async function renderUploadFileForm(req, res) {
  const message = '';
  const folders = await prisma.folder.findMany({
    where: {
      ownerId: req.user.id,
    },
  });
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
  //console.log(req.file);
  let { file_folder } = req.body;
  //file_folder = file_folder.toLowerCase();
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const { originalname, mimetype, size, buffer } = file;

  //const filePath = path.join(file_folder, file.originalname);

  // Check if the bucket exists and create it if it doesn't
  /*   const { data: bucketData, error: bucketError } =
    await supabase.storage.createBucket(file_folder, {
      public: true,
    });

  if (bucketError && bucketError.message !== "The resource already exists") {
    return res.status(500).send(bucketError.message);
  } */

  const { data, error } = await supabase.storage
    .from('test')
    .upload(file.originalname, fs.createReadStream(file.path), {
      cacheControl: '3600',
      contentType: mimetype,
      upsert: false,
      duplex: 'half',
    });

  if (error) {
    return res.status(500).send(error.message);
  }

  const fileUrl = `${supabaseUrl}/storage/v1/object/public/test/${file.originalname}`;
  //console.log(fileUrl);

  const publicUrl = await getPublicUrl(file.originalname);

  //console.log(publicUrl);

  const folder = await prisma.folder.findUnique({
    where: {
      name_ownerId: {
        name: file_folder,
        ownerId: req.user.id,
      },
    },
  });

  const files = await prisma.file.findMany({
    where: {
      folderId: folder.id,
    },
  });

  const newFile = await prisma.file.create({
    data: {
      name: file.originalname,
      size: file.size,
      url: publicUrl,
      folderId: folder.id,
      ownerId: req.user.id,
    },
  });

  await unlinkAsync(req.file.path);
  const folders = await prisma.folder.findMany({
    where: {
      ownerId: req.user.id,
    },
  });
  try {
    res.render('files/upload-file', {
      user: req.user,
      folders: folders,
      message: 'File uploaded successfully!',
    });
  } catch {
    res.redirect('/');
  }
}

async function getPublicUrl(filename) {
  const { data } = supabase.storage.from('test').getPublicUrl(filename);

  return data.publicUrl;
}

async function showFileInfo(req, res) {
  const fileId = parseInt(req.params.id);
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  const folder = await prisma.folder.findUnique({
    where: {
      id: file.folderId,
    },
  });
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

module.exports = {
  renderUploadFileForm,
  uploadFile,
  showFileInfo,
};
