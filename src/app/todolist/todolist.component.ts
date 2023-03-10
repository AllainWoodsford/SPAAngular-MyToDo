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

    myList: Task[] = [];
    myListSubscription = new Subscription();
    private authenticationSub: Subscription;
    isAuthenticated = false;
    loggedInUser ='';

    constructor(private toDoListService: ToDoListService, private router: Router, private authService: AuthService){}

    ngOnInit(): void {
      this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
        this.isAuthenticated = status;
      });
      this.isAuthenticated = this.authService.getIsAuthenticated();
      if(this.isAuthenticated)
      {
       
        this.loggedInUser = this.authService.getLoggedInUser();
      }
      else{
        this.loggedInUser = '';
      }
      this.toDoListService.getToDoList();
      this.myListSubscription = this.toDoListService.toDoListSubject.subscribe(list => {
        this.myList = list;
      });
    }

    ngOnDestroy(): void {
      this.myListSubscription.unsubscribe();
      this.authenticationSub.unsubscribe();
      if(!this.isAuthenticated){
        this.loggedInUser = '';
      }
    }

    getDone(index: number){
      if(!this.getListInit() ){
        let task = this.toDoListService.getSpecificTask(index);
        if(task){
          return task.isDone;
        }
       return false;
      }
      else{
        return false;
      }
    }

    getDeleteButtonIcon(index: number){
      if(!this.getDone(index)){
        return 'delete'
      }
      else{
        return 'autorenew'
      }
    }

    getListInit(){
      return this.toDoListService.initalized;
   
    }

    onDelete(index: number) {
     if(!this.getDone(index)){
      
      this.toDoListService.setTaskDone(index, true);
      let result = this.toDoListService.onDelete(index);
      if(!result){
        this.toDoListService.setTaskDone(index,false);
      }
     }
   
      
    }
}
