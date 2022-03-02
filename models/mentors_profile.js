"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class mentors_profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mentors_profile.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      description: DataTypes.TEXT,
      password: DataTypes.STRING,
      sign_agreement: DataTypes.BOOLEAN,
      available_days: DataTypes.ARRAY(DataTypes.STRING),
      test_available_days: DataTypes.ARRAY(DataTypes.STRING),
      timeslots: DataTypes.JSON,
      days: DataTypes.ARRAY(DataTypes.STRING),
      hub_id: DataTypes.INTEGER,
      photo: DataTypes.STRING,
      facebook: DataTypes.STRING,
      twitter: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "mentors_profile",
      freezeTableName: true,
    }
  );
  return mentors_profile;
};
