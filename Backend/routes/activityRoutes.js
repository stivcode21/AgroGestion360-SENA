const express = require("express");
const activity = require("../controllers/activityController");
const { verifyToken } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/list/:page", verifyToken, activity.listActivities);
router.get("/getactivity/:id", verifyToken, activity.getActivity);
router.post("/createactivity", verifyToken, activity.createActivity);
router.put("/editactivity/:id", verifyToken, activity.editActivity);
router.delete("/deleteactivity/:id", verifyToken, activity.deleteActivity);
router.get("/filter/:page", verifyToken, activity.filterActivitiesPaginated);

module.exports = router;
