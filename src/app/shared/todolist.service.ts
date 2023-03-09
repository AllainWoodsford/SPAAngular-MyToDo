import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { endPoint } from './api.model';

import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
@Injectable({providedIn:'root'})

export class ToDoListService{

    public maxId:number;

    constructor(private http: HttpClient, private authService : AuthService, private router: Router) {}
    
    //Observable make things more better
    
    public toDoListSubject = new Subject<Task[]>();
    private toDoList: Task[] = [];

    onDelete(index: number){
        if(this.authService.getIsAuthenticated() === true){
            console.log(`${endPoint}/tasks/task/` + index);
            this.http.delete<{message: string}>(`${endPoint}/tasks/task/` + index).subscribe((jsonData) => {
             this.getToDoList();
            });
        }
  
      
    }

    onAdd(newTask: Task){
        if(this.authService.getIsAuthenticated() === true){
            this.http.get<{maxid:number}>(`${endPoint}/tasks/todolist/maxid`).subscribe((jsonData) => {
                newTask.id = jsonData.maxid;
                this.http.post<{message: string}>(`${endPoint}/tasks/task`, newTask).subscribe((jsonData) => {
                    this.getToDoList();
                });
            });
        }
     

    }

    getToDoList(){
        if(this.authService.getIsAuthenticated() === true){
            //Attempt to get toDoList if one does not exist we need ot make them the default one
            //Target list is the one we are going to try and write to
            const data = this.authService.getLoggedInUser();
            this.http.get<{toDoList: Task[], targetList: number}>(`${endPoint}/tasks/todolist/` + data).subscribe((jsonData) => {
                //if targetList returns a -1 that means list creation failed when we go to post a new task with the -1
                //maybe we'll try to fetch an id
                this.toDoList = jsonData.toDoList;
                this.toDoListSubject.next(this.toDoList);
            });
        }
      
    }
    
    getSpecificTask(index : number){
        return {...this.toDoList[index]};
    }
}