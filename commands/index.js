const logic = require("../logic");
const colors = require("../constants.js");


const createWithPassport = (name)=>{
	logic.addFolders(name)
	.then(()=>logic.createReactApp(name))
	.then(()=>logic.installPackages(name))
	.then(()=>logic.addComponents(name))
	.then(()=>logic.editApp(name))
	.then(()=>{
		logic.makeServer(name);
		logic.addScripts(name);
		logic.configPassport(name);
		logic.makeRoutes(name);
		return logic.serverLogic(name);
	}).then(()=>{
		console.log(colors.CYAN);
		console.log(colors.BRIGHT);
		console.log(`All done! You can run 'cd ${name}/' and 'yarn start' to see your App in action.`);
	}).catch((err)=>{
		if(err) {
			console.log(colors.RED);
			console.log(err.message);
		};
	});
}


module.exports = {
	createWithPassport
};