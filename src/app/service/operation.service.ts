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
    let url  = window.location.href;
    if(url.indexOf('localhost') > 1){
      this.baseUrl = 'http://localhost:3000/api/';
    }
    else{
      alert("Url check");
    }
    this.jwt();
  }
  // For get data
  get(Url: string) {
    return axios.get(this.baseUrl + Url, this.axiosConfig);
  }

  // For post data
  post(Url: string, postData: any[]) {
    return axios.post(this.baseUrl + Url, postData, this.axiosConfig)
  }

  // For update data
  put(Url: string, postData: any[]) {
    return axios.put(this.baseUrl + Url, postData, this.axiosConfig)
  }

  // For delete data
  delete(Url: string) {
    return axios.delete(this.baseUrl + Url, this.axiosConfig);
  }

  // pass Header 
  public jwt() {
    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
        'appType': 'myApp'
      }
    };
  }
  
}
