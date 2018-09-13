/// <reference path="../../../../toastr.d.ts" />
import { Component, OnInit } from '@angular/core';
import { OperationService } from "../../../service/operation.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
public newUser:any ={};
  constructor(private _OperationService : OperationService, private _router: Router) { }

  ngOnInit() {
  }
  signup(){
    var that = this;
    if(this.newUser.password != this.newUser.rePassword){
      toastr.error("error");
    }
    else{
      let userData:any = {"name":this.newUser.name,"email":this.newUser.email,"address":this.newUser.address,"phone":this.newUser.phone,"password":this.newUser.password}
      this._OperationService.post('insertUser', userData)
      .then(function (response) {
        toastr.success("Success");
        that._router.navigate(['/login']);
      })
      .catch(function (error) {
        toastr.error(error.response.data);
      });
    }

  }

}
