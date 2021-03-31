const db = require("_helpers/db");

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

async function getAll() {
  const rooms = await db.Room.findAll();
  return rooms;
}
