module.exports  = 
`module.exports = (passport,User) =>{

    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};`;