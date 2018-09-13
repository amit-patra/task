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
import { CreateTaskComponent } from './module/task/create-task/create-task.component';
import { AuthGuard } from './guards/index';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FilterPipe } from './filter.pipe';
export const appRouter: Routes=[
  { path: 'login', component :LoginComponent },
  { path: 'signup', component :SignupComponent },
  { path: 'changepassword', component :ChangepasswordComponent, canActivate: [AuthGuard] },
  { path: 'userTask', component :TasklistComponent, canActivate: [AuthGuard] },
  { path: 'createTask', component : CreateTaskComponent, canActivate: [AuthGuard]},
  { path: '', redirectTo:'/login', pathMatch: 'full'},
  ];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ChangepasswordComponent,
    HeaderComponent,
    TasklistComponent,
    CreateTaskComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRouter, {useHash: true }),
    FormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
