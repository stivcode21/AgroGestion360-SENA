require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const activityRoutes = require("./routes/activityRoutes");
const workersRoutes = require("./routes/workersRoutes");
const consumptionRoutes = require("./routes/consumptionRoutes");
const imageRoutes = require("./routes/imageRoutes");
const reportRoutes = require("./routes/reportRoutes");
const requestRoutes = require("./routes/requestRoutes");
const ganaderiaRoutes = require("./routes/ganaderiaRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const app = express();
const isProd = process.env.NODE_ENV === "production";

// Trust proxy so secure cookies work behind Render/HTTPS proxies
app.set("trust proxy", 1);

// Middleware global
if (!isProd) {
  app.use(cors(corsOptions)); // Permite peticiones desde el frontend solo en local
}

app.use(express.json()); // Permite recibir JSON en el body
app.use(cookieParser());

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/consumption", consumptionRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/workers", workersRoutes);
app.use("/api/ganaderia", ganaderiaRoutes);
app.use("/api/statistics", statisticsRoutes);

module.exports = app;
