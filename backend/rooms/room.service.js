const db = require("_helpers/db");
const { Op, QueryTypes } = require("sequelize");

module.exports = {
  getById,
  getAll,
  create,
};

async function getById(id) {
  const room = await getRoom(id);
  return room;
}

async function getRoom(id) {
  const room = await db.Room.findByPk(id);
  if (!room) throw "Room not found";
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
    "SELECT id, roomName, scheduledFor, createdBy FROM rooms r WHERE scheduledFor > ? AND (createdBy = ? OR (SELECT count(*) from roomParticipants WHERE roomId = r.id AND accountId =?) > 0) ORDER BY scheduledFor",
    {
      replacements: [getTodayWithoutTime(), uid, uid],
      type: QueryTypes.SELECT,
    }
  );

  return rooms;
}

function getTodayWithoutTime() {
  const today = new Date();
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
