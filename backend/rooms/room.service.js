const db = require('../_helpers/db');
const { QueryTypes } = require('sequelize');

module.exports = {
  getById,
  getAll,
  create
};

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
