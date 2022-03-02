"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class mentors_appointments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mentors_appointments.init(
    {
      mentor_id: DataTypes.INTEGER,
      program_id: DataTypes.INTEGER,
      startup_team_id: DataTypes.STRING,
      appointment_date: DataTypes.STRING,
      date: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      approval: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      time: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "mentors_appointments",
    }
  );
  return mentors_appointments;
};
