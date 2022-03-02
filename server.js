const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

const routes = require("./routes/index");

app.use(express.json());
app.use(logger("dev"));
app.use(cors());

app.use("/api/v1", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
