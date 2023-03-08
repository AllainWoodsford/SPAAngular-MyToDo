import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../shared/task.model';
import { ToDoListService } from '../shared/todolist.service';

@Component({
  selector: 'app-todoform',
  templateUrl: './todoform.component.html',
  styleUrls: ['./todoform.component.scss']
})
export class TodoformComponent implements OnInit{

    toDoForm: FormGroup;

    constructor(private toDoListService: ToDoListService) { }

    ngOnInit (): void {
      this.toDoForm = new FormGroup({
        "taskName": new FormControl(null, [Validators.required])
      })
    }

    onSubmit(){
      const newTask = new Task(1,this.toDoForm.value.taskName, false, false);
      this.toDoListService.onAdd(newTask);
      this.toDoForm.reset();
    }
}
