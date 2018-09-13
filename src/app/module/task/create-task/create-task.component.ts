import { Component, OnInit } from '@angular/core';
import { OperationService } from "../../../service/operation.service";
declare var $: any;
@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  taskData:any = {};
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  allTask = [];
  mytask:any = {};
  constructor(private _OperationService : OperationService) {
    this.getAllUsers();
    this.getAllTask();
   }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  ngAfterViewInit() {
  }
  onItemSelect(item:any){
    // console.log(item);
    var filterdata = this.selectedItems.filter(data=>data.item_id == item.item_id)
    // var indexNo = this.selectedItems.indexOf(item.item_id);
    if(filterdata.length == 0){
      this.selectedItems.push(item);
    }
    
    console.log(this.selectedItems);
}
taskAscendingOrdr(){
  this.allTask.sort((a, b) => a.name !== b.name ? a.name < b.name ? -1 : 1 : 0);
}
taskDescendingOrdr(){
  this.allTask.sort((a, b) => a.name !== b.name ? a.name > b.name ? -1 : 1 : 0);
}
onSelectAll(items: any){
  this.selectedItems = [];
  this.selectedItems= items;
}
OnItemDeSelect(item:any){
  console.log(item);
  var indexNo = this.selectedItems.indexOf(item.item_id);
  if(indexNo >0){
    this.selectedItems.slice(indexNo);
  }
}
onDeSelectAll(items: any){
  this.selectedItems = [];
}
localUrl: any[];
// showPreviewImage(event: any) {
//     if (event.target.files && event.target.files[0]) {
//         var reader = new FileReader();
//         reader.onload = (event: any) => {
//             this.localUrl = event.target.result;
//         }
//         reader.readAsDataURL(event.target.files[0]);
//     }
// }
tmppath:string;
  fileChange(event: any){
       this.tmppath = URL.createObjectURL(event.target.files[0]);
        $("img").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));      
  }
  userList = [];
  getAllUsers(){
      var that = this;
      // create token
      this._OperationService.get('getAllUser')
      .then(function (response) {
        console.log(response.data);
        let allUser = response.data;
        allUser.forEach(element => {
           that.userList.push({ item_id: element.email, item_text: element.name }) 
        });
        that.dropdownList = that.userList;
    
      })
      .catch(function (error) {
        toastr.error(error.response.data);
      })
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
  addTask(){
    this.tmppath = "";
    this.taskData = {};
  }
  add(){
    if(this.selectedItems.length>0){
      let asignArray = []
      this.selectedItems.forEach(element=>{
         asignArray.push(element.item_id);
      })
      // this.selectedItems =['dipa@gmail.com', 'amit@gmail.com'];
      let ctreateTaskJson:any = {name: this.taskData.name, address: this.taskData.address, description:this.taskData.description, image: this.tmppath, assignedTo:asignArray} 
      var that = this;
      // create token
      this._OperationService.post('insertTask',ctreateTaskJson)
      .then(function (response) {
          toastr.success("success");
          that.getAllTask();
          $("#model-task-add").modal('hide');
         
      })
      .catch(function (error) {
        toastr.error(error.response.data);
      })
    }
    
  }

}
