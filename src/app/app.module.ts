import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {LoginComponent} from './module/user/login/login.component';
import { SignupComponent } from './module/user/signup/signup.component';
import { ChangepasswordComponent } from './module/user/changepassword/changepassword.component';
  import { from } from 'rxjs/internal/observable/from';
import { HeaderComponent } from './module/header/header.component';
import { TasklistComponent } from './module/task/tasklist/tasklist.component';
export const appRouter: Routes=[
  { path: 'login', component :LoginComponent },
  { path: 'signup', component :SignupComponent },
  { path: 'changepassword', component :ChangepasswordComponent },
  { path: 'tasklist', component :TasklistComponent },
  { path: '', redirectTo:'/login', pathMatch: 'full'},
  ];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ChangepasswordComponent,
    HeaderComponent,
    TasklistComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRouter, {useHash: true }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
