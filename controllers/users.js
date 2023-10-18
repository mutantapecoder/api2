var User                            = require('../models/User');
const { check, validationResult }   = require('express-validator');
const gravatar                      = require('gravatar');
const bcrypt                        = require('bcryptjs');
const jwt                           = require('jsonwebtoken');
const config                        = require('config');

const jwtSecret = config.get('jwtSecret');

function usersIndex(req, res){
  User.find(function(err, users){
    if(err) return res.status(500).json({message: err});
    return res.status(200).json(users);
  })
}

async function registerUser(req, res){
    console.log(req.body);
    const errors = validationResult(req);

    if(!errors.isEmpty()){
         res.status(400).json({errors: errors.array() })
    } else {

        try {
            //see if user email already exists
            let user = await User.findOne({ email: req.body.email });
            
            if(user){
                return res.status(400).json({errors: [{ msg: "User already exists"}] })
            }

            // get users gravatar
            const avatar = gravatar.url(req.body.email, {
                s: '200', 
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password
            })

            // encrypt password
            const salt = await bcrypt.genSaltSync(10);

            user.password = await bcrypt.hashSync(req.body.password, salt);

            console.log(user)

            await user.save();

            
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
  }

// function getUser(req, res){
//   var id = req.params.id;

//   User.findById({_id: id}, function(err, user){
//     if(err) res.status(404).send(err);
//     res.status(200).send(user);
//   }).select('-_v');
// }

module.exports = {
  usersIndex: usersIndex,
  registerUser: registerUser
}
