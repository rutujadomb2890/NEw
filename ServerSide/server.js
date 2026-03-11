const express = require("express");
const cors = require("cors");
// const dotenv = require("dotenv");
const connectDB = require("./config/db");

// dotenv.config();
connectDB();

const app = express();

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

app.use("/api/", require("./routes/authRoutes"));
app.use("/api/", require("./routes/courseRoutes"));
app.use("/api/", require("./routes/lessonRoutes"));
app.use("/api/", require("./routes/enrolllementRoutes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});