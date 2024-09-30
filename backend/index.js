const express = require("express");
const bodyParser = require("body-parser");
const companyRouter = require('./Routes/company')
const authRouter = require('./Routes/auth')
const voterRouter = require('./Routes/voter')
const app = express();
const dotenv = require('dotenv')
dotenv.config()
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/Routes/company", companyRouter);
app.use("/Routes/voters", voterRouter);
app.use("/Routes/auth", authRouter);

const PORT = process.env.PORT || 4000;

// Start the backend
app.listen(PORT, () => {
  console.log("Backend server running on port " + PORT);
});
