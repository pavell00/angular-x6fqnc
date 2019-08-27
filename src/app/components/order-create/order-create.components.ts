import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Order } from '../../models/order';

@Component({
    selector: 'order-create',
    templateUrl: './order-create.components.html',
    styleUrls: ['./order-create.components.css']
})
export class OrderCreateComponent implements OnInit {
    newOrder: Order;
    orderDate: string = new Date().toLocaleString('ru');
    orderNo: string = '№ 1';
    orderSum: number = 0;
    orderDiscount: number = 0;
    orderIsDone: boolean = false;
    orderGuests: number = 1;
    orderPrintTime: string = '00:00';
    orderCheck: number = 1;

    constructor(private dataService: DataService,
    private firestore: AngularFirestore,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      let d = new Date();
      let mm: number = d.getMonth() + 1;
      let date: string = d.getDate()+'.'+mm+'.'+d.getFullYear().toString().substring(2, 4)+' '+d.getHours()+':'+d.getMinutes();
      this.orderDate = date;
    }

    onSave() {
      //add new document
        let res = this.firestore.collection('orders').add({
        OrderDate: this.orderDate, 
        TableNo: this.orderNo,
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        isDone: false,
        guests: this.orderGuests,
        check: this.orderCheck,
        printTime: this.orderPrintTime
      }).then(
        (w) => {
          //this.orderId = w.id;
          //this.storeOrderItems(w.id);
          //console.log(w.id)
          this.toastr.success('Заказ создан', 'EMP. Register');
          }
      )
    }
}