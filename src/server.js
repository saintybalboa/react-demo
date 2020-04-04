import express from "express";
import compression from "compression";
<<<<<<< HEAD
import routes from "./routes/index";
=======
import index from "./routes/index";
>>>>>>> dc30f591dceae3d7638fbf421dc4c6ed5397f296
import path from "path";

// Server var
const app = express();

// View engine setup
<<<<<<< HEAD
app.set("views", path.join(__dirname, "views"));
=======
app.set("views", path.join(__dirname,"views"));
>>>>>>> dc30f591dceae3d7638fbf421dc4c6ed5397f296
app.set("view engine", "ejs");

// Middleware
app.use(compression());
<<<<<<< HEAD
app.use(express.static(__dirname + "/public"));

//Routes
app.use(routes);

const port = process.env.PORT || 3000;
const host = 'localhost';

// Start the server
const server = app.listen(port, host);
server.on('listening', () => console.log(`Server started at http://${host}:${port}`));
=======
console.log(__dirname);
app.use(express.static(__dirname + "/public"));

//Routes
app.use("/", index);

const port = process.env.PORT || 3000;

app.listen(port, function listenHandler() {
    console.info(`Running on ${port}`)
});
>>>>>>> dc30f591dceae3d7638fbf421dc4c6ed5397f296
