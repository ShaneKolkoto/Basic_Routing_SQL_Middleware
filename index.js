const express = require("express");
const userRoute = require("./routes/user.routes");
const Cors = require("cors");
require("dotenv");

const app = express();
app.set("port", process.env.PORT);
app.use(express.json());
app.use(Cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
