import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from '../shared/task.model';
import { ToDoListService } from '../shared/todolistservice.component';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit, OnDestroy{

    myList: Task[];
    myListSubscription = new Subscription();
    constructor(private toDoListService: ToDoListService, private router: Router){}

    ngOnInit(): void {
      this.toDoListService.getToDoList();
      this.myListSubscription = this.toDoListService.toDoListSubject.subscribe(list => {
        this.myList = list;
      });
    
    }

    ngOnDestroy(): void {
      this.myListSubscription.unsubscribe();
    }

    onDelete(index: number) {
      this.toDoListService.onDelete(index);
      
    }
}
