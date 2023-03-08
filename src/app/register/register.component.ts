import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'username': new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(64)]),
      'password': new FormControl('', [Validators.required,Validators.minLength(7),Validators.maxLength(64)])
    })
  }

  onSubmit(){
    this.authService.registerUser(this.registerForm.value.username, this.registerForm.value.password);
  }
}