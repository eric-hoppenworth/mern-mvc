module.exports = (options) => {
	const fs = require("fs");
	const os = require("os");
	const path = require("path");
	const {exec} = require("child_process");
	const {spawn} = require("superspawn");
	const install = require("spawn-npm-install");

	const files = options.noPassport ? {
		serverString : 		require(path.join(__dirname, "..", "dataNoPassport", "serverText.js")),
		personModelText : 	require(path.join(__dirname, "..", "dataNoPassport", 'modelText.js')),
		routeText : 		require(path.join(__dirname, "..", "dataNoPassport", 'routeText.js')),
		apiText : 			require(path.join(__dirname, "..", "dataNoPassport", 'apiText.js')),
		appText : 			require(path.join(__dirname, "..", "dataNoPassport", 'appText.js')),
		reactIndexText : 	require(path.join(__dirname, "..", "dataNoPassport", 'reactIndexText.js')),
		splashText : 		require(path.join(__dirname, "..", "dataNoPassport", 'SplashText.js')),
		homeText : 			require(path.join(__dirname, "..", "dataNoPassport", 'HomeText.js'))
	} :
	{
		serverString : 		require(path.join(__dirname, "..", "data", "serverText.js")),
		passportText : 		require(path.join(__dirname, "..", "data", 'passportText.js')),
		userModelText : 	require(path.join(__dirname, "..", "data", 'modelText.js')),
		authText : 			require(path.join(__dirname, "..", "data", 'authText.js')),
		routeText : 		require(path.join(__dirname, "..", "data", 'routeText.js')),
		apiText : 			require(path.join(__dirname, "..", "data", 'apiText.js')),
		appText : 			require(path.join(__dirname, "..", "data", 'appText.js')),
		reactIndexText : 	require(path.join(__dirname, "..", "data", 'reactIndexText.js')),
		signInText : 		require(path.join(__dirname, "..", "data", 'SignInText.js')),
		signUpText : 		require(path.join(__dirname, "..", "data", 'SignUpText.js')),
		homeText : 			require(path.join(__dirname, "..", "data", 'HomeText.js'))
	};


	const colors = require(path.join(__dirname,"../constants.js"));

	const log = (msg)=>{
		console.log(colors.MAGENTA,colors.BRIGHT);
		console.log(msg);
		console.log(colors.RESET);
	};

	const createReactApp = (name, options) => {
		return new Promise((resolve,reject)=>{
			log("Creating React App");

			let proc = spawn(
				path.join(__dirname,`../node_modules/.bin/create-react-app${os.platform() === 'win32' ? '.cmd' : ''}`),
				['client'],{ stdio:'inherit',cwd:`./${name}` }
			);

			proc.then((stdout)=>{
				log("React app created!");
				resolve();
			}).catch((err)=>{
				if(err) throw err;
			});
		});
	};

	const addFolders = (name, options) => {
		return new Promise((resolve,reject)=>{
			log("Creating Folders....");
			//make sure the name is a valid npm package name
			const reg = /[^a-z0-9\-]/g
			if(name.match(reg)){
				return reject({message:"Be sure that your folder name contains only lowercase, numbers, or '-'."});
			}
			let folderList = options.noPassport ?
				`controllers models routes scripts` :
				`config controllers models routes scripts`;

			exec(`mkdir ${name}`,(err,stdout,stderr)=>{
				exec(`mkdir ${folderList}`,{cwd:`./${name}`},(err,stdout,stderr)=>{
					if(err) reject(err);
					log("Done with Folders");
					resolve(stdout);
				});
			});
		});
	};

	const makeServer = (name, options) => {
		log("Writing server.js...");
		return new Promise((resolve,reject)=>{
			fs.writeFile(`./${name}/server.js`,files.serverString(name),function(){
				log("Server Written");
				resolve();
			});
		});
	};

	const installPackages = (name, options) => {
		log("Installing Packages...this may take a moment...");
		return new Promise((resolve,reject)=>{
			exec("npm init --yes",{ cwd: `./${name}` },()=>{
				const packageList = options.noPassport ?
					["express","express-session","mongoose"] :
					["express","express-session","mongoose","passport","passport-local","passport-local-mongoose"];

				let packages = install(packageList,
					{ stdio: 'inherit',cwd: `./${name}` }
				);

				packages.on("exit",()=>{
					log("Packages Done");
					log("Installing Dev-dependencies...");
					let dev = install(["jest","concurrently","nodemon"],{saveDev:true,stdio:"inherit",cwd:`./${name}`});

					dev.on("exit",()=>{
						log("Dev-dependencies Done");
						log("Installing React Packages...");
						log("Sorry, you won't get a lot of feedback during this step...just be patient");
						exec("yarn add react-router-dom axios",{cwd:`./${name}/client`},(err, stdout,stderr)=>{
							if(err) reject(err);
							console.log(stdout);
							log("React Done");
							resolve();
						});
					});
				});
			});
		});
	};

	const addScripts = (name,options) => {
		let count = 0;
		log("writing Scripts");
		fs.writeFile(`./${name}/scripts/build.js`,
	`const args = ["run build"];
const opts = { stdio: "inherit", cwd: "client", shell: true };
require("child_process").spawn("npm", args, opts);
`
			,function(){
			count++;
			if(count === 2){
				log("Scripts Done");
			}
		});
		fs.writeFile(`./${name}/scripts/start-client.js`,
	`const args = ["start"];
const opts = { stdio: "inherit", cwd: "client", shell: true };
require("child_process").spawn("npm", args, opts);
`
			,function(){
			count++;
			if(count === 2){
				log("Scripts Done");
			}
		});
	};

	const configPassport = (name,options) =>{
		log("Configuring Passport...");
		let count = 0;
		fs.writeFile(`./${name}/config/passport.js`,files.passportText,function(err, data){
			count++;
			if(count === 3){
				log("Passport Done");
			}
		});
		fs.writeFile(`./${name}/models/index.js`,
	`module.exports = {
	User:require("./User.js")
}
//add more models as you create them
`,function(err, data){
			count++;
			if(count === 3){
				log("Passport Done");
			}
		});
		fs.writeFile(`./${name}/models/User.js`,files.userModelText,function(err, data){
			count++;
			if(count === 3){
				log("Passport Done");
			}
		});
	};

	//this is currently used as a replacement for "config passport" when noPassport = true;
	const makeModels = (name, options) => {
		log("Writing Models...");
		let count = 0;
		fs.writeFile(`./${name}/models/index.js`,
	`module.exports = {
	Person:require("./Person.js")
}
//add more models as you create them`,function(err, data){
			count++;
			if(count === 2){
				log("Models Done");
			}
		});
		fs.writeFile(`./${name}/models/Person.js`,files.personModelText,function(err, data){
			count++;
			if(count === 2){
				log("Models Done");
			}
		});
	};

	const makeRoutes = (name,options) =>{
		let count = 0;
		let max = options.noPassport ? 2 : 3;
		log("Adding Routes");
		const filePath = `./${name}/routes/`;
		fs.writeFile(filePath + "index.js",files.routeText,function(err, data){
			count++;
			if(count === max){
				log("Routes Done");
			}
		});

		if(!options.noPassport) {
			fs.writeFile(filePath + "authRoutes.js",files.authText,function(err, data){
				count++;
				if(count === max){
					log("Routes Done");
				}
			});
		}

		fs.writeFile(filePath + "apiRoutes.js",files.apiText,function(err, data){
			count++;
			if(count === max){
				log("Routes Done");
			}
		});
	}

	const serverLogic = (name, options) =>{
		return new Promise((resolve,reject)=>{
			let count = 0;
			log("Setting Up Enviornment")
			//procfile
			fs.writeFile(`./${name}/Procfile`,`web: npm run server`,function(err, data){
				count++;
				if(count === 4){
					log("Enviornment Done");
					resolve();
				}
			});
			//nodemon.js
			fs.writeFile(`./${name}/nodemon.json`,
				JSON.stringify({
					ignore: ["client/*"]
				},null,2),
				function(data,err){
				count++;
				if(count === 4){
					log("Enviornment Done");
					resolve();
				}
			});
			//edit package.json
			fs.readFile(`./${name}/package.json`,"utf8",function(err, data){
				const scripts =  {
				    "server": "node server.js",
				    "client": "node scripts/start-client.js",
				    "start": "concurrently \"nodemon server.js\" \"npm run client\"",
				    "build": "node scripts/build.js",
				    "seed": "node scripts/seedDB.js",
				    "test": "jest"
				};
				data = JSON.parse(data);
				data.scripts = scripts
				data.name = name;
				fs.writeFile(`./${name}/package.json`,JSON.stringify(data,null,2),function(err,data){
					count++;
					if(count === 4){
						log("Enviornment Done");
						resolve();
					}
				})
			});
			//edit react package.json to add proxy
			fs.readFile(`./${name}/client/package.json`,"utf8",function(err,data){
				data = JSON.parse(data);
				data.proxy = "http://localhost:3001/";
				fs.writeFile(`./${name}/client/package.json`,JSON.stringify(data,null,2),function(err,data){
					count++;
					if(count === 4){
						log("Enviornment Done");
						resolve();
					}
				})
			})
		});
	}


	const addComponents = (name, options) =>{
		//add some signin/signup components
		const filePath = `./${name}/client/src/components/`;
		return new Promise(function(resolve,reject){
			log("Creating Components...");
			exec("mkdir components",{cwd:`./${name}/client/src`},(err,stdout,stderr)=>{
				if(!options.noPassport) {
					exec("mkdir Home SignIn SignUp",{cwd:filePath},(err,stdout,stderr)=>{
						fs.writeFileSync(filePath + "Home/index.js",files.homeText)
						fs.writeFileSync(filePath + "Home/style.css",'')
						fs.writeFileSync(filePath + "SignIn/index.js",files.signInText)
						fs.writeFileSync(filePath + "SignIn/style.css",'')
						fs.writeFileSync(filePath + "SignUp/index.js",files.signUpText)
						fs.writeFileSync(filePath + "SignUp/style.css",'')
						log("Components Created!");
						resolve();
					});
				} else {
					exec("mkdir Home Splash",{cwd:filePath},(err,stdout,stderr)=>{
						fs.writeFileSync(filePath + "Home/index.js", files.homeText)
						fs.writeFileSync(filePath + "Home/style.css",'')
						fs.writeFileSync(filePath + "Splash/index.js", files.splashText)
						fs.writeFileSync(filePath + "Splash/style.css",'')
						log("Components Created!");
						resolve();
					});
				}
			});
		});

	};

	const editApp = (name, options) => {
		return new Promise(function(resolve,reject){
			log("Adding Those Components To App...");
			log("Also removing the Service Worker (you can always put it back if you like)")
			let count = 0;
			//alter appjs (and others) to add authentication
			fs.writeFile(`./${name}/client/src/App.js`,files.appText,function(err,data){
				count++;
				if(count === 2){
					log("Components added to App.js")
					resolve();
				}
			});
			// edit index.js so that it doesn not include the service worker
			fs.writeFile(`./${name}/client/src/index.js`,files.reactIndexText,function(err,data){
				count++;
				if(count === 2){
					log("Components added to App.js")
					resolve();
				}
			});
		});
	};

	return {
		createReactApp,
		addFolders,
		makeServer,
		installPackages,
		addScripts,
		configPassport,
		makeModels,
		makeRoutes,
		serverLogic,
		addComponents,
		editApp
	};
};
