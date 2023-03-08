import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
import { endPoint } from "./api.model";
@Injectable({providedIn:"root"})

export class ToDoListService{

    public maxId:number;
    constructor(private http: HttpClient){}
    
    //Observable make things more better
    
    public toDoListSubject = new Subject<Task[]>();
    private toDoList: Task[] = [];

    onDelete(index: number){
        console.log(`${endPoint}/task/` + index);
       this.http.delete<{message: string}>(`${endPoint}/task/` + index).subscribe((jsonData) => {
        this.getToDoList();
       });
    }

    onAdd(newTask: Task){
        this.http.get<{maxid:number}>(`${endPoint}/todolist/maxid`).subscribe((jsonData) => {
            newTask.id = jsonData.maxid;
            this.http.post<{message: string}>(`${endPoint}/task`, newTask).subscribe((jsonData) => {
                this.getToDoList();
            });
        });

    }

    getToDoList(){
        this.http.get<{toDoList: Task[]}>(`${endPoint}/todolist`).subscribe((jsonData) => {
            this.toDoList = jsonData.toDoList;
            this.toDoListSubject.next(this.toDoList);
        });
    }
    
    getSpecificTask(index : number){
        return {...this.toDoList[index]};
    }
}