module.exports = `module.exports = function () {
	const path = require("path");
	const router = require('express').Router();

	//the pre-built api file exports a function.  be sure that you call it when you use require("./path")() <---


	router.use("/api",require("./apiRoutes.js")());
	//add more routes here

	// If no API routes are hit, send the React app
	router.use(function(req, res) {
	  res.sendFile(path.join(__dirname, "../client/build/index.html"));
	});

	return router;
};`;
