import { Component, OnInit } from '@angular/core';
import { ToDo } from '../shared/todo.model';
import { ToDoListService } from '../shared/todos.component';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit{

    myToDoList: ToDo[];

    constructor(private toDoListService: ToDoListService){
      this.myToDoList = this.toDoListService.toDoList;

    }

    ngOnInit(): void {
      
    }
}
