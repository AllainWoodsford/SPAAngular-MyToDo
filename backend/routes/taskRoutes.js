const express = require('express');
const router = express.Router();

//Temp Data Creation
const toDoList =  [
    {id: 1, taskName: 'Buy groceries', isDone: false , isTranslated: false},
    {id: 2, taskName: 'Eat food', isDone: false , isTranslated: false},
    {id: 3, taskName: 'Code', isDone: false , isTranslated: false},
];

//Get Routes
router.get('/todolist',( req, res, next) => {
    res.json({'toDoList': toDoList});
});

router.get('/todolist/maxid', ( req, res ) => {
    let max = 0;
    for(var i = 0; i < toDoList.length ; i++){
     
        if(toDoList[i].id > max){
         
            max = toDoList[i].id;
        }
    }
    max += 1;
 
    res.json({'maxid': max});
});

//Post Routes
router.post('/task', ( req, res, next ) => {
    
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


//Danger Zone
//Delete Routes
router.delete('/task/:id', ( req, res ) => {
 

    let index = -1;
    index = toDoList.findIndex(el => {
     
        return el.id == req.params.id;
    });
    if(index != -1){
   
        toDoList.splice(index,1);
      
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
module.exports = router;