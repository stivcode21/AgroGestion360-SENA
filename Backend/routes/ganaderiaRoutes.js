const express = require("express");
const ganaderia = require("../controllers/ganaderiaController");


const router = express.Router();

router.get("/list/:page",ganaderia.listGanaderia);
router.get("/getganaderia/:id",ganaderia.getGanaderia);
router.get("/:id/vacunas", ganaderia.listVacunasByAnimal);
router.post("/createganaderia",ganaderia.createGanaderia);
router.post("/sell/:id", ganaderia.sellGanaderia);
router.put("/editganaderia/:id",ganaderia.editGanaderia);
router.delete("/deleteganaderia/:id",ganaderia.deleteGanaderia);
router.get("/filter/:page", ganaderia.filterGanaderiaPaginated);

module.exports = router;
