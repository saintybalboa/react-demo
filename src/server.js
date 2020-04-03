import express from "express";
import compression from "compression";
import routes from "./routes/index";
import path from "path";

// Server var
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(compression());
app.use(express.static(__dirname + "/public"));

//Routes
app.use(routes);

const port = process.env.PORT || 3000;
const host = 'localhost';

// Start the server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
