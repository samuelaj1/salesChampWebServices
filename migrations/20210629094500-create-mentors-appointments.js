"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("mentors_appointments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mentor_id: {
        type: Sequelize.INTEGER,
      },
      program_id: {
        type: Sequelize.INTEGER,
      },
      startup_team_id: {
        type: Sequelize.STRING,
      },
      appointment_date: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      active: {
        type: Sequelize.BOOLEAN,
      },
      approval: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("mentors_appointments");
  },
};
