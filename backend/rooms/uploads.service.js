const db = require('_helpers/db');

module.exports = {
  getByRoomId
};

async function getByRoomId(roomId) {
  return await db.Upload.findAll({
    where: {
      roomId
    }
  });
}
