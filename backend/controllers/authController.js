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
        const user = await userQueries.findUser(userName);

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
            bcrypt.hash(password, saltRounds, function(err, hash) {
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
                          const result = userQueries.createUser(data);
                          console.log('result is: ' + result);
                          if(result.message === 'registration success!'){
                            res.status(201).json(result);
                          }
                          else{
                            console.log('the check wasnt right');
                            res.status(500).json({
                                message:'something went wrong!'
                            })
                          }
                    }
                    else{
                        //Something went wrong
                        res.status(500).json({
                            message:'something went wrong!'
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

module.exports = { register };