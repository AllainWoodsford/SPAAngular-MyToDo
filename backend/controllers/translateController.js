const taskQueries = require('../databaseRequests/task.queries.js');
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();


const target = "ja";
//We are goign to pass to this generally an object like this
// req.body {
  //id = taskID in database
  //}
//This is a PATCH request
const translateText = async (req,res) =>  {
  try {
      console.log(req.body);
      const taskID = {id:req.body.id};
      //we are going to take the translated value, there is no point translating a task that is already in Japanese
      const foundTask = await taskQueries.getTask(taskID,['id','isTranslated','taskName']);
      if(foundTask != null)
      {
        console.log('found task');
          //We should check if the task exists before we make an API call
          //Google API costs money don't want to make empty requests to translate.
          //Do a Guard for Null or empty text
          const taskText =foundTask.taskName.trim();

        if(taskText.length <= 0 ){
          res.status(400).json({
            message: 'Empty Task'
          });
        } else {
            console.log('passed empty test');
            if(foundTask.isTranslated){
              //We've got a task we should check if its already translated
              res.status(400).json({
                message: 'Task is already translated'
              });
            } else {
              console.log('task passed all tests attempt translate');
              //At this point we have an untranslated task, that's not empty
               //We want to trim white spaces because they charge per character
               //this returns an array we just need 1 string
              const translatedText =  await translate.translate(taskText,target);
              //Should be good at this point to make the PATCH request
              console.log(translatedText);
              console.log('translate worked');
              foundTask.set({
                taskName:translatedText[0],
                isTranslated:true
              });
              console.log(foundTask);
              console.log('attempt task update');
              await foundTask.save();
              console.log('update was a success passing response 200');
              res.status(200).json({
                message: 'task is now translated'
              })
            }
        }
      } //END IF TASK NULL
      else {
          res.status(404).json({
            message: 'Task not found'
          });
      }//END ELSE Found Task
  }//END TRY
  catch{
    res.status(500).json({
      message: 'internal server error'
    });
  } //END Catch
}

module.exports = { translateText };
