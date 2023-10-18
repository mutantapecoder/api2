const express = require('express');
const router = express.Router();


// route -> /api/posts
// desc -> shows all the users and their public profiles.
// access -> public - anyone can see all the users and their profiles.

router.get('/', (req, res) => {
    res.send("posts route")
})


module.exports = router;