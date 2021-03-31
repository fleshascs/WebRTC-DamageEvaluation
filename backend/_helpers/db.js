const config = require("config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });
  db.sequelize = sequelize;
  // init models and add them to the exported db object
  db.Account = require("../accounts/account.model")(sequelize);
  db.RefreshToken = require("../accounts/refresh-token.model")(sequelize);
  db.Room = require("../rooms/room.model")(sequelize);
  db.RoomParticipant = require("../rooms/roomParticipant.model")(sequelize);

  // define relationships
  db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
  db.RefreshToken.belongsTo(db.Account);

  db.Room.hasMany(db.RoomParticipant, { onDelete: "CASCADE" });
  db.Account.hasMany(db.RoomParticipant, {
    onDelete: "CASCADE",
    foreignKey: "accountId",
  });
  db.RoomParticipant.belongsTo(db.Account);
  db.RoomParticipant.belongsTo(db.Room);

  // sync all models with database
  await sequelize.sync({ alter: true });
}
