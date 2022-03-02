"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("mentors_profile", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      password: {
        type: Sequelize.STRING,
      },
      available_days: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      test_available_days: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      days: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      hub_id: {
        type: Sequelize.INTEGER,
      },
      timeslots: {
        type: Sequelize.JSON,
      },
      photo: {
        type: Sequelize.STRING,
      },
      facebook: {
        type: Sequelize.STRING,
      },
      twitter: {
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
    await queryInterface.dropTable("mentors_profile");
  },
};
