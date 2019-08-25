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
  strLine4: string;
  strLine5: string;

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
    this.makeHeader(id);
    
  }

  makeHeader(id: string) {
    //Чек # 192264  стол # VIP005       Гостей 4
    //05.07.19      открыт 20:30    печать 00:05
    
    let p1 = this.dataService.getOrder(id).get().toPromise().then(
            doc => {//console.log("document data:", doc.data())
              this.strLine4 = 'Чек '+doc.data().check+'Стол # '+doc.data().TableNo + 'Гостей ' +doc.data().guests+'\n';
              this.strLine5 =  doc.data().OrderDate+'открыт '+doc.data().OrderDate+'печать '+doc.data().printTime+'\n';
              console.log(this.strLine4, this.strLine5)
            }
    )

    let p2 = this.dataService.getParams().get().toPromise().then(
            doc => {//console.log("params data:", doc.data())
              this.header  =  doc.data().headerStr1+'\n';
              this.header +=  doc.data().headerStr2+'\n';
              this.header +=  doc.data().headerStr3+'\n';
              this.header +=  this.strLine4;
              this.header +=  this.strLine5;
              this.header +=  doc.data().headerStr6+'\n';
              this.header +=  doc.data().headerStr7+'\n';
              this.header +=  doc.data().tableHeader1+'\n';
              this.header +=  doc.data().lineStr+'\n';
            }
    )

    let promise = Promise.all([p1, p2])
    promise.then(
      res => {console.log(this.header);
    });
  }

  delteOrder(id: string) {

  }

  getDocName(id: string) {
    console.log(this.firestore.collection('orders').doc(id).ref.id )
  }
}