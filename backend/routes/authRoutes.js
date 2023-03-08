const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController.js');

//Auth Routes
//SIGN UP
router.post('/register', register);

//Login
router.post('/login', ( req, res ) => {
    //Look for a record in database compare it to req.body.username
    //Get the object from PostGRES if it exists compare the password if not return error
    //if user return re
    let user = true;
    let result = 'password';
    let userFound;
   // .then(user => {
    if(!user)
    {
        return res.status(401).json({
             message: 'invalid credentials'
            });
      
    }
    //.then result => {}
    //check password if user
    if(user){
        userFound = user;
        return bcyrpt.compare(req.body.password, user.password);
    }
    if(!result){
        //passwords dont match
        return res.status(401).json({
            message: 'invalid credentials'
        });
     

    }   
    //passwords do match
    const token = jwt.sign({username: userFound.username , userId: userFound._id}, process.env.JWT_SECRET, {expiresIn:'1h'});
    //3600 seconds in 1 hour
    return res.status(200).json({
        token:token,
        expiresIn:3600
    });

    //.catch
    // catch(err => {
    //     return res.status(401).json({
    //         message: 'something went wrong!'
    //     })
    // })

    
});



module.exports = router;