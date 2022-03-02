const { QueryTypes } = require("sequelize");
// import model from "../models";
const { startupPartner } = require("../models");
const {
  registerValidation,
  loginValidation,
  setPassword,
  generateToken,
  validPassword
} = require("../validation");

const registerPartner = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    //validating data
    const { error } = registerValidation(req.body);

    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    const StartupPartner = await startupPartner.findOne({
      where: { email: email.toLowerCase() }
    });
    if (StartupPartner) {
      return res
        .status(400)
        .send({ message: "Partner with that email already exist" });
    }

    const partner = await startupPartner.create({
      name,
      email,
      phone,
      password: await setPassword(password)
    });

    const token = generateToken({ name, email, password });

    if (partner) {
      return res.status(201).json({
        status: true,
        message: "Startup Partner created",
        data: partner,
        token: token
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Company could not be created." });
    }
  } catch (e) {
    return res.status(500).json({
      message: e.message
    });
  }
};

const loginPartner = async (req, res) => {
  const { email, password } = req.body;

  //validating data
  const { error } = loginValidation(req.body);

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message });
  }
  const StartupPartner = await startupPartner.findOne({
    where: { email: email.toLowerCase() }
  });

  if (!StartupPartner) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid email or password" });
  }
  // check and validate password
  let validate_pass = validPassword(password,StartupPartner.password);

  if (!validate_pass) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid email or password" });
  }

  const token = generateToken({
    name: StartupPartner.name,
    email: StartupPartner.email,
    password: StartupPartner.password
  });

  if (StartupPartner) {
    return res.status(200).json({
      status: true,
      message: "Partner Login successful",
      data: StartupPartner,
      token: token
    });
  }
};

module.exports = {
  registerPartner,
  loginPartner
};
