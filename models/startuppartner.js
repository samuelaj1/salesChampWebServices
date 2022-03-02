"use strict";
const { Model } = require("sequelize");
const PROTECTED_ATTRIBUTES = ["password"];
module.exports = (sequelize, DataTypes) => {
  class StartupPartner extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StartupPartner.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: true,
      tableName: "incubation_startup_partners",
      createdAt: "created_at",
      updatedAt: "updated_at",
      modelName: "startupPartner",
    }
  );
  return StartupPartner;
};
