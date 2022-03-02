const jwt = require("jsonwebtoken");
const TOKEN_SECRET = require("./data");
// import {TOKEN_SECRET} from "./data"

// require("dotenv").config();

function jwtGenerator(email, type) {
  const payload = {
    email,
    type,
  };

  //the code below was the code written from the tutorial
  //Look at file server/routes/dashboard.js to see the change code for this code

  //   function jwtGenerator(user_id) {
  //   const payload = {
  //     user: user_id
  //   };

  return jwt.sign(payload, TOKEN_SECRET);
}

module.exports = jwtGenerator;

// const jwt = require("jsonwebtoken");

// function jwtGenerator(user_id) {
//   const payload = {
//     user: {
//       id: user_id
//     }
//   };

// //the code below was the code written from the tutorial
// //Look at file server/routes/dashboard.js to see the change code for this code

// //   function jwtGenerator(user_id) {
// //   const payload = {
// //     user: user_id
// //   };

//   return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" });
// }

// module.exports = jwtGenerator;
