const colors = require("../constants.js");
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');


const create = (name, options)=>{
	const logic = require("../logic")(options);
	logic.addFolders(name, options)
		.then(()=>logic.createReactApp(name, options))
		.then(()=>logic.installPackages(name, options))
		.then(()=>logic.addComponents(name, options))
		.then(()=>logic.editApp(name, options))
		.then(()=>{
			logic.makeServer(name, options);
			logic.addScripts(name, options);
			if(options.noPassport) {
				logic.makeModels(name, options);
			} else {
				logic.configPassport(name, options);
			}

			logic.makeRoutes(name, options);
			return logic.serverLogic(name, options);
		})
		.then(()=>{
			console.log(colors.CYAN);
			console.log(colors.BRIGHT);
			console.log(`All done! You can run 'cd ${name}/' and 'yarn start' to see your App in action.`);
			console.log(colors.RESET);
			updateNotifier({pkg,isGlobal:true}).notify();
		})
		.catch((err)=>{
			if(err) {
				console.log(colors.RED);
				console.log(err.message);
				console.log(colors.RESET);
			};
		});
}

// const createWithoutPassport = (name, options) => {
// 	logic.addFolders(name, options)
// 	.then(()=>logic.createReactApp(name, options))
// 	.then(()=>logic.installPackages(name, options))
// 	.then(()=>logic.addComponents(name, options))
// 	.then(()=>logic.editApp(name, options))
// 	.then(()=>{
// 		logic.makeServer(name, options);
// 		logic.addScripts(name, options);
//
// 		logic.makeRoutes(name, options);
// 		return logic.serverLogic(name, options);
// 	}).then(()=>{
// 		console.log(colors.CYAN);
// 		console.log(colors.BRIGHT);
// 		console.log(`All done! You can run 'cd ${name}/' and 'yarn start' to see your App in action.`);
// 		console.log(colors.RESET);
// 		updateNotifier({pkg}).notify();
// 	}).catch((err)=>{
// 		if(err) {
// 			console.log(colors.RED);
// 			console.log(err.message);
// 			console.log(colors.RESET);
// 		};
// 	});
// }


module.exports = {
	create
	// createWithoutPassport
};
