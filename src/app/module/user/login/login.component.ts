/// <reference path="../../../../toastr.d.ts" />
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
public user:any = {};
  constructor() {  }

  ngOnInit() {
  }
  login(){
    toastr.success("hello");
  }
}
