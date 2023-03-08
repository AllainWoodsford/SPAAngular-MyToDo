const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//Temp Data Creation
const toDoList =  [
    {id: 1, taskName: 'Buy groceries', isDone: false , isTranslated: false},
    {id: 2, taskName: 'Eat food', isDone: false , isTranslated: false},
    {id: 3, taskName: 'Code', isDone: false , isTranslated: false},
];

app.use(bodyParser.json());

app.use(( req, res, next ) => {
    //CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

//Get Routes
app.get('/todolist',( req, res, next) => {
    console.log('hello from express');
    res.json({'toDoList': toDoList});
});

app.get('/todolist/maxid', ( req, res ) => {
    let max = 0;
    for(var i = 0; i < toDoList.length ; i++){
        console.log(i);
        if(toDoList[i].id > max){
            console.log('to do list > max');
            max = toDoList[i].id;
        }
    }
    max += 1;
    console.log('max is now ' + max);
    res.json({'maxid': max});
});

//Post Routes
app.post('/task', ( req, res, next ) => {
    
    try{
        const token = req.headers.authorization;
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch(err){
        res.status(401).json({
            message:"Unauthorized"
        })
    }
    

},(req,res) => {
    //write to create Task in DB
    const data = req.body;
    toDoList.push({id: data.id, taskName: data.taskName, isDone: data.isDone , isTranslated: data.isTranslated});
    res.status(200).json({
        message: 'Task posted'
    });
    }
);

//Auth Routes
app.post('/sign-up', ( req, res ) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const userModel = new UserModel({
                username: req.body.username,
                password: hash
            })

            userModel.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created',
                    result: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
})

//Login
app.post('login', ( req, res ) => {
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
    })

    //.catch
    // catch(err => {
    //     return res.status(401).json({
    //         message: 'something went wrong!'
    //     })
    // })

    
});

//Danger Zone
//Delete Routes
app.delete('/task/:id', ( req, res ) => {
    console.log('param id on delete request is ' + req.params.id);

    let index = -1;
    index = toDoList.findIndex(el => {
        console.log('match ID found');
        return el.id == req.params.id;
    });
    if(index != -1){
        console.log('attempt splice');
        toDoList.splice(index,1);
        console.log(toDoList);
        res.status(200).json({
            message: 'Task deleted'
        });
    }
    else{
        res.status(400).json({
            message: 'No task with id param found'
        });
    }

});

module.exports = app;