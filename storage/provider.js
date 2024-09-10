const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');

const supabaseUrl = 'https://dntzvugzbvhuxqjtmuss.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function upload(originalname, mimetype, path) {
  await supabase.storage
    .from('test')
    .upload(originalname, fs.createReadStream(path), {
      cacheControl: '3600',
      contentType: mimetype,
      upsert: false,
      duplex: 'half',
    });
}

async function getPublicUrl(filename) {
  const { data } = supabase.storage.from('test').getPublicUrl(filename);

  return data.publicUrl;
}

module.exports = {
  supabase,
  supabaseUrl,
  upload,
  getPublicUrl,
};
