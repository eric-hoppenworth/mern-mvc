## Instructions:

This package relies on Yarn, so be sure that you have it installed globally.

``` npm install yarn -g ```

Next, install this package,

``` npm install -g @mahjongg/mern-mvc ```

Navigate to the desired location for your new project and run:

``` mern-mvc create <project-name> ```

mern-mvc will create a new folder for you with the name specified.  This name will also be used in your package.json, so it must follow some naming conventions.  Only lowercase letters, numbers, or the "-" symbol are allowed.

## What's Included?

mern-mvc creates an application that uses the following on the backend:

``` javascript
"dependencies": {
    "express"
    "express-session"
    "mongoose"
    "passport"
    "passport-local"
    "passport-local-mongoose"
  },
  "devDependencies": {
    "concurrently"
    "jest"
    "nodemon"
  }
```

All packages are installed at their most recent versions.
It includes fully set-up user authentication, with the option for more fields to be added with ease.

A react application will be created using create-react-app, in a folder called 'client'.  The dev dependencies concurrently and nodemon are used to allow both the react server and api server to be run in parallel when using ``` yarn start ```.  The react-app utilizes react-router-dom for routing, and axios for AJAX calls.

The React app has some very basic authentication forms included, but you are free to implement authentication however you like.


### TODO:

* Add more configuration/allow passport to be omitted.
* Add a .gitignore