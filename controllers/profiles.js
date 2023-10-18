const Profile                       = require('../models/Profile');
const User                          = require('../models/User');
const { check, validationResult }   = require('express-validator');
const verifyTokenMiddleware         = require('../middleware/auth')

async function getAllProfiles (req, res) {

    const profiles = await Profile.find({}).populate('User', ['name', 'avatar']);
    res.json(profiles)

}

async function getProfile (req, res) {
    
    try {
        const profile = await Profile.findOne({ User: req.params.id }).populate('User', ['name', 'avatar']);
        
        if(!profile) {
            res.status(400).json({msg: "user has not created a profile yet"});
        }

        res.json(profile)
    } catch(err){
        console.error(err.message);
        res.status(500).json({ msg: "server error"})
    }
}

async function getCurrentUserProfile (req, res) {
    try {
        const profile = await Profile.findOne({ User: req.user.id}).populate('User', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg: "User hasn't created a profile yet."})
        }

        console.log(`logging req.user from the profile controller: ${req.user}`)
        return res.json(profile)

    
    } catch(err){
        console.error(err.message)
        res.status(500).send("server errorrrr")
    }
}

async function createProfile (req, res) {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

   const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
   } = req.body;

   //build profile object
   const profileFields = {};
   profileFields.User = req.user.id;
   if(company) profileFields.company = company;
   if(website) profileFields.website = website;
   if(location) profileFields.location = location;
   if(bio) profileFields.bio = bio;
   if(status) profileFields.status = status;
   if(githubusername) profileFields.githubusername = githubusername;

   //now turn skills csv string into an array
   if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim())
   console.log(profileFields.skills)

   //build profile social object
   profileFields.social = {};
   if(youtube) profileFields.social.youtube = youtube;
   if(facebook) profileFields.social.facebook = facebook;
   if(twitter) profileFields.social.twitter = twitter;
   if(instagram) profileFields.social.instagram = instagram;
   if(linkedin) profileFields.social.linkedin = linkedin;

    try {

        let profile = await Profile.findOne({User: req.user.id })

        if(profile) {
            //if profile is found update the profile with new information. fields which are left blank with no info are kept the same as before update (ie. not overwritten to 0)
            profile = await Profile.findOneAndUpdate(
                {User: req.user.id},
                {$set: profileFields},
                {new: true}
            );
            return res.status(200).json(profile)
        }

        //if profile isnt found then create one using the information in form fields

        profile = new Profile(profileFields);

        await profile.save();
        res.status(200).json(profile);
        console.log(profile)


    } catch(err){
        console.error(err.message);
        res.status(500).json({ msg: "server error "})
    }

}

async function deleteProfile (req, res) {

    //check if profile id belongs to current logged in token (to prevent other registered users from deleting your profile)
    console.log(`req.user.id is: ${req.user.id}`)

    if (req.params.id !== req.user.id) return res.status(500).json({ msg: "Cannot delete a profile which belongs to another user"})

    console.log(req.params.id)
    await Profile.findOneAndRemove({User: req.params.id})

    res.status(200).json({msg: "successfully deleted profile"})
   
}

async function updateProfile (req, res) {

    if (req.params.id !== req.user.id) return res.status(500).json({ msg: "Cannot update a profile which belongs to another user"})

    // taking the data from the updated form fields and updating the relevant 

    const updatedProfile = await Profile.findOneAndUpdate({User: req.params.id}, req.body, { new:true })

    res.status(200).json(updatedProfile)
}

module.exports = {
    getAllProfiles: getAllProfiles,
    getProfile: getProfile,
    getCurrentUserProfile: getCurrentUserProfile,
    createProfile: createProfile,
    deleteProfile: deleteProfile,
    updateProfile: updateProfile
}