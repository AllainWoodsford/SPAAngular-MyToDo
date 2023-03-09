const express = require('express');
const router = express.Router();
const { getList, createTask } = require('../controllers/taskController.js');
const { verifyToken } = require('../middleware/auth.js');
//Temp Data Creation
const toDoList =  [
    {id: 1, taskName: 'Buy groceries', isDone: false , isTranslated: false},
    {id: 2, taskName: 'Eat food', isDone: false , isTranslated: false},
    {id: 3, taskName: 'Code', isDone: false , isTranslated: false},
];

//Get Routes
router.get('/todolist/:id', verifyToken, getList);

//Post Routes
router.post('/task', verifyToken, createTask);


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