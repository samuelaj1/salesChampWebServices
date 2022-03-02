const moment = require("moment");
const axios = require("axios");
const bcrypt = require("bcryptjs");

const db = require("../models");
const Mentor = db.mentors_profile;
const Appointment = db.mentors_appointments;
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const { authUser } = require("../auth");
const generateToken = require("../utils/jwtGenerator");
const verifyEmailJwtGenerator = require("../utils/verifyEmailJwtGenerator");

var advance_days = [];

const getAdvanceDates = (day, advance, timeslots, day_string) => {
  //  advance_days = [];
  let data = {};
  const today = moment().isoWeekday();
  if (today <= day) {
    data = {
      day: day_string,
      date: moment().isoWeekday(day).format("YYYY-MM-DD"),
      timeslots: timeslots,
    };
    // then just give me this week's instance of that day
    advance_days.push(data);
  }
  for (let i = 1; i < advance; i++) {
    data = {
      day: day_string,
      date: moment().add(i, "weeks").isoWeekday(day).format("YYYY-MM-DD"),
      timeslots: timeslots,
    };
    advance_days.push(data);
  }
  // console.log(advance_days, "advance days");
  return advance_days;
};

const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const field = req.body;

    const name = field.name;
    const email = field.email;
    const phone = field.phone;
    const description = field.description;
    const available_days = field.available_days;
    const test_available_days = field.test_available_days;
    const days = field.days;
    const partner_hub_id = field.partner_hub_id;
    const photo = field.photo;
    const facebook = field.facebook;
    const twitter = field.twitter;
    const timeslots = field.timeslots;

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const mentor = await Mentor.findOne({ where: { id } });

    if (mentor) {
      const update = await mentor.update({
        name: name || mentor.name,
        email: email || mentor.email,
        phone: phone || mentor.phone,
        description: description || mentor.description,
        available_days: available_days || mentor.available_days,
        days: days || mentor.days,
        test_available_days: test_available_days || mentor.test_available_days,
        partner_hub_id: partner_hub_id || mentor.partner_hub_id,
        photo: photo || mentor.photo,
        facebook: facebook || mentor.facebook,
        twitter: twitter || mentor.twitter,
        timeslots: timeslots || mentor.timeslots,
      });
      if (update) {
        return res
          .status(200)
          .json({ success: true, message: "Profile updated!", data: update });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Could not update profile." });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Could not find mentor with specified ID" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  const field = req.body;
  try {
    const email = field.email;
    const password = field.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const mentor = await Mentor.findOne({ where: { email: email } });
    console.log(mentor);

    if (!mentor) {
      return res
        .status(400)
        .json({ message: "mentor with this email doesn't exist" });
    }

    const passwordUpdate = mentor.update({
      password: hashedPassword || mentor.password,
    });

    if (passwordUpdate) {
      return res.status(200).json({ message: "Password reset successful." });
    } else {
      return res.status(400).json({ message: "Unable to reset password." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const days_of_week = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    const mentor = await Mentor.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });

    const appointments = await Appointment.findAll({
      where: { mentor_id: id },
    });

    if (mentor) {
      advance_days = [];

      let mentors_available_days = mentor["test_available_days"];
      //   console.log(mentors_available_days);
      mentor["days"] = mentor["test_available_days"];

      if (mentors_available_days !== null) {
        let mentors_appointments = appointments.filter((a) => {
          if (a["approval"] === "pending") {
            return a;
          }
        });

        let mentors_timeslots = mentor["timeslots"];

        // console.log(mentors_timeslots);

        mentors_available_days.forEach((e) => {
          //   console.log(e);
          getAdvanceDates(days_of_week[e], 2, mentors_timeslots[e], e);
        });

        let new_advance_days = JSON.stringify(advance_days);
        let advance_dates = JSON.parse(new_advance_days);

        for (const e of mentors_appointments) {
          let appointment_found = advance_dates.find((ele) => {
            if (e["date"] === ele["date"]) {
              return ele;
            }
          });
          if (appointment_found) {
            let position = advance_dates.indexOf(appointment_found);
            appointment_found["timeslots"].splice(
              appointment_found["timeslots"].indexOf(e["time"]),
              1
            );
            advance_dates[position]["timeslots"] =
              appointment_found["timeslots"];
          }
        }

        mentor.test_available_days = advance_dates;
      } else {
        mentor.test_available_days = advance_days;
      }

      return res.status(200).json({
        message: "Mentor's details.",
        data: mentor,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Mentor with specified ID not found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getMentorByHubId = async (req, res) => {
  try {
    const { id } = req.params;
    const mentors = await Mentor.findAll({
      where: {
        hub_id: id,
        test_available_days: {
          [Op.ne]: null,
        },
      },
      attributes: { exclude: ["password"] },
    });

    const appointments = await Appointment.findAll();

    if (mentors) {
      const days_of_week = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
      };

      mentors.map((mentor) => {
        advance_days = [];

        let mentors_available_days = mentor["test_available_days"];
        mentor["days"] = mentor["test_available_days"];

        if (mentors_available_days !== null) {
          let mentors_appointments = appointments.filter((a) => {
            if (a["approval"] === "pending" && a.mentor_id === mentor.id) {
              return a;
            }
          });

          let mentors_timeslots = mentor["timeslots"];

          mentors_available_days.forEach((e) => {
            getAdvanceDates(days_of_week[e], 2, mentors_timeslots[e], e);
          });

          let new_advance_days = JSON.stringify(advance_days);
          let advance_dates = JSON.parse(new_advance_days);

          for (const e of mentors_appointments) {
            let appointment_found = advance_dates.find((ele) => {
              if (e["date"] === ele["date"]) {
                return ele;
              }
            });
            if (appointment_found) {
              let position = advance_dates.indexOf(appointment_found);
              appointment_found["timeslots"].splice(
                appointment_found["timeslots"].indexOf(e["time"]),
                1
              );
              advance_dates[position]["timeslots"] =
                appointment_found["timeslots"];
            }
          }

          mentor.test_available_days = advance_dates;
        } else {
          mentor.test_available_days = advance_days;
        }

        return mentor;
      });

      return res
        .status(200)
        .json({ message: "List of mentors hub ID.", data: mentors });
    } else {
      return res
        .status(400)
        .json({ message: "Could not get list of mentors." });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// const verifyEmail = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const type = "incubation";

//     const mentor = await Mentor.findOne({
//       where: { email },
//     });

//     if (mentor) {
//       const token = generateToken({ email, type });

//       return res.status(200).json({
//         message: "email verfied",
//         data: { email, token },
//       });
//     } else {
//       return res.status(400).json({
//         message: "You are yet to be onboarded as a mentor for incubation.",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const verifyEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const type = "incubation";

    const mentor = await Mentor.findOne({
      where: { email },
    });

    if (mentor) {
      const token = verifyEmailJwtGenerator({ email, type });

      sendEmail(email, token);

      return res.status(200).json({
        success: true,
        message: "Link ",
        data: { email, token },
      });
    } else {
      return res.status(400).json({
        message: "You are yet to be onboarded as a mentor for incubation.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendEmail = (email, token) => {
  return new Promise((resolve, reject) => {
    var list = [];
    list.push(email);
    console.log(email);
    // list.push("zurakummu@gmail.com");
    // console.log(this.selectedMentorEmail);

    axios
      .post(
        `https://gtl-notification-service.herokuapp.com/api/v0/notify`,
        {
          recipients: list,
          type: "email",
          message: `Kindly click this link to reset password https://mentors-dashboard.netlify.app/reset-password/${token} to approve the session.`,
          subject: "GTL Mentorship Password Reset",
        }
      )
      .then(() => {
        resolve("done");
      })
      .catch(() => {
        reject("error");
      });
  });
};

const resetPassword = async (req, res) => {
  try {
    const field = req.body;
    const email = field.email;
    const token = field.token;
    const password = field.password;

    let user;

    // console.log("token", token);

    // const auth_token = token.split(" ")[1];

    // console.log("auth_token", auth_token);

    await authUser(token).then((res) => (user = res.decoded));

    // if (user.email.type !== "acceleration") {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: "You are yet to be onboarded " });
    // }

    const mentor = await Mentor.findOne({ where: { email } });

    if (mentor) {
      if (mentor.email === user.email.email) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const response = await mentor.update({
          password: hashedPassword || mentor.password,
        });

        if (response) {
          return res.status(200).json({
            status: true,
            message: "Password reset successfull",
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "You are yet to be onboarded as a mentor for incubation",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        message: "Mentor with specified email not found.",
      });
    }

    // if (token) {
    //   let user;
    //   await authUser(token).then((res) => (user = res.decoded));
    // }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.findAll();

    if (mentors) {
      return res.status(200).json({
        success: true,
        message: "List of mentors",
        data: mentors,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Could not get list of mentors" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
const updateAgreement = async (req, res) => {
  try {
    const { mentor_id } = req.params;

    const mentor = await Mentor.findByPk(mentor_id, {
      attributes: { exclude: ["password"] },
    });

    if (mentor) {
      const agreement_update = await mentor.update({
        sign_agreement: true,
      });

      return res.status(200).json({
        success: true,
        message: "Mentors agreement has been updated successfully",
        data: agreement_update,
      });
    } else {
      return res.status(400).json({
        message: "You are yet to be onboarded as a mentor for acceleration.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateMentor,
  changePassword,
  getMentor,
  getMentorByHubId,
  verifyEmail,
  resetPassword,
  getAllMentors,
  updateAgreement,

  //getMentorAppointmentsById,
};
