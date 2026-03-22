const express = require("express");
const activity = require("../controllers/activityController");

const router = express.Router();

router.get("/list/:page", activity.listActivities);
router.get("/getactivity/:id", activity.getActivity);
router.post("/createactivity", activity.createActivity);
router.put("/editactivity/:id", activity.editActivity);
router.delete("/deleteactivity/:id", activity.deleteActivity);

//GET /filter/1?tipo=2&orden=recientes
router.get("/filter/:page", activity.filterActivitiesPaginated);

module.exports = router;
