const { isThisTypeNode } = require('typescript');
const { connect } = require('../dbSequelize.js');

class TaskQueries {
    db = {};

    constructor() {
        this.db = connect();
        //For Development if { force: true } drops table if it exists incase fields need to change

        // this.db.sequelize.sync({ force: true } ).then(() => {
        //     console.log("Drop and re-sync db.");
        // });
    }

    //Create new Task
    async createTask(data){
        try{
            const newTask= await this.db.sequelize.models.tasks.create({
                listId: data.listId,
                taskName: data.taskName,
                isDone: data.isDone,
                isTranslated: data.isTranslated
            });

            if(newTask){
                console.log('everything went alright!');
              
                return newTask;
            }
            else{
                console.log('Task Creation error');
                
                return null;
            }
        }
        catch(err){
            console.log('ERROR IN Create Task block'+ err);
            return null;
        }
    }

    //Get All Tasks in a list
    async getAllTasks(data, attributes){
        try {
            const allTasks = await this.db.sequelize.models.tasks.findAll({
                where: {listId: data},
                attributes:{attributes}
            });
            console.log(allTasks);
            return allTasks;
        }
        catch(err){
            console.log('Error in catch block getAllTasks' + err);
            return [];
        }
    }
}

module.exports = new TaskQueries();