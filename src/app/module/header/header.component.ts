import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperationService } from "../../service/operation.service";
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loginUserName:string = sessionStorage.getItem("userName")
  public userData:any = {};
  public passwordData:any = {};
  constructor(private _router: Router, private _OperationService : OperationService ) { }

  ngOnInit() {
  }
  logout(){
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("islogin");
    sessionStorage.removeItem("token");
    this._router.navigate(['/login']);
  }
  editProfile(){
    var that = this;
    // create token
    this._OperationService.get('getUserDetails')
    .then(function (response) {
      $('#editProfileModal').modal('show');
      that.userData = response.data.userData;
    })
    .catch(function (error) {
      toastr.error(error.response.data);
    });
   
  }
  editPassword(){
    $('#editPasswordModal').modal('show');
  }
  updateProfile(){
    var that = this;
    this._OperationService.put('updateProfile',this.userData)
    .then(function (response) {
      $('#editProfileModal').modal('hide');
      sessionStorage.setItem("userName", that.userData.name); 
      that.loginUserName = that.userData.name;
      toastr.success("success");
    })
    .catch(function (error) {
      toastr.error(error.response.data);
    });
  }
  updatePassword(){
    if(this.passwordData.password != this.passwordData.newPassword){
      toastr.error("Password not matched");
    }
    else{
      var that = this;
      let changePasswordData:any={password:this.passwordData.password}
      this._OperationService.put('changePassword',changePasswordData)
      .then(function (response) {
        $('#editPasswordModal').modal('hide');
        that.logout();
        toastr.success("success");
      })
      .catch(function (error) {
        toastr.error(error.response.data);
      });
    }

  }
}
