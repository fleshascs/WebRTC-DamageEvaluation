const db = require('../_helpers/db');

module.exports = {
  addParticipant,
  getAll,
  getByUserId
};

async function addParticipant(roomId, participantIds) {
  const participants = await db.RoomParticipant.bulkCreate(
    participantIds.map((participantId) => ({
      accountId: participantId,
      roomId
    }))
  );
  return participants;
}

async function getAll(roomId) {
  return await db.RoomParticipant.findAll({
    where: {
      roomId
    },
    include: [{ model: db.Account, required: false }]
  });
}

async function getByUserId(roomId, accountId) {
  return await db.RoomParticipant.findOne({
    where: {
      roomId,
      accountId
    }
  });
}
