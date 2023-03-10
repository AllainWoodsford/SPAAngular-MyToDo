import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Subscription } from 'rxjs';
import { Task } from '../shared/task.model';
import { ToDoListService } from '../shared/todolist.service';

@Component({
  selector: 'app-todoform',
  templateUrl: './todoform.component.html',
  styleUrls: ['./todoform.component.scss']
})
export class TodoformComponent implements OnInit{

 
    private authenticationSub: Subscription;
    private targetListSub: Subscription;

    toDoForm: FormGroup;
    isAuthenticated = false;
    loggedInUserId = '';
    targetList = -1;
    constructor(private toDoListService: ToDoListService, private authService: AuthService) { }

    ngOnInit (): void {
      //dont just rely on subscriptions
      this.isAuthenticated = this.authService.getIsAuthenticated();
      this.targetList = this.toDoListService.getTargetList();
      this.toDoForm = new FormGroup({
        "taskName": new FormControl(null, [Validators.required])
      })
      this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status =>{
        this.isAuthenticated = status;
      });
      this.targetListSub = this.toDoListService.getTargetListSub().subscribe(data => {
        this.targetList = data;
      });
      
    }

    ngOnDestroy(): void{
      this.authenticationSub.unsubscribe();
      this.targetListSub.unsubscribe();
    }

    onSubmit(){
      //Since the ID is auto generated by the ID the model is slightly different here
      //We are passing in the ID of the target list the task goes into rather than the ID for the list itself
      const newTask = new Task(this.targetList,this.toDoForm.value.taskName, false, false);
      this.toDoListService.onAdd(newTask);
      this.toDoForm.reset();
    }
}
