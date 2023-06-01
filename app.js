/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const multer = require('multer');
const jimp = require("jimp");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//setup multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images/icons');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });

// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

// Setup routes
app.use(require("./routes/application-routes.js"));
//add authentication routes by hly
const appRouter = require("./routes/authenticate-routes.js");
app.use(appRouter);
// api routes
app.use(require("./routes/api-routes.js"));

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});


