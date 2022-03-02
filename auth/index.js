// const jwt = require("jsonwebtoken");
// const TOKEN_SECRET = require("../utils/data");
//
// exports.authUser = async (token) => {
//   //   const authHeader = await req.get("Authorization");
//   // console.log("auth header", await header);
//
//   // const token = header.split(" ")[1];
//
//   // console.log("authUser", token);
//
//   // const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
//       if (err) {
//         console.log(err);
//         reject({ success: false, err });
//       } else {
//         resolve({ success: true, decoded });
//       }
//     });
//   });
// };
