import { Injectable } from '@angular/core';
import { ToDo } from './todo.model';

@Injectable({providedIn:"root"})

export class ToDoListService{
    toDoList: ToDo[] = [
        new ToDo('do the dishes', false, false),
        new ToDo('bath dog', false, false),
        new ToDo('play the games', false, false)
    ]
}