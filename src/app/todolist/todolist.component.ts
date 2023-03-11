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
    tempTask: Task;
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
        return this.toDoListService.getTaskIsDone(index);
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

    //controls the spinner displaying as its confusing if the list loaded is empty
    //needs to dissapear if we've at least attempted to load a list
    getListInit(){
      return this.toDoListService.initalized;

    }

    onDelete(index: number) {
      //trying to disable on press no luck so far
      this.toDoListService.setTaskDone(index, true);
      this.toDoListService.onDelete(index);

    }
}
