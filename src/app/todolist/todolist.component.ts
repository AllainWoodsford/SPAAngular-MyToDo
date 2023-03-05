import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToDo } from '../shared/todo.model';
import { ToDoListService } from '../shared/todos.component';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit, OnDestroy{

    myToDoList: ToDo[];
    myToDoSubscription = new Subscription();
    constructor(private toDoListService: ToDoListService){
      this.myToDoList = this.toDoListService.toDoList;

    }

    ngOnInit(): void {
      this.myToDoSubscription = this.toDoListService.toDoListSubject.subscribe(myToDoList => {
        this.myToDoList = this.toDoListService.toDoList;
      });
    
    }

    ngOnDestroy(): void {
      this.myToDoSubscription.unsubscribe();
    }

    onDelete(index: number) {
      this.toDoListService.onDelete(index);
      
    }
}
