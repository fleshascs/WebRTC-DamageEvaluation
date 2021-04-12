const db = require('../_helpers/db');
const path = require('path');
const sanitize = require('sanitize-filename');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');

module.exports = {
  getByRoomId,
  upload,
  saveUploadToDB
};

const uploadDir = path.join(__dirname, '../public/uploads/rooms');

function upload(files, roomId) {
  return new Promise((resolve, reject) => {
    let sampleFile;
    let uploadPath;
    sampleFile = files.sampleFile;
    const fileName = uuidv4() + sanitize(sampleFile.name);
    const sanitizedRoomId = sanitize(roomId);
    const dir = `${uploadDir}/${sanitizedRoomId}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    uploadPath = `${dir}/${fileName}`;

    sampleFile.mv(uploadPath, async function (err) {
      if (err) return reject(err);

      resolve({ publicPath: `/room/${sanitizedRoomId}/uploads/${fileName}` });
    });
  });
}

async function saveUploadToDB(filePath, accountId, roomId) {
  const file = new db.Upload({
    filePath,
    accountId,
    roomId
  });
  await file.save();
  return file;
}

async function getByRoomId(roomId) {
  return await db.Upload.findAll({
    where: {
      roomId
    }
  });
}
