import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { endPoint } from './api.model';

import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
@Injectable({providedIn:'root'})

export class ToDoListService{

    //TODO's
    //Do we need to get the updated list if our requests fail? probably not.

    //CONSTRUCTOR
    constructor(private http: HttpClient, private authService : AuthService, private router: Router) {}

    //Observable make things more better
    public toDoListSubject = new Subject<Task[]>();
    //For subscribers to get changes to the list
    public targetListSubject = new Subject<number>();
    private tempTask: Task;
    //storage for tasks for the toDoList to iterate through with an ng for
    private toDoList: Task[] = [];
    //the list we are targeting in the DB
    //note we convert this to a string and back to a number in the backend
    //we do this because storing an ID is less info then storing a username
    //Also local storage .setValue is strings only
    //replace idea with cookies at some point
    private targetList = -1;

    public initalized = false;
    //Called from the todolist component, each task has its own button
    //that supplies its ID
    //this will make a delete call to the DB
    //then a get for lists
    //makes a delete request to the API
    onDelete(index: number){
        if(this.authService.getIsAuthenticated() === true){
            this.http.delete<{message: string}>(`${endPoint}/tasks/task/` + index).subscribe((jsonData) => {
             this.getToDoList();
             if(jsonData.message === 'fail'){
                return false;
             }
             return true;
            });
        }

        return false;
    }

    //This is a PATCH request
    //We check if the string is empty
    //The Task is already translated
    //We trim the text for spaces due to per character cost $
    //If the task exists
    //We just need to pass the ID as a param in the URL
    onTranslate(index : number){
      if(this.authService.getIsAuthenticated() === true){
        const data = {id: index};
        this.http.patch<{message: string}>(`${endPoint}/tasks/task`, data).subscribe((jsonData) => {
          this.getToDoList();
        });
      }
    }

    //Called from the add task button in the todoform compoent
    //is a protected operation
    onAdd(newTask: Task){
        if(this.authService.getIsAuthenticated() === true){
                this.http.post<{message: string}>(`${endPoint}/tasks/task`, newTask).subscribe((jsonData) => {
                    this.getToDoList();

            });
        }


    }
    //Gets ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //Gets the subject of the target list so they can subscribe
    //extendable in the future or allows for list switching
    getTargetListSub(){
        return this.targetListSubject;
    }

    //Gets the ID of what List we are targeting in the DB
    getTargetList(){
        return this.targetList;
    }

    //grabs a list from Postgres Neon Cloud hosted DB
    //If its the first time ever getting a list initalises the user with a 'default' list extendable in the future to let people switch lists
    //that list also gets populated with a default task
    //else loads up the users task in their default task
    //returns this as a JSON seperated list of the Task Model, it also adds a value that gets
    //pushed out to subscribers the Target List so the Database knows which list to add, delete from etc
    getToDoList(){
        if(this.authService.getIsAuthenticated() === true){
            //Attempt to get toDoList if one does not exist we need ot make them the default one
            //Target list is the one we are going to try and write to
            const data = this.authService.getLoggedInUser();
            this.http.get<{toDoList: Task[], targetList: number}>(`${endPoint}/tasks/todolist/` + data).subscribe((jsonData) => {
                //if targetList returns a -1 that means list creation failed when we go to post a new task with the -1
                //maybe we'll try to fetch an id
                if(!this.initalized){
                    this.initalized = true;
                }
                this.targetList = jsonData.targetList;
                this.toDoList = jsonData.toDoList;
                this.targetListSubject.next(this.targetList);
                this.toDoListSubject.next(this.toDoList);
            });
        }

    }

    //To Check if a task is done
    //So we don't make several requests involving the task from OnDelete
    getTaskIsDone(id:number){
        const value = this.getSpecificTask(id);
        if(value != -1)
        {
            return this.toDoList[value].isDone;
        }
        return false;
    }

    //For UI feedback attempt to set task as done to disable buttons
    //Not working so far
    setTaskDone(id: number, done: boolean){
        const value = this.getSpecificTask(id);
        if(value != -1)
        {
            console.log('succeeded setting task done');
            this.toDoList[value].isDone = done;
            this.toDoListSubject.next(this.toDoList);
        }
    }

    //This is a helper function in order to get the done status and translated status
    //Using the task ID and itterating through the task
    //Need to refactor to foreach
    getSpecificTask(id : number){
        console.log('attempt specified task find');
        for (let index = 0; index < this.toDoList.length; index++) {
          if(this.toDoList[index].id === id){
            return index;
          }

        }
        return -1;
    }
}
