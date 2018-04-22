module.exports = (name)=>{
	return(
`const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');

app.use(session({ secret: 'superSecret${name}',resave: true, saveUninitialized:true}));

// Configure body parser for AJAX requests
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// Serve up static assets
app.use(express.static("client/build"));

// Add routes, both API and view(your react app)
const routes = require("./routes")();
app.use('/',routes);

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
//add mongo heroku uri
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/${name}-development"
);

// Start the API server
app.listen(PORT, function() {
  console.log("🌎  ==> API Server now listening");
});`)
};
