#!/usr/bin/env node

const program = require("commander");
const {createWithPassport} = require("./commands");

program
	.version("1.1.0")
	.description("Builds a MERN stack MVC folder structure");

program
	.command("create <name>")
	.alias("c")
	.description("Build a folder structure")
	.action((name)=>{
		createWithPassport(name);
	});



program.parse(process.argv);