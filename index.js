#!/usr/bin/env node

const program = require("commander");
const {create} = require("./commands");
const pkg = require('./package.json');

program
	.version(pkg.version)
	.description("Builds a MERN stack MVC folder structure");

program
	.command("create <name>")
	.alias("c")
	.description("\tCreates a full stack MERN application with the given name." +
	"\n\tBe aware of using generic app names, as the database will be created using the name given."+
	"\n\tYou can always adjust this after creation in '/server.js'.")
	.option("-x, --no-passport", "Builds the app without passport authentication")
	.action((name, cmd)=>{
		const options = {
			noPassport : !cmd.passport
		};

		create(name, options);

	});

//other options to add...
// -r | no-react(for when the user has a premade react app)
// -s | simple-routes (routes files are created as simple exports, rather than functions)
// -n | no-npm (skips npm install, for quicker creation on slow connections. Still writes to package.json)

program.parse(process.argv);
