import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { Task } from './task.model';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn:"root"})

export class ToDoListService{

    constructor(private http: HttpClient){}
    
    //Observable make things more better
    
    public toDoListSubject = new Subject<Task[]>();
    private toDoList: Task[] = [];

    onDelete(index: number){
        this.toDoList.splice(index, 1);
        this.toDoListSubject.next(this.toDoList);
    }

    onAdd(newTask: Task){
        this.toDoList.push(newTask);
        this.toDoListSubject.next(this.toDoList);
    }

    getToDoList(){
        this.http.get<{toDoList: Task[]}>('http://localhost:3000/todolist').subscribe((jsonData) => {
            this.toDoList = jsonData.toDoList;
            this.toDoListSubject.next(this.toDoList);
        });
    }
    
    getSpecificTask(index : number){
        return {...this.toDoList[index]};
    }
}