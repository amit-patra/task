import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
constructor(){}
checkLogin(){
  if(sessionStorage.getItem("islogin") == "true"){
      return true;
  }
}
}
