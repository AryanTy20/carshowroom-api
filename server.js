// imports
import express from "express";
import path from "path";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
global.APP_ROOT = path.resolve(__dirname);

// Helper Import
import routes from "./routes";
import dbConnect from "./dbConnect";
import { ErrorHandler } from "./middleware";
import { APP_PORT } from "./config";

//DB_Connection
dbConnect();

// middlewares

// ports
const PORT = process.env.PORT || APP_PORT;
global.APP_port = PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// routes
app.get("/", (req, res) => {
  res.json({ message: "This is an API server" });
});
app.use("/api", routes);

//Error Handler
app.use(ErrorHandler);
