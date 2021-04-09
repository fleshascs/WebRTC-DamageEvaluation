const db = require('_helpers/db');
const { Op, QueryTypes } = require('sequelize');
const path = require('path');
const sanitize = require('sanitize-filename');
var fs = require('fs');
var dir = './tmp';

module.exports = {
  getById,
  getAll,
  create,
  upload
};

const uploadDir = path.join(__dirname, '../public/uploads/rooms');

function upload(files, accountId, roomId) {
  return new Promise((resolve, reject) => {
    let sampleFile;
    let uploadPath;

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = files.sampleFile;
    const fileName = sanitize(sampleFile.name);
    const sanitizedRoomId = sanitize(roomId);
    const dir = `${uploadDir}/${sanitizedRoomId}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    uploadPath = `${dir}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, async function (err) {
      if (err) return reject(err);

      // const file = new db.upload({
      //   filePath: fileName,
      //   accountId: accountId,
      //   roomId: roomId
      // });
      // await file.save();

      resolve('File uploaded!');
    });
  });
}

async function getById(id) {
  const room = await getRoom(id);
  return room;
}

async function getRoom(id) {
  const room = await db.Room.findByPk(id);
  if (!room) throw 'Room not found';
  return room;
}

async function create(params) {
  const room = new db.Room(params);
  await room.save();
  return room;
}

async function getAll(uid) {
  // const rooms = await db.Room.findAll({
  //   where: {
  //     scheduledFor: {
  //       [Op.gte]: getTodayWithoutTime(),
  //     },
  //     "$roomParticipants.roomId$": { [Op.eq]: "$id$" },
  //     "$roomParticipants.accountId$": { [Op.eq]: uid },
  //     createdBy: {
  //       [Op.eq]: uid,
  //     },
  //   },
  //   include: [
  //     {
  //       model: db.RoomParticipant,
  //       as: "roomParticipants",
  //     },
  //   ],
  //   order: [["scheduledFor", "DESC"]],
  // });

  const rooms = await db.sequelize.query(
    'SELECT id, roomName, scheduledFor, createdBy FROM rooms r WHERE scheduledFor > ? AND (createdBy = ? OR (SELECT count(*) from roomParticipants WHERE roomId = r.id AND accountId =?) > 0) ORDER BY scheduledFor',
    {
      replacements: [getTodayWithoutTime(), uid, uid],
      type: QueryTypes.SELECT
    }
  );

  return rooms;
}

function getUtcTime() {
  var now = new Date();
  var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  return utc;
}

function getTodayWithoutTime() {
  const today = getUtcTime();
  const todayWithoutTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
  return todayWithoutTime;
}
