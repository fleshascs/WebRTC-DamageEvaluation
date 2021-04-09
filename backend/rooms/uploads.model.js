const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    filePath: { type: DataTypes.STRING, allowNull: false },
    accountId: { type: DataTypes.INTEGER, allowNull: false },
    roomId: { type: DataTypes.INTEGER, allowNull: false },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  };

  const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false
  };

  return sequelize.define('uploads', attributes, options);
}
