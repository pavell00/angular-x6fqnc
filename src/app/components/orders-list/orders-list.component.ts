import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import copy from 'copy-to-clipboard';
import { Order } from '../../models/order';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  header: string;

  constructor(private dataService: DataService, private router : Router,private firestore: AngularFirestore, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.displayedColumns = ['TableNo','OrderDate','sumOrder','discountOrder','isDone','Actions'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.dataService.getOrders().subscribe(actionArray => {
      this.orders = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Order;
      })
    });
    //console.log(this.orders);
  }

  onCreateOrder() {
    this.router.navigateByUrl('order-create');
  }

  editOrder(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'orderid': id }
    };
    this.router.navigate(['/order-detail'], navigationExtras);
  }

  createPrintForm(id: string) {
    this.makeHeader();
    
  }

  makeHeader() {
    this.dataService.getParams().get().toPromise().then(
      doc => {//console.log("params data:", doc.data())
        this.header  =  doc.data().headerStr1+'\n';
        this.header +=  doc.data().headerStr2+'\n';
        this.header +=  doc.data().headerStr3+'\n';
        this.header +=  doc.data().headerStr4+'\n';
        this.header +=  doc.data().headerStr5+'\n';
        this.header +=  doc.data().headerStr6+'\n';
        this.header +=  doc.data().headerStr7+'\n';
        this.header +=  doc.data().tableHeader1+'\n';
        this.header +=  doc.data().lineStr+'\n';
        
        /*this.orderNo = doc.data().TableNo;
        this.orderDate = doc.data().OrderDate;
        this.orderIsDone = doc.data().isDone;
        this.orderSum = doc.data().sumOrder;
        this.orderDiscount = doc.data().discountOrder;*/
        copy(this.header);
      }
    )
  }

  delteOrder(id: string) {

  }

  getDocName(id: string) {
    console.log(this.firestore.collection('orders').doc(id).ref.id )
  }
}