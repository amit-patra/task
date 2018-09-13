import { Component, OnInit } from '@angular/core';
import { OperationService } from "../../../service/operation.service";
@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  allTask = [];
  constructor(private _OperationService : OperationService) {
    this.getAllTask()
   }

  ngOnInit() {
  }
  taskAscendingOrdr(){
    this.allTask.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
  }
  taskDescendingOrdr(){
    this.allTask.sort((a, b) => a.name !== b.name ? a.name > b.name ? -1 : 1 : 0);
  }
  getAllTask(){
    var that = this;
    // create token
    this._OperationService.get('getAllTask')
    .then(function (response) {
      // console.log(response.data);
      that.allTask = response.data.allTask;
    })
    .catch(function (error) {
      toastr.error(error.response.data);
    })
  }
}
