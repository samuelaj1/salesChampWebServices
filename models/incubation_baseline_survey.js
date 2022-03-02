'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class incubation_baseline_survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  incubation_baseline_survey.init({
    year: DataTypes.INTEGER,
    region: DataTypes.STRING,
    hub: DataTypes.STRING,
    program: DataTypes.STRING,
    medium: DataTypes.STRING,
    gender: DataTypes.STRING,
    education_experience: DataTypes.STRING,
    level_of_knowledge: DataTypes.STRING,
    rate_skills: DataTypes.INTEGER,
    rate_entrepreneurial_skills: DataTypes.INTEGER,
    is_committed: DataTypes.STRING,
    enough_resource: DataTypes.STRING,
    business_model_canvas: DataTypes.INTEGER,
    design_thinking: DataTypes.INTEGER,
    marketing_branding: DataTypes.INTEGER,
    pitching: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    name_of_startup: DataTypes.STRING,
    expertise: DataTypes.STRING,
    occupation: DataTypes.STRING,
    personal_goal_objective: DataTypes.TEXT,
    startup_goal_objective: DataTypes.TEXT,
    see_yourself: DataTypes.TEXT,
    see_startup: DataTypes.TEXT,
    how_to_meet_goals: DataTypes.TEXT,
    impact_of_training: DataTypes.TEXT,
    expectation_of_incubation: DataTypes.TEXT,
    gain_from_incubation: DataTypes.TEXT,
    yes_enough_resource: DataTypes.TEXT,
    no_enough_resource: DataTypes.TEXT,
    challenges: DataTypes.TEXT,
    applicant_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'incubation_baseline_survey',
  });
  return incubation_baseline_survey;
};