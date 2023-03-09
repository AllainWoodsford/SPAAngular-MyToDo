const taskQueries = require('../databaseRequests/task.queries.js');
const listQueries = require('../databaseRequests/list.queries.js');
const { toInteger } = require('lodash');

//checks if a user has a list if they don't creates a default one
const getList = async (req,res) => {
    const userId = parseInt(req.params.id);
    console.log(userId);
    //Try to grab the default list ID
    const existingList = await listQueries.getList(userId, ['listId']);
    if(existingList === -1)
    {
        //so they don't have a default list at this point we should create them a new one
        //this is the first time they've logged in sort of thing
        //bad practice but make one anyway?
        console.log('user has no list we will have to create one');
        const data = {
            userid: userId,
            listName: 'default' 
        }
        const defaultList = await listQueries.createList(data);
        if(defaultList != -1)
        {
            console.log('default list created now for the default task...');
            //we've hopefully made the default list
            //now to put a default task in it.
            const taskData = {
                listId : defaultList,
                taskName: 'add tasks with the plus below.',
                isDone:false,
                isTranslated: false
            };
            const defaultTask = await taskQueries.createTask(taskData);
            if(defaultTask != null){
                //everything went smoothly
                const response = {toDoList: [{
                    id: defaultTask.id,
                    taskName: defaultTask.taskName,
                    isDone: false,
                    isTranslated: false
                }], targetList: defaultList.listId};
                res.status(200).json(response);
            }
            else{
                const response = {toDoList: [],
                     targetList: defaultList.listId};
                res.status(206).json(response);
            }
            //if we fail to create a task its okay to pass an empty list because we have the ID at least
        }
        else{
            //error but maybe return a garbage task with info?
            //we still created the list 
            //lets pass the first
            const response = {toDoList: [{
                id: 0,
                taskName: 'Something went wrong your default tasks',
                isDone: false,
                isTranslated: false
            }], targetList: -1};
            res.status(500).json(
                response
            );
        }
    } //endIf
    else {
        //we've got the list ID so lets grab a list of every Task that has 
        //the foriegn key of the list ID and return it as a list
        //This has potential to return an empty list still if it fails above
        console.log('user has a list we need the tasks now');
        console.log('existing list value is ' + existingList);
        const tasksInList = await taskQueries.getAllTasks(existingList, ['id','taskName','isDone','isTranslated']);
        console.log('we got the tasks!');

        const response = {toDoList: tasksInList, targetList: existingList};
        res.status(200).json(response);
        
    }
};

//Create a new task if logged in
const createTask = async (req, res) => {
    console.log(req.body);
    const listId = toInteger(req.body.id);
    if(listId === -1){
       //bad request no list id 
        res.status(400).json({
        message: 'Target list is not set, try re-logging'
    }); 
    }
    else{
         const data = {
        listId: listId,
        taskName: req.body.taskName,
        isTranslated: false,
        isDone: false
    };
    
    const newTask = taskQueries.createTask(data);
    if(newTask != null){
        res.status(200).json({
            message: 'Task posted'
        });
    }
    else{
        res.status(500).json({
            message: 'Task failed to create'
        });
    }

    
    }

   
};

module.exports = { getList , createTask};