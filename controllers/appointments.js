const db = require("../models");
const { QueryTypes } = require("sequelize");

const Appointment = db.mentors_appointments;
const Mentor = db.mentors_profile;

const createAppointment = async (req, res) => {
  try {
    const field = req.body;
    const date = field.date;
    const time = field.time;
    const mentor_id = field.mentor_id;
    const startup_team_id = field.startup_team_id;
    const email = field.email;
    const name = field.name;
    const program_id = field.program_id;
    const approval = field.approval;
    const active = true;

    const appoinment = await Appointment.create({
      date,
      time,
      mentor_id,
      startup_team_id,
      approval,
      active,
      email,
      name,
      program_id,
    });

    if (appoinment) {
      return res.status(201).json({
        status: true,
        message: "New appointment created",
        data: appoinment,
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Could not create appointment" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getMentorAppointmentsById = async (req, res) => {
  try {
    const { id } = req.params;

    let appointments = await Appointment.findAll({
      where: { mentor_id: id },
      order: [["createdAt", "DESC"]],
    });

    appointments = appointments.filter((a) => a.date !== null);

    const pastMentees = await db.sequelize.query(`select * from startups`, {
      type: QueryTypes.SELECT,
    });

    const recentMentees = await db.sequelize.query(
      `select * from training_teams`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const assigned_tasks = await db.sequelize.query(
      `select * from mentor_assigned_tasks`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // console.log(assigned_tasks, "tasks");

    const mentors = await Mentor.findAll();

    if (appointments) {
      const updated = [];
      appointments.forEach(async (a) => {
        let item = {
          id: a.id,
          mentor_id: a.mentor_id,
          startup_team_id: a.startup_team_id,
          appointment_date: null,
          date: a.date,
          active: a.active,
          approval: a.approval,
          name: a.name,
          email: a.email,
          time: a.time,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          mentee: {},
          mentor: {},
          tasks: [],
        };

        let mentee;
        if (a.program_id === 4) {
          mentee = pastMentees.filter((m) => m.team_id === a.startup_team_id);
        } else {
          mentee = recentMentees.filter((m) => m.id == a.startup_team_id);
        }

        let mentor = mentors.filter((m) => m.id === a.mentor_id);
        let tasks = assigned_tasks.filter((t) => t.appointment_id == a.id);
        // console.log(tasks);

        // console.log(mentee, mentor);
        item.mentee = mentee[0];
        item.mentor = mentor[0];
        item.tasks = tasks;

        updated.push(item);
        // console.log(a);
      });
      return res.status(200).json({
        status: true,
        message: "List of appointments",
        data: updated,
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Could not get apointments" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getMentorAppointmentsByStartupId = async (req, res) => {
  try {
    const { id } = req.params;

    let appointments = await Appointment.findAll({
      where: { startup_team_id: id },
      order: [["createdAt", "DESC"]],
    });

    appointments = appointments.filter((a) => a.date !== null);

    const pastMentees = await db.sequelize.query(`select * from startups`, {
      type: QueryTypes.SELECT,
    });

    const recentMentees = await db.sequelize.query(
      `select * from training_teams`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const assigned_tasks = await db.sequelize.query(
      `select * from mentor_assigned_tasks`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // console.log(assigned_tasks, "tasks");

    const mentors = await Mentor.findAll();
    // console.log("mentors", mentors);

    if (appointments) {
      const updated = [];
      appointments.forEach(async (a) => {
        let item = {
          id: a.id,
          mentor_id: a.mentor_id,
          startup_team_id: a.startup_team_id,
          appointment_date: null,
          date: a.date,
          active: a.active,
          approval: a.approval,
          name: a.name,
          email: a.email,
          time: a.time,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
          mentee: {},
          mentor: {},
          tasks: [],
        };

        let mentee;
        if (a.program_id === 4) {
          mentee = pastMentees.filter((m) => m.team_id === a.startup_team_id);
        } else {
          mentee = recentMentees.filter((m) => m.id == a.startup_team_id);
        }

        let mentor = mentors.filter((m) => m.id == a.mentor_id);
        let tasks = assigned_tasks.filter((t) => t.appointment_id == a.id);

        // console.log(tasks);
        // console.log("mentor", mentor);
        item.mentee = mentee[0];
        item.mentor = mentor[0];

        // if (mentor && mentee) {
        //   item.mentor = mentor[0];

        //   console.log("mentor", item.mentor);
        // }

        item.tasks = tasks;

        updated.push(item);
        // console.log(a);
      });
      return res.status(200).json({
        status: true,
        message: "List of appointments",
        data: updated,
      });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Could not get apointments" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getAllTasksByStartupId = async (req, res) => {
  try {
    const { id } = req.params;
    const assigned_tasks = await db.sequelize.query(
      `select mentor_assigned_tasks.team_id, mentor_assigned_tasks.task, mentor_assigned_tasks.mentor_id, mentor_assigned_tasks.appointment_id, mentor_assigned_tasks.date from mentor_assigned_tasks WHERE mentor_assigned_tasks.team_id = '${id}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (assigned_tasks) {
      res.status(200).json({ message: "List of tasks", data: assigned_tasks });
    } else {
      res.status(400).json({ message: "Could not get tasks" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const field = req.body;
    const date = field.date;
    const time = field.time;
    const mentor_id = field.mentor_id;
    const startup_team_id = field.startup_team_id;
    const email = field.email;
    const name = field.name;
    const approval = field.approval;

    const appoinment = await Appointment.findOne({ where: { id } });

    if (appoinment) {
      const updatedAppointment = await appoinment.update({
        date: date || appoinment.date,
        time: time || appoinment.time,
        mentor_id: mentor_id || appoinment.mentor_id,
        startup_team_id: startup_team_id || appoinment.startup_team_id,
        approval: approval || appointment.approval,
        email: email || appointment.email,
        name: name || appointment.name,
      });

      if (updatedAppointment) {
        return res
          .status(200)
          .json({ message: "Appointment updated", data: updatedAppointment });
      } else {
        return res
          .status(400)
          .json({ message: "Unable to update appointment." });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Appointment with specified ID  not found." });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getMentorAppointmentsById,
  getMentorAppointmentsByStartupId,
  getAllTasksByStartupId,
  rescheduleAppointment,
};
