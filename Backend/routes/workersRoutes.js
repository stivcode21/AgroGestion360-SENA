const express = require("express");
const workers = require("../controllers/workersController");

const router = express.Router();

router.get("/list/:page", workers.listWorkers);
router.get("/getworker/:id", workers.getWorkersById);
router.post("/register", workers.registerWorkers);
router.put("/edit/:id", workers.editWorkers);
router.delete("/delete/:id", workers.deleteWorkers);
router.get("/filter/:page", workers.filterWorkersPaginated);

module.exports = router;