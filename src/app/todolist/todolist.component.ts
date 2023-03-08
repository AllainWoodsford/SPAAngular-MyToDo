import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { Task } from '../shared/task.model';
import { ToDoListService } from '../shared/todolist.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit, OnDestroy{

    myList: Task[];
    myListSubscription = new Subscription();
    private authenticationSub: Subscription;
    isAuthenticated = false;

    constructor(private toDoListService: ToDoListService, private router: Router, private authService: AuthService){}

    ngOnInit(): void {
      this.toDoListService.getToDoList();
      this.myListSubscription = this.toDoListService.toDoListSubject.subscribe(list => {
        this.myList = list;
      });
      this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
        this.isAuthenticated = status;
      });
      this.isAuthenticated = this.authService.getIsAuthenticated();
    }

    ngOnDestroy(): void {
      this.myListSubscription.unsubscribe();
      this.authenticationSub.unsubscribe();
    }

    onDelete(index: number) {
      this.toDoListService.onDelete(index);
      
    }
}
