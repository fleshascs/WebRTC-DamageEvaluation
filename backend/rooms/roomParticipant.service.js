const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sendEmail = require("_helpers/send-email");
const db = require("_helpers/db");
const Role = require("_helpers/role");
const Sequelize = require("sequelize");

module.exports = {
  addParticipant,
  getAll,
};

async function addParticipant(roomId, participantIds) {
  const participants = await db.RoomParticipant.bulkCreate(
    participantIds.map((participantId) => ({
      accountId: participantId,
      roomId,
    }))
  );
  return participants;
}

async function getAll(roomId) {
  return await db.RoomParticipant.findAll({
    where: {
      roomId,
    },
    include: [{ model: db.Account, required: false }],
  });
}
