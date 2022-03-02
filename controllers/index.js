const { QueryTypes } = require("sequelize");
const db = require("../models");
const IncubationBaselineSurvey = db.incubation_baseline_survey;

const getStartUpsByTeamId = async (req, res) => {
  try {
    const { team_id, program_id } = req.params;
    let teamData = {};
    let startup;

    if (
      program_id === null ||
      program_id === undefined ||
      program_id === "" ||
      program_id === "null" ||
      program_id < 5
    ) {
      startup = await db.sequelize.query(
        `select c.first_name a_first_name,c.last_name a_last_name,a.student_a a_applicant_id,g.profile_pic a_profile_pic, d.first_name b_first_name,d.last_name b_last_name,a.student_b b_applicant_id, f.profile_pic b_profile_pic,
        g.profile_pic a_profile_pic,
        b.team_id team_id,b.name team_name, b.email team_email, b.phone team_phone, b.description team_description,b.hub_id hub_id, b.pitch team_pitch, b.pitch team_pitch, b.year_founded,
        e.category sector, b.socials, b.cover_page, b.logo, b.video_url
 from (select student_a,student_b,team_id from teams UNION SELECT student_a,student_b,team_id FROM teams_pase) a
        left join startups b on a.team_id = b.team_id
        left join applicants c on a.student_a = c.applicant_id
        left join applicants d on a.student_b = d.applicant_id
left join base_applicants_profile g on a.student_a = g.applicant_id
left join base_applicants_profile f on a.student_b = f.applicant_id
        left join startup_sectors e on e.id = b.sector where a.team_id = :team_id`,
        {
          replacements: {
            team_id: team_id,
          },
          type: QueryTypes.SELECT,
        }
      );

      teamData["id"] = 1;
      teamData["creator_applicant_id"] = null;
      teamData["hub_id"] = startup[0].hub_id;
      teamData["region"] = null;
      teamData["team_description"] = startup[0].team_description;
      teamData["team_logo"] =
        startup[0].logo === undefined || startup[0].logo === "null"
          ? ""
          : startup[0].logo;
      teamData["team_name"] = startup[0].team_name;
      teamData["type"] = null;
      teamData["team_email"] = startup[0].team_email;
      teamData["team_phone"] = startup[0].team_phone;
      teamData["team_pitch"] = startup[0].team_pitch;
      teamData["year_founded"] = startup[0].year_founded;
      teamData["sector"] = startup[0].sector;
      teamData["socials"] = startup[0].socials;
      teamData["cover_page"] = startup[0].cover_page;
      teamData["video_url"] = startup[0].video_url;
      teamData["members"] = [
        {
          applicantId: startup[0].a_applicant_id,
          accepted: true,
          name: startup[0].a_first_name + " " + startup[0].a_last_name,
          profile_pic: startup[0].a_profile_pic,
          role: "creator",
          trainingTeamId: startup[0].team_id,
        },
        {
          applicantId: startup[0].b_applicant_id,
          accepted: true,
          name: startup[0].b_first_name + " " + startup[0].b_last_name,
          profile_pic: startup[0].b_profile_pic,
          role: "creator",
          trainingTeamId: startup[0].team_id,
        },
      ];
      teamData["createdAt"] = new Date();
      teamData["updatedAt"] = new Date();
    } else {
      startup = await db.sequelize.query(
        'SELECT "training_teams".*,training_teams.hub_id as applicant_hub,partner_hubs_info.name as applicant_hub_name FROM training_teams LEFT JOIN partner_hubs_info ON training_teams.hub_id=partner_hubs_info.partner_id WHERE "training_teams"."id"=:team_id',
        {
          replacements: {
            team_id: team_id,
          },
          type: QueryTypes.SELECT,
        }
      );

      const startupMembers = await db.sequelize.query(
        'SELECT * FROM training_team_members WHERE  training_team_members."trainingTeamId"=:team_id',
        {
          replacements: {
            team_id: team_id,
          },
          type: QueryTypes.SELECT,
        }
      );
      teamData["id"] = startup[0].id;
      teamData["creator_applicant_id"] = startup[0].applicantId;
      teamData["hub_id"] =
        startup[0].hub_id === undefined ? null : startup[0].hub_id;
      teamData["region"] =
        startup[0].region === undefined ? null : startup[0].region;
      teamData["team_description"] =
        startup[0].team_description === undefined
          ? null
          : startup[0].team_description;
      teamData["team_logo"] =
        startup[0].team_logo === undefined ? null : startup[0].team_logo;
      teamData["team_name"] =
        startup[0].team_name === undefined ? null : startup[0].team_name;
      teamData["type"] = startup[0].type === undefined ? null : startup[0].type;
      teamData["team_email"] =
        startup[0].team_email === undefined ? null : startup[0].team_email;
      teamData["team_phone"] =
        startup[0].team_phone === undefined ? null : startup[0].team_phone;
      teamData["team_pitch"] =
        startup[0].team_pitch === undefined ? null : startup[0].team_pitch;
      teamData["year_founded"] =
        startup[0].year_founded === undefined ? null : startup[0].year_founded;
      teamData["sector"] =
        startup[0].sector === undefined ? null : startup[0].sector;
      teamData["socials"] =
        startup[0].socials === undefined ? null : startup[0].socials;
      teamData["cover_page"] =
        startup[0].cover_page === undefined ? null : startup[0].cover_page;
      teamData["video_url"] =
        startup[0].video_url === undefined ? null : startup[0].video_url;
      teamData["members"] =
        startupMembers === undefined ? null : startupMembers;
      teamData["createdAt"] =
        startup[0].createdAt === undefined ? null : startup[0].createdAt;
      teamData["updatedAt"] =
        startup[0].updatedAt === undefined ? null : startup[0].updatedAt;
    }

    if (startup) {
      return res.status(200).json({
        message: "Get startup by team_id",
        data: teamData,
      });
    } else {
      return res.status(400).json({
        message: "Error getting startup profile",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const getStartUpsBySectorId = async (req, res) => {
  try {
    const { id } = req.params;
    let startups = await db.sequelize.query(
      `select c.first_name a_first_name,c.last_name a_last_name, d.first_name b_first_name,d.last_name b_last_name, f.base_program_id, g.profile_pic a_profile_pic,
      h.profile_pic b_profile_pic,
b.team_id team_id, b.name team_name, b.email team_email, b.phone team_phone, b.description team_description, b.pitch team_pitch, b.pitch team_pitch,b.year_founded,
e.category sector, b.socials socials, b.cover_page cover_page, b.logo logo, b.video_url video_url
   from (select student_a,student_b,team_id from teams UNION SELECT student_a,student_b,team_id FROM teams_pase) a
inner join startups b on a.team_id = b.team_id 
inner join applicants c on a.student_a = c.applicant_id 
inner join applicants d on a.student_b = d.applicant_id
inner join base_program_applications f on f.applicant_id = c.applicant_id
left join base_applicants_profile g on a.student_a = g.applicant_id
left join base_applicants_profile h on a.student_b = h.applicant_id
inner join startup_sectors e on e.id = b.sector where b.sector = ${id}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    startups = startups.map((e) => {
      return {
        program_id: e.base_program_id,
        socials: e.socials,
        team_pitch: e.team_pitch,
        team_id: e.team_id,
        team_name: e.team_name,
        team_email: e.team_email,
        team_phone: e.team_phone,
        team_description: e.team_description,
        year_founded: e.year_founded,
        sector: e.sector,
        cover_page: e.cover_page,
        logo: e.logo === undefined || e.logo === "null" ? "" : e.logo,
        video_url: e.video_url,
        team_members: [
          {
            applicantId: e.a_applicant_id,
            profile_pic: e.a_profile_pic,
            name: e.a_first_name + " " + e.a_last_name,
          },
          {
            applicantId: e.b_applicant_id,
            profile_pic: e.b_profile_pic,
            name: e.b_first_name + " " + e.b_last_name,
          },
        ],
      };
    });

    return res.status(200).json({
      message: "Get startup by sector_id",
      status: true,
      data: startups,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};

// Get all startups
const getStartUps = async (req, res) => {
  try {
    let startups = await db.sequelize.query(
      `select c.first_name a_first_name,c.last_name a_last_name, d.first_name b_first_name,d.last_name b_last_name, f.base_program_id, g.profile_pic a_profile_pic,
      h.profile_pic b_profile_pic, b.team_id team_id, b.name team_name, b.email team_email, b.phone team_phone, b.description team_description, b.pitch team_pitch, b.pitch team_pitch,b.year_founded,
e.category sector, b.socials socials, b.cover_page cover_page, b.logo logo, b.video_url video_url
   from (select student_a,student_b,team_id from teams UNION SELECT student_a,student_b,team_id FROM teams_pase) a
inner join startups b on a.team_id = b.team_id 
inner join applicants c on a.student_a = c.applicant_id 
inner join applicants d on a.student_b = d.applicant_id
inner join base_program_applications f on f.applicant_id = c.applicant_id
left join base_applicants_profile g on a.student_a = g.applicant_id
left join base_applicants_profile h on a.student_b = h.applicant_id
inner join startup_sectors e on e.id = b.sector `,
      {
        type: QueryTypes.SELECT,
      }
    );

    startups = startups.map((e) => {
      return {
        program_id: e.base_program_id,
        socials: e.socials,
        team_pitch: e.team_pitch,
        team_id: e.team_id,
        team_name: e.team_name,
        team_email: e.team_email,
        team_phone: e.team_phone,
        team_description: e.team_description,
        year_founded: e.year_founded,
        sector: e.sector,
        cover_page: e.cover_page,
        logo: e.logo === undefined || e.logo === "null" ? "" : e.logo,
        video_url: e.video_url,
        team_members: [
          {
            applicantId: e.a_applicant_id,
            profile_pic: e.a_profile_pic,
            name: e.a_first_name + " " + e.a_last_name,
          },
          {
            applicantId: e.b_applicant_id,
            profile_pic: e.b_profile_pic,
            name: e.b_first_name + " " + e.b_last_name,
          },
        ],
      };
    });

    return res.status(200).json({
      message: "All startups",
      status: true,
      data: startups,
    });
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};
/* GET statistics and sectors */
const getStatistics = async (req, res) => {
  try {
    const companies = await db.sequelize.query(
      `SELECT * FROM startups where team_id !='null'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const sectors = await db.sequelize.query(`SELECT * FROM startup_sectors`, {
      type: QueryTypes.SELECT,
    });

    // const result = await async.parallel({
    //     companies: async () => {
    //         return await db.sequelize.query(`SELECT * FROM startups where team_id !='null'`, {
    //             type: QueryTypes.SELECT
    //         });
    //     },
    //     categories: async () => {
    //         return await db.sequelize.query(`SELECT * startup_sectors`, {
    //             type: QueryTypes.SELECT
    //         });
    //     },
    // });
    return res.status(200).json({
      message: "Home page statistics and sectors",
      data: {
        companies: companies.length,
        no_of_founders: companies.length * 2,
        sectors: sectors,
        no_of_sectors: sectors.length,
      },
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const submitBaselineSurvey = async (req, res) => {
  try {
    const field = req.body;
    const year = field.year;
    const region = field.region;
    const hub = field.hub;
    const program = field.program;
    const medium = field.medium;
    const gender = field.gender;
    const education_experience = field.education_experience;
    const level_of_knowledge = field.level_of_knowledge;
    const rate_skills = field.rate_skills;
    const rate_entrepreneurial_skills = field.rate_entrepreneurial_skills;
    const is_committed = field.is_committed;
    const enough_resource = field.enough_resource;
    const business_model_canvas = field.business_model_canvas;
    const design_thinking = field.design_thinking;
    const marketing_branding = field.marketing_branding;
    const pitching = field.pitching;
    const name = field.name;
    const email = field.email;
    const age = field.age;
    const phone = field.phone;
    const name_of_startup = field.name_of_startup;
    const expertise = field.expertise;
    const occupation = field.occupation;
    const personal_goal_objective = field.personal_goal_objective;
    const startup_goal_objective = field.startup_goal_objective;
    const see_yourself = field.see_yourself;
    const see_startup = field.see_startup;
    const how_to_meet_goals = field.how_to_meet_goals;
    const impact_of_training = field.impact_of_training;
    const expectation_of_incubation = field.expectation_of_incubation;
    const gain_from_incubation = field.gain_from_incubation;
    const yes_enough_resource = field.yes_enough_resource;
    const no_enough_resource = field.no_enough_resource;
    const challenges = field.challenges;
    const applicant_id = field.applicant_id;

    const baselineSurvey = await IncubationBaselineSurvey.create({
      year,
      region,
      hub,
      program,
      medium,
      gender,
      education_experience,
      level_of_knowledge,
      rate_skills,
      rate_entrepreneurial_skills,
      is_committed,
      enough_resource,
      business_model_canvas,
      design_thinking,
      marketing_branding,
      pitching,
      name,
      email,
      age,
      phone,
      name_of_startup,
      expertise,
      occupation,
      personal_goal_objective,
      startup_goal_objective,
      see_yourself,
      see_startup,
      how_to_meet_goals,
      impact_of_training,
      expectation_of_incubation,
      gain_from_incubation,
      yes_enough_resource,
      no_enough_resource,
      challenges,
      applicant_id,
    });

    if (baselineSurvey) {
      return res.status(201).json({
        message: "Success",
        status: true,
        data: baselineSurvey,
      });
    } else {
      return res.status(400).json({
        message: "Error submitting baseline survey form",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const hasSubmittedBaselineSurvey = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const baselineSurvey = await IncubationBaselineSurvey.findOne({
      where: {
        applicant_id: applicantId,
      },
    });

    if (baselineSurvey) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data: baselineSurvey,
      });
    } else {
      return res.status(404).json({
        message: "No record found",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateStartupProfile = async (req, res) => {
  try {
    let updateTeam;
    const { team_id, program_id } = req.params;

    const fields = req.body;
    const team_name = fields.team_name;
    const team_email = fields.team_email;
    const team_phone = fields.team_phone;
    const team_description = fields.team_description;
    const team_pitch = fields.team_pitch;
    const team_sector = fields.team_sector;
    const socials = fields.socials;
    const cover_page = fields.cover_page;
    const team_logo = fields.team_logo;
    const video_url = fields.video_url;
    const year_founded = fields.year_founded;

    if (
      program_id === null ||
      program_id === undefined ||
      program_id === "" ||
      program_id === "null" ||
      program_id < 5
    ) {
      const getTeam = await db.sequelize.query(
        "SELECT * FROM startups WHERE team_id=:team_id LIMIT 1",
        {
          type: QueryTypes.SELECT,
          replacements: {
            team_id: team_id,
          },
        }
      );

      updateTeam = await db.sequelize.query(
        "UPDATE startups SET name=:team_name,email=:team_email,phone=:team_phone,description=:team_description,pitch=:team_pitch,sector=:team_sector,socials=:socials,cover_page=:cover_page,logo=:team_logo,video_url=:video_url,year_founded=:year_founded WHERE team_id=:team_id",
        {
          type: QueryTypes.UPDATE,
          replacements: {
            team_id: team_id,
            team_name:
              team_name === null || team_name === undefined
                ? getTeam[0].name
                : team_name,
            team_email:
              team_email === null || team_email === undefined
                ? getTeam[0].email
                : team_email,
            team_phone:
              team_phone === null || team_phone === undefined
                ? getTeam[0].phone
                : team_phone,
            team_description:
              team_description === null || team_description === undefined
                ? getTeam[0].description
                : team_description,
            team_pitch:
              team_pitch === null || team_pitch === undefined
                ? getTeam[0].pitch
                : team_pitch,
            team_sector:
              team_sector === null || team_sector === undefined
                ? getTeam[0].sector
                : team_sector,
            socials:
              socials === null || socials === undefined
                ? JSON.stringify(getTeam[0].socials)
                : JSON.stringify(socials),
            cover_page:
              cover_page === null || cover_page === undefined
                ? getTeam[0].cover_page
                : cover_page,
            team_logo:
              team_logo === null || team_logo === undefined
                ? getTeam[0].logo
                : team_logo,
            video_url:
              video_url === null || video_url === undefined
                ? getTeam[0].video_url
                : video_url,
            year_founded:
              year_founded === null || year_founded === undefined
                ? getTeam[0].year_founded
                : year_founded,
          },
        }
      );
    } else {
      const getTeam = await db.sequelize.query(
        "SELECT * FROM training_teams WHERE id=:team_id LIMIT 1",
        {
          type: QueryTypes.SELECT,
          replacements: {
            team_id: team_id,
          },
        }
      );

      updateTeam = await await db.sequelize.query(
        "UPDATE training_teams SET team_name=:team_name,team_email=:team_email,team_phone=:team_phone,team_description=:team_description,team_pitch=:team_pitch,sector=:team_sector,socials=:socials,cover_page=:cover_page,team_logo=:team_logo,video_url=:video_url,year_founded=:year_founded WHERE id=:team_id",
        {
          type: QueryTypes.UPDATE,
          replacements: {
            team_id: team_id,
            team_name:
              team_name === null || team_name === undefined
                ? getTeam[0].team_name
                : team_name,
            team_email:
              team_email === null || team_email === undefined
                ? getTeam[0].team_email
                : team_email,
            team_phone:
              team_phone === null || team_phone === undefined
                ? getTeam[0].team_phone
                : team_phone,
            team_description:
              team_description === null || team_description === undefined
                ? getTeam[0].team_description
                : team_description,
            team_pitch:
              team_pitch === null || team_pitch === undefined
                ? getTeam[0].team_pitch
                : team_pitch,
            team_sector:
              team_sector === null || team_sector === undefined
                ? getTeam[0].sector
                : team_sector,
            socials:
              socials === null || socials === undefined
                ? JSON.stringify(getTeam[0].socials)
                : JSON.stringify(socials),
            cover_page:
              cover_page === null || cover_page === undefined
                ? getTeam[0].cover_page
                : cover_page,
            team_logo:
              team_logo === null || team_logo === undefined
                ? getTeam[0].team_logo
                : team_logo,
            video_url:
              video_url === null || video_url === undefined
                ? getTeam[0].video_url
                : video_url,
            year_founded:
              year_founded === null || year_founded === undefined
                ? getTeam[0].year_founded
                : year_founded,
          },
        }
      );
    }

    if (updateTeam) {
      return res.status(200).json({
        message: "Success",
        status: true,
      });
    } else {
      return res.status(400).json({
        message: "Error update profile",
        status: false,
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e.message,
    });
  }
};

const hasAcceptedTerms = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const getApplicantInfo = await await db.sequelize.query(
      "SELECT incubation_terms_accepted FROM applicants WHERE applicant_id=:applicantId",
      {
        type: QueryTypes.SELECT,
        replacements: {
          applicantId: applicantId,
        },
      }
    );

    if (getApplicantInfo) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data:
          getApplicantInfo[0].incubation_terms_accepted === null
            ? {
                incubation_terms_accepted: false,
              }
            : getApplicantInfo[0],
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateAcceptedTerms = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const updateApplicantInfo = await await db.sequelize.query(
      "UPDATE applicants SET incubation_terms_accepted=true WHERE applicant_id=:applicantId",
      {
        type: QueryTypes.SELECT,
        replacements: {
          applicantId: applicantId,
        },
      }
    );

    if (updateApplicantInfo) {
      return res.status(200).json({
        message: "Success",
        status: true,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllTrainingSession = async (req, res) => {
  try {
    const { teamId } = req.params;

    const trainingEvaluation = await await db.sequelize.query(
      `select * from incubation_training_evaluation where startup_id=:teamId order by id DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          teamId: teamId,
        },
      }
    );

    if (trainingEvaluation) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data: trainingEvaluation,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getMentoringEvaluationsByMentorName = async (req, res) => {
  try {
    const { mentorName } = req.params;

    const evaluations = await db.sequelize.query(
      `select * from mentoring_evaluation where name_of_mentor=${mentorName} and mentor_easily_accessible='Yes'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (evaluations) {
      return res.status(200).json({
        status: true,
        message: "List of mentors evaluations.",
        data: evaluations,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Could not get list of mentors evaluations",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllMenitoring = async (req, res) => {
  try {
    const { teamId } = req.params;

    const mentoringEvaluation = await await db.sequelize.query(
      `select a.team_id team_id,b.*
    from (select student_a,student_b,team_id from teams UNION SELECT student_a,student_b,team_id FROM teams_pase) a
           left join mentoring_evaluation b on a.student_a = b.applicant_id
           left join mentoring_evaluation c on a.student_b = b.applicant_id
   where a.team_id=:teamId order by id DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          teamId: teamId,
        },
      }
    );

    if (mentoringEvaluation) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data: mentoringEvaluation,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllWeeklyPeerReview = async (req, res) => {
  try {
    const { teamId } = req.params;

    const weeklyPeerReview = await await db.sequelize.query(
      `select a.team_id team_id,b.*
    from (select student_a,student_b,team_id from teams UNION SELECT student_a,student_b,team_id FROM teams_pase) a
           left join weekly_peer_review b on a.student_a = b.applicant_id
           left join weekly_peer_review c on a.student_b = b.applicant_id
   where a.team_id=:teamId order by id DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          teamId: teamId,
        },
      }
    );

    if (weeklyPeerReview) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data: weeklyPeerReview,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllTraction = async (req, res) => {
  try {
    const { teamId } = req.params;

    const tractionEvaluation = await await db.sequelize.query(
      `select * from incubatee_tractions where team_id=:teamId order by "createdAt" DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          teamId: teamId,
        },
      }
    );

    if (tractionEvaluation) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data: tractionEvaluation,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getAllProgressReport = async (req, res) => {
  try {
    const { teamId } = req.params;

    const progressReport = await await db.sequelize.query(
      `select * from incubation_progress_report where team_id=:teamId order by created_at DESC`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          teamId: teamId,
        },
      }
    );

    if (progressReport) {
      return res.status(200).json({
        message: "Success",
        status: true,
        data: progressReport,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


const getAttendance = async (req, res) => {
  try {
    const { teamId } = req.params;

    const tractionEvaluation = await await db.sequelize.query(
      `select a.applicant_id,a.first_name,a.last_name, a.email_address, e.name as hub_name from applicants a
      inner join base_program_applications c on a.applicant_id = c.applicant_id
      inner join "attendanceLogs" f on a.applicant_id = f.applicant_id
      inner join partner_hubs_info e on e.partner_id = c.allocated_hub
      where c.base_program_id = 5 and a.is_intern=true and f.clock_in_time >= '2021-07-12'`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          teamId: teamId,
        },
      }
    );
    let data=[]

    for (const item of tractionEvaluation) {
  
     let found = data.find((e)=>{
          if(item['applicant_id']===e['applicant_id']){
            return e;
          }
      })
      if(found){
        data[data.indexOf(found)]['count']=data[data.indexOf(found)]['count']+1
      }else{
        data.push({
          first_name: item['first_name'],
          last_name: item['last_name'],
          applicant_id:item['applicant_id'],
          hub_name:item['hub_name'],
          count:1
        })
      }
    }

    if (tractionEvaluation) {

      return res.status(200).json({
        message: "Success",
        status: true,
        data: data,
      });
    } else {
      return res.status(400).json({
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStatistics,
  getStartUps,
  getStartUpsBySectorId,
  getStartUpsByTeamId,
  submitBaselineSurvey,
  hasSubmittedBaselineSurvey,
  updateStartupProfile,
  hasAcceptedTerms,
  updateAcceptedTerms,
  getAllTrainingSession,
  getAllMenitoring,
  getAllWeeklyPeerReview,
  getAllTraction,
  getAllProgressReport,
  getAttendance,
  getMentoringEvaluationsByMentorName,
};
