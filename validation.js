//validation
const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//register validation
const registerValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .strip()
      .required(),
    email: Joi.string()
      .strip()
      .required()
      .email(),
    password: Joi.string()
      .strip()
      .min(6)
      .required(),
    phone: Joi.string().strip()
  });

  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .strip()
      .required()
      .email(),
    password: Joi.string()
      .strip()
      .required()
  });

  return schema.validate(data);
};

const setPassword = async function(password) {
  const salt = await bcryptjs.genSaltSync(10);
  return await bcryptjs.hashSync(password, salt);
};

const validPassword = async function(password, db_password) {
  return await bcryptjs.compareSync(password, db_password);
};

const generateToken = function(payload) {
  console.log(process.env.JWT_SECRET, "secret");
  return jwt.sign(payload, process.env.JWT_SECRET);
};

module.exports = {
  registerValidation,
  loginValidation,
  setPassword,
  validPassword,
  generateToken
};
