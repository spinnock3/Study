var convict = require("convict");
convict.addFormat(require('convict-format-with-validator').ipaddress);

// Define a schema
var config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_env"
    },
    ip: {
        doc: "The IP address to bind.",
        format: "ipaddress",
        default: "127.0.0.1",
        env: "IP_ADDRESS",
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 3000,
        env: "PORT",
        arg: "port"
    },

    EMAIL_TO: {
        doc: "Email addresses for error emails.",
        format: "String",
        default: "spinnock3@gatech.edu",
        env: "EMAIL_TO"
    },

    DB_CONN: "DB_CONN",

    uploads_folder: "uploads_folder",

    email_env: {
        doc: "Environment string for email subjects",
        default: ""
    },

    http_err_status_codes: {
        doc: "HTTP status codes for 400 and 500 errors",
        default: [400, 401, 403, 404, 409, 500, 502, 504, 503]
    },

    phone_number_regex: {
        doc: "Regular expression for phone number validation",
        default: /\(\d{3}\)\s\d{3}-\d{4}/
    },

    user_roles: {
        doc: "Application user roles",
        default: ['student', 'teacher', 'admin']
    },

    profile_colors: {
        default: [
            "#ca2c92 ",
            "#4B8B9B",
            "#B7C42F",
            "#0080FF",
            "#AD4025",
            "#EAAA00",
        ]
    }
});



// Load environment dependent configuration
var env = config.get("env");
config.loadFile("./config/" + env + ".json");

// Perform validation
config.validate({ allowed: "strict" });

module.exports = config;