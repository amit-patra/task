import { Injectable } from '@angular/core';
import axios from "axios";
@Injectable({
  providedIn: 'root'
})
export class OperationService {

  // constructor() { }
  axiosConfig: any;
  baseUrl:String;
  constructor() {
    // let url  = window.location.href;
    // if(url.indexOf('localhost') > 1){
    //   this.baseUrl = 'http://localhost:3000/api/';
    // }
    // else{
    //   alert("Url check");
    // }
    
    if(window.location.hostname === 'localhost'){
      this.baseUrl =  window.location.protocol+'//localhost:3000/api';
    }
    else{
      this.baseUrl = window.location.protocol+'//'+window.location.host+'/api';
    }
    this.baseUrl = this.baseUrl+'/'
    this.jwt();
  }
  // For get data
  get(Url: string) {
    this.jwt()
    return axios.get(this.baseUrl + Url, this.axiosConfig);
  }

  // For post data
  post(Url: string, postData: any[]) {
    this.jwt()
    return axios.post(this.baseUrl + Url, postData, this.axiosConfig)
  }

  // For update data
  put(Url: string, postData: any[]) {
    this.jwt()
    return axios.put(this.baseUrl + Url, postData, this.axiosConfig)
  }

  // For delete data
  delete(Url: string) {
    this.jwt()
    return axios.delete(this.baseUrl + Url, this.axiosConfig);
  }
// Generate token
generatetoken(Url: string, postData: any[]) {
  return axios.post(this.baseUrl + Url, postData, this.axiosConfig)
}
  // pass Header 
  public jwt() {
    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        "Authorization":"bearer "+sessionStorage.getItem("token")
      }
    };
  }
  
}
