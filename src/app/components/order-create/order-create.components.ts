import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgForm } from '@angular/forms';
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
    orderNo: string = 'Стол № 1';
    orderSum: number = 0;
    orderDiscount: number = 0;
    orderIsDone: boolean = false;
    orderGuests: number = 1;
    orderPrintTime: string = '0:00';
    orderCheck: string = '001';

    constructor(private dataService: DataService,
    private firestore: AngularFirestore,
    private toastr: ToastrService) { }

    ngOnInit(): void {
        //this.dataService.items.subscribe(res => this.list = res)
      this.orderDate = this.orderDate.substring(0, this.orderDate.length-3);
    }

    onSave() {
      
    }
}