/// <reference path="../../../../toastr.d.ts" />
import { Component, OnInit } from '@angular/core';
import { OperationService } from "../../../service/operation.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
public user:any = {};
  constructor(private _OperationService : OperationService, private _router: Router ) {  }

  ngOnInit() {
  }
  login(){
    var that = this;
    let userData:any = {"email":this.user.email,"password":this.user.password}
    // create token
    this._OperationService.generatetoken('token', userData)
    .then(function (response) {
      // toastr.success("Success");
      sessionStorage.setItem("token", response.data.token);
     var userData = response.data;
     sessionStorage.setItem("userID", userData.Id);
     sessionStorage.setItem("userName", userData.name); 
     sessionStorage.setItem("userType", userData.role);
     sessionStorage.setItem("islogin", "true");
     if(userData.role =='admin'){
       that._router.navigate(['/createTask']);
     }
     else{
       that._router.navigate(['/userTask']);
     }
      // that.getUserDetails();
    })
    .catch(function (error) {
      toastr.error(error.response.data);
    });
  }
  // getUserDetails(){
  //   var that = this;
  //   this._OperationService.post('login', null)
  //   .then(function (response) {
  //     toastr.success("Success");
  //     var userData = response.data.authData.user;
  //     sessionStorage.setItem("userID", userData.Id);
  //     sessionStorage.setItem("userName", userData.name); 
  //     sessionStorage.setItem("userType", userData.role);
  //     sessionStorage.setItem("islogin", "true");
  //     if(userData.role =='admin'){
  //       that._router.navigate(['/createTask']);
  //     }
  //     else{
  //       that._router.navigate(['/userTask']);
  //     }
  //   })
  //   .catch(function (error) {
  //     toastr.error(error.response.data);
  //   });
  // }
}
