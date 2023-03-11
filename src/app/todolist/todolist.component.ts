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

    myList: Task[] = []; //List of our tasks / data model
    myListSubscription = new Subscription(); //private subscription for rendering in the HTML Component from the service
    private authenticationSub: Subscription;
    isAuthenticated = false; //if they are logged in from the token
    loggedInUser =''; //the user id to look up stuff
    tempTask: Task; //temp task for the data model
    constructor(private toDoListService: ToDoListService, private router: Router, private authService: AuthService){}
    //Inits
    //Grab subjects authservice and todoservice
    //Grab data for the users login
    ngOnInit(): void {

      //Check Authentication
      this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
        this.isAuthenticated = status;
      });
      this.isAuthenticated = this.authService.getIsAuthenticated();
      if(this.isAuthenticated)
      {
        this.loggedInUser = this.authService.getLoggedInUser();
      }
      else {
        this.loggedInUser = '';
      }
      //Get the proper list
      this.toDoListService.getToDoList();
      this.myListSubscription = this.toDoListService.toDoListSubject.subscribe(list => {
        this.myList = list;
      });
    }

    ngOnDestroy(): void {
      //Unsubscribe and unAuthenticate
      this.myListSubscription.unsubscribe();
      this.authenticationSub.unsubscribe();
      if(!this.isAuthenticated){
        this.loggedInUser = '';
      }
    }

    //Attempt to stop users from spamming pressingbuttons by marking them as done
    //Will have to figure out a disable flow
    //because Google API costs money
    getDone(index: number){
      if(!this.getListInit() ){
        return this.toDoListService.getTaskIsDone(index);
      }
      else{

        return false;
      }
    }

    //Change icon dynamically experiment for user feedback -> if we can figure out the [disable]
    //thats probably better
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

    //Delete an actual task we try to set it as done
    //To disable the button but we might have to figure something else out
    onDelete(index: number) {
      //trying to disable on press no luck so far
      this.toDoListService.setTaskDone(index, true);
      this.toDoListService.onDelete(index);

    }

    //The API Call Google Translate $$ + Patch request to the Database
    //We really need to disable the button after pressing tihs
    //no point translating something already translated UNLESS we eventually extend to include more language types / lists
    onTranslate(index: number){
      this.toDoListService.onTranslate(index);
    }
}
