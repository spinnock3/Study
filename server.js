//Load environment file if the environment is not PROD
if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "production") {
    console.log("Using secure encrypted env");
    let secureEnv = require("secure-env");
    global.env = secureEnv({
        secret: "youwillneverfindoutthresecretitisfartoocomplex!!!",
    });
}
//Load encrypted env file, if environment is not devl
else {
    console.log("Using non-secure default env");
    env = require("dotenv").config();
    global.env = env.parsed;
}

const config = require("./config.js");
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

//Function that ensures that port is a valid number
const normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

//If error occurs, log error
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
    console.log("Listening on " + bind);
};

//const port = normalizePort(config.get("port") || "3000");
const port = normalizePort("3000");
app.set("port", port);

const server = http
    .createServer(app, function (req, res) {
        res.writeHead(200);
        res.end();
    })
    .listen(app.get("port"));
server.on("error", onError);
server.on("listening", onListening);

module.exports = server;
