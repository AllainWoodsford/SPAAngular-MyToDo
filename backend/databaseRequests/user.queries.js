const { connect } = require('../dbSequelize.js');

class UserQueries {
    db = {};

    constructor() {
        this.db = connect();
        //For Development if { force: true } drops table if it exists incase fields need to change

        // this.db.sequelize.sync({ force: true } ).then(() => {
        //     console.log("Drop and re-sync db.");
        // });
    }

    //Run at login
    async findUser(targetUser){
        try{
            const user = await this.db.sequelize.models.users.findOne({where: {username: `${targetUser}`}});
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

            if(newUser){
                console.log('everything went alright!');
                return {message: 'registration success!'};
            }
            else{
                console.log('REGO FAILED!');
                return {message: 'registration failed'};
            }
        }
        catch(err){
            console.log('ERROR IN CATCH BLOCK'+ err);
            return {message: 'registration failed: ' + err};
        }
    }
}

module.exports = new UserQueries();