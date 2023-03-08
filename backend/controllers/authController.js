const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const userQueries = require('../databaseRequests/user.queries.js');

const saltRounds = 10;
//Register User
const register = async (req, res) => {
    try {
        console.log(req.body);
        const userName = _.toLower(req.body.username).replaceAll(' ','');
        const password = req.body.password;
        
        //Find out if the userame exists in the Database already after removing spaces and toLower
        const user = await userQueries.findUser(userName, ['username']);

        if(user !== null){
            //We've gotten something back from the database
            console.log('user exists');
                //The Database returned some rows for the query of findUser()
                //Therefor there is a user in the database and the user request should fail
                res.status(409).json({
                    message:'invalid entry try again'
                });
        }
        else{
            console.log('user does not exist continue flow');
            //Continue Registration flow there is no user with the userName the person is asking for
            //Hash the password and salt
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                if(!err)
                    {
                        console.log("hashed success");
                          //Attempt to create the user
                          //Pass the Data below into the user.queries.js to the Sequalize Connection
                          let now = Date.now();
                          const data = {
                            username: userName,
                            password: hash,
                            timeStamp: now,
                            translationDefault:  'eng',
                            translationTarget: 'jpn',
                            adminFlag:0
                          };
                          console.log("passing Data to create model");
                          const result = await userQueries.createUser(data);
                          console.log('result is: ' + result);
                          if(result){
                            res.status(201).json({result:true});
                          }
                          else{
                            console.log('the check wasnt right');
                            res.status(500).json({
                                result:false
                            })
                          }
                    }
                    else{
                        //Something went wrong
                        res.status(500).json({
                            result:false
                        })
                    }
               });
     }
        
    } //End Try
    catch(err) {
        console.log(err.message);
        res.status(500).json({
            error: err.message
        });       
    } //End Catch
};

const login = async (req,res) => {
 //Look for a record in database compare it to req.body.username
    //Get the object from PostGRES if it exists compare the password if not return error
    //if user return re
    const userName = _.toLower(req.body.username).replaceAll(' ','');
   
    
    //Find out if the userame exists in the Database already after removing spaces and toLower
    //ToDO get some login attempts and lockout action going
    const user = await userQueries.findUser(userName, ['username','password']);
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
        return bcrypt.compare(req.body.password, user.password).then( isMatch =>{
            if(isMatch){
                //credentials are correct
                const token = jwt.sign({username: userFound.username , userId: userFound.userid}, process.env.JWT_SECRET, {expiresIn:'1h'});
                //3600 seconds in 1 hour
                return res.status(200).json({
                    token:token,
                    expiresIn:3600
                });
            }
            else {
                //passwords dont match
                return res.status(401).json({
                    message: 'invalid credentials'
                });
            }
        });
    }
    
};

module.exports = { register, login };