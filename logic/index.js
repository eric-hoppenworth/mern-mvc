const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");
const {spawn} = require("superspawn");
const install = require("spawn-npm-install");

const serverString = 	require(path.join(__dirname,"../data/serverText.js"));
const passportText = 	require(path.join(__dirname,"../data/passportText.js"));
const userModelText = 	require(path.join(__dirname,"../data/modelText.js"));
const authText = 		require(path.join(__dirname,"../data/authText.js"));
const routeText = 		require(path.join(__dirname,"../data/routeText.js"));
const apiText = 		require(path.join(__dirname,"../data/apiText.js"));
const appText = 		require(path.join(__dirname,"../data/appText.js"));
const reactIndexText = 	require(path.join(__dirname,"../data/reactIndexText.js"));
const signInText = 		require(path.join(__dirname,"../data/SignInText.js"));
const signUpText = 		require(path.join(__dirname,"../data/SignUpText.js"));
const homeText = 		require(path.join(__dirname,"../data/HomeText.js"));



const colors = require(path.join(__dirname,"../constants.js"));

const log = (msg)=>{
	console.log(colors.MAGENTA,colors.BRIGHT);
	console.log(msg);
	console.log(colors.RESET);
};

const createReactApp = (name) => {
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

const addFolders = (name) => {
	return new Promise((resolve,reject)=>{
		log("Creating Folders....");
		//make sure the name is a valid npm package name
		const reg = /[^a-z0-9\-]/g
		if(name.match(reg)){
			return reject({message:"Be sure that your folder name contains only lowercase, numbers, or '-'."});
		}

		exec(`mkdir ${name}`,(err,stdout,stderr)=>{
			exec(`mkdir config controllers models routes scripts`,{cwd:`./${name}`},(err,stdout,stderr)=>{
				if(err) reject(err);
				log("Done with Folders");
				resolve(stdout);
			});
		});
	});
};

const makeServer = (name) => {
	log("Writing server.js...");
	return new Promise((resolve,reject)=>{
		fs.writeFile(`./${name}/server.js`,serverString(name),function(){
			log("Server Written");
			resolve();
		});	
	});
};

const installPackages = (name) => {
	log("Installing Packages...this may take a moment...");
	return new Promise((resolve,reject)=>{
		exec("npm init --yes",{ cwd: `./${name}` },()=>{
			let packages = install(["express","express-session","mongoose","passport","passport-local","passport-local-mongoose"],
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

const addScripts = (name) => {
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

const configPassport = (name) =>{
	log("Configuring Passport...");
	let count = 0;
	fs.writeFile(`./${name}/config/passport.js`,passportText,function(err, data){
		count++;
		if(count === 3){
			log("Passport Done");
		}
	});
	fs.writeFile(`./${name}/models/index.js`,
`module.exports = {
	User:require("./User.js")
}
//add more models as you create them`,function(err, data){
		count++;
		if(count === 3){
			log("Passport Done");
		}
	});
	fs.writeFile(`./${name}/models/User.js`,userModelText,function(err, data){
		count++;
		if(count === 3){
			log("Passport Done");
		}
	});
};

const makeRoutes = (name) =>{
	let count = 0;
	log("Adding Routes");
	const filePath = `./${name}/routes/`;
	fs.writeFile(filePath + "index.js",routeText,function(err, data){
		count++;
		if(count === 3){
			log("Routes Done");
		}
	});

	fs.writeFile(filePath + "authRoutes.js",authText,function(err, data){
		count++;
		if(count === 3){
			log("Routes Done");
		}
	});

	fs.writeFile(filePath + "apiRoutes.js",apiText,function(err, data){
		count++;
		if(count === 3){
			log("Routes Done");
		}
	});
}

const serverLogic = (name) =>{
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


const addComponents = (name) =>{
	//add some signin/signup components
	const filePath = `./${name}/client/src/components/`;
	return new Promise(function(resolve,reject){
		log("Creating Components...");
		exec("mkdir components",{cwd:`./${name}/client/src`},(err,stdout,stderr)=>{
			exec("mkdir Home SignIn SignUp",{cwd:filePath},(err,stdout,stderr)=>{
				fs.writeFileSync(filePath + "Home/index.js",homeText)
				fs.writeFileSync(filePath + "Home/style.css",'')
				fs.writeFileSync(filePath + "SignIn/index.js",signInText)
				fs.writeFileSync(filePath + "SignIn/style.css",'')
				fs.writeFileSync(filePath + "SignUp/index.js",signUpText)
				fs.writeFileSync(filePath + "SignUp/style.css",'')
				log("Components Created!");
				resolve();
			});
		});
	});
	
};

const editApp = (name) => {
	return new Promise(function(resolve,reject){
		log("Adding Those Components To App...");
		log("Also removing the Service Worker (you can always put it back if you like)")
		let count = 0;
		//alter appjs (and others) to add authentication
		fs.writeFile(`./${name}/client/src/App.js`,appText,function(err,data){
			count++;
			if(count === 2){
				log("SignIn/SignUp added to App.js")
				resolve();
			}
		});
		// edit index.js so that it doesn not include the service worker
		fs.writeFile(`./${name}/client/src/index.js`,reactIndexText,function(err,data){
			count++;
			if(count === 2){
				log("SignIn/SignUp added to App.js")
				resolve();
			}
		});
	});
};

module.exports = {
	createReactApp,
	addFolders,
	makeServer,
	installPackages,
	addScripts,
	configPassport,
	makeRoutes,
	serverLogic,
	addComponents,
	editApp
};