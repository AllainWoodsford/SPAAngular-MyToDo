const { connect } = require('../dbSequelize.js');
const user = require('../model/user.js');
const listQueries = require('./list.queries');
const taskQueries = require('./task.queries');
class UserQueries {
    db = {};

    constructor() {
        this.db = connect();
      //  For Development if { force: true } drops table if it exists incase fields need to change

        // this.db.sequelize.sync({ force: true } ).then(() => {
        //     console.log("Drop and re-sync db.");
        // });
    }

  

    //Run at register minmised version of find user
    async findUser(targetUser,attributes){
        try{
            const user = await this.db.sequelize.models.users.findOne({
                where: {
                    username: `${targetUser}`
                }, 
                attributes: attributes});
            if(user){
                return user;
            }
            return null;
        }
        catch(err){
            console.log(err);
            return [];
        }
    }

    //Create user at register
    async createUser(data){
        try{
          
            const newUser = await this.db.sequelize.models.users.create({
                username: data.username,
                password: data.password,
                createdDate: data.timeStamp,
                translationDefault: data.translationDefault,
                translationTarget: data.translationTarget,
                adminFlag: data.adminFlag
            });

            if(newUser) { 

                return true;      
            }
            else {

                return false;
            }
        }
        catch(err){
            console.log('ERROR IN CATCH BLOCK'+ err);
            return false;
        }
    }
}

module.exports = new UserQueries();