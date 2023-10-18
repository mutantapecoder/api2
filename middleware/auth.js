const jwt       = require('jsonwebtoken');
const config    = require('config');


const jwtSecret = config.get('jwtSecret');

function verifyToken (req, res, next) {

   //get token from header
   const token = req.header('x-auth-token');

   //check if not token
   if(!token) {
    return res.status(401).json({msg: "No token, authorisation is denied."})
   }

   //verify token
   try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    console.log(`logging req.user from the auth.js middleware: ${req.user}`)

    next();


   } catch(err){
    console.error(err.message)
    res.status(401).json({msg: "Token is not valid"});
   }

};



module.exports = {verifyToken: verifyToken};