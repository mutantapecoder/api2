const User        = require('../models/User');
const bcrypt      = require('bcryptjs');
const config      = require('config');
const jwtSecret   = config.get('jwtSecret');
const jwt         = require('jsonwebtoken');


async function returnUserData(req, res){
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch(err){
        console.error(err.message)
        res.status(500).send("Server Error")
    }

  }

  async function loginUser (req, res) {

    try {
      //see if user email already exists
      let user = await User.findOne({ email: req.body.email });
      
      if(!user){
          return res.status(400).json({errors: [{ msg: "Invalid credentials"}] })
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password)

      if(!isMatch) {
        return res.status(400).json({errors: [{ msg: "Invalid credentials"}] })
      }

      // return json webtoken
      const payload = {
        user:{
          id:user.id
        }
      }

      jwt.sign(payload, jwtSecret, {
        expiresIn: 360000
      }, (err, token) => {
        if(err) throw err;

        res.json({ token });
        console.log(token)

      });

     
  } catch(err){
      console.error(err.message);
      res.status(500).send('Server Error')
  }
  }

  module.exports = {
    returnUserData: returnUserData,
    loginUser: loginUser
  }