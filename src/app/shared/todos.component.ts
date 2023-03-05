import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { ToDo } from './todo.model';

@Injectable({providedIn:"root"})

export class ToDoListService{

    //Observable make things more better
    toDoListSubject = new Subject<ToDo[]>();
    toDoList: ToDo[] = [
        new ToDo('do the dishes', false, false),
        new ToDo('bath dog', false, false),
        new ToDo('play the games', false, false)
    ]

    onDelete(index: number){
        this.toDoList.splice(index, 1);
        this.toDoListSubject.next(this.toDoList);
    }

    onAdd(newTask: ToDo){
        this.toDoList.push(newTask);
        this.toDoListSubject.next(this.toDoList);
    }
}