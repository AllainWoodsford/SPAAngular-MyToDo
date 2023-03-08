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

    toDoForm: FormGroup;
    private authenticationSub: Subscription;
    isAuthenticated = false;
    constructor(private toDoListService: ToDoListService, private authService: AuthService) { }

    ngOnInit (): void {
      //dont just rely on subscriptions
      this.isAuthenticated = this.authService.getIsAuthenticated();
      this.toDoForm = new FormGroup({
        "taskName": new FormControl(null, [Validators.required])
      })
      this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status =>{
        this.isAuthenticated = status;
      });
    }

    ngOnDestroy(): void{
      this.authenticationSub.unsubscribe();
    }

    onSubmit(){
      const newTask = new Task(1,this.toDoForm.value.taskName, false, false);
      this.toDoListService.onAdd(newTask);
      this.toDoForm.reset();
    }
}
