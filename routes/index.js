const {
    Router
} = require("express");
const router = Router();
const controllers = require("../controllers");
const partnerAuthController = require("../controllers/partnerAuthController");
const mentorsController = require("../controllers/mentors");
const appointmentsController = require("../controllers/appointments");

router.get("/", (req, res) => res.send("Getting started..."));
router.get("/statistics", controllers.getStatistics);
router.get("/startups", controllers.getStartUps);
router.get("/sector/:id/startups", controllers.getStartUpsBySectorId);
router.get("/startup/:team_id/program/:program_id", controllers.getStartUpsByTeamId);
router.post("/submitBaselineSurvey", controllers.submitBaselineSurvey);
router.get("/hasSubmittedBaselineSurvey/:applicantId", controllers.hasSubmittedBaselineSurvey);
router.put("/updateStartupProfile/:team_id/program/:program_id", controllers.updateStartupProfile);
router.get("/hasAcceptedTerms/:applicantId", controllers.hasAcceptedTerms);
router.put("/updateAcceptedTerms/:applicantId", controllers.updateAcceptedTerms);
router.get("/getAllWeeklyPeerReview/:teamId", controllers.getAllWeeklyPeerReview);
router.get("/getAllMenitoring/:teamId", controllers.getAllMenitoring);
router.get("/getAllTraction/:teamId", controllers.getAllTraction);
router.get("/getAllTrainingSession/:teamId", controllers.getAllTrainingSession);
router.get("/getAllProgressReport/:teamId", controllers.getAllProgressReport);
router.get("/getMentoringEvaluations/:mentorName", controllers.getMentoringEvaluationsByMentorName)

router.get("/getInternAttendance", controllers.getAttendance);

router.post("/register-partner", partnerAuthController.registerPartner);
router.post("/login-partner", partnerAuthController.loginPartner);

// mentors routes
router.put("/mentors-profile/update/:id", mentorsController.updateMentor);
router.put("/mentors-profile/change-password", mentorsController.changePassword);
router.get("/mentors-profile/:id", mentorsController.getMentor);
router.get("/mentors-profile/by-hub/:id", mentorsController.getMentorByHubId);
router.get("/mentors-profile", mentorsController.getAllMentors);
router.put("/update-mentor-agreement/:mentor_id", mentorsController.updateAgreement);

router.post("/verify-email", mentorsController.verifyEmail);
router.post("/reset-password", mentorsController.resetPassword);

//appointments routes
router.post("/mentors_appointment", appointmentsController.createAppointment);
router.get("/mentors_appointment/by-mentor/:id", appointmentsController.getMentorAppointmentsById);
router.get("/mentors-appointment/by-startup/:id", appointmentsController.getMentorAppointmentsByStartupId)
router.get("/assigned-tasks/:id", appointmentsController.getAllTasksByStartupId)
router.put("/mentors_appointment/reschedule/:id", appointmentsController.rescheduleAppointment);

module.exports = router;