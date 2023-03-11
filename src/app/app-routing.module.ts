import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodolistComponent } from './todolist/todolist.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { RouteGuard } from './shared/route.guard';
import { AdminGuard } from './shared/admin.guard';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {path:'',component: TodolistComponent, canActivate:[RouteGuard]},
  {path:'admin', component: AdminComponent, canActivate:[AdminGuard]},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    RouteGuard
  ]
})
export class AppRoutingModule { }
