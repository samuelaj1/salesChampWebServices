'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('incubation_baseline_surveys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      region: {
        type: Sequelize.STRING
      },
      hub: {
        type: Sequelize.STRING
      },
      program: {
        type: Sequelize.STRING
      },
      medium: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      education_experience: {
        type: Sequelize.STRING
      },
      level_of_knowledge: {
        type: Sequelize.STRING
      },
      rate_skills: {
        type: Sequelize.INTEGER
      },
      rate_entrepreneurial_skills: {
        type: Sequelize.INTEGER
      },
      is_committed: {
        type: Sequelize.STRING
      },
      enough_resource: {
        type: Sequelize.STRING
      },
      business_model_canvas: {
        type: Sequelize.INTEGER
      },
      design_thinking: {
        type: Sequelize.INTEGER
      },
      marketing_branding: {
        type: Sequelize.INTEGER
      },
      pitching: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING
      },
      name_of_startup: {
        type: Sequelize.STRING
      },
      expertise: {
        type: Sequelize.STRING
      },
      occupation: {
        type: Sequelize.STRING
      },
      personal_goal_objective: {
        type: Sequelize.TEXT
      },
      startup_goal_objective: {
        type: Sequelize.TEXT
      },
      see_yourself: {
        type: Sequelize.TEXT
      },
      see_startup: {
        type: Sequelize.TEXT
      },
      how_to_meet_goals: {
        type: Sequelize.TEXT
      },
      impact_of_training: {
        type: Sequelize.TEXT
      },
      expectation_of_incubation: {
        type: Sequelize.TEXT
      },
      gain_from_incubation: {
        type: Sequelize.TEXT
      },
      yes_enough_resource: {
        type: Sequelize.TEXT
      },
      no_enough_resource: {
        type: Sequelize.TEXT
      },
      challenges: {
        type: Sequelize.TEXT
      },
      applicant_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('incubation_baseline_surveys');
  }
};