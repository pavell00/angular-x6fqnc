import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationEnd }     from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DialogData {
  id: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
}

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, AfterContentInit {
  menulist : menuItem[] = [];
  filteredMenulist : menuItem[] = [];
  selectedMenu : menuItem[] = [];
  displayedColumns = ['add','name', 'price', 'qty', 'discount'];
  subscription: Subscription;

  orderDate: string = new Date().toLocaleString();
  orderNo: string = 'Стол № 1';
  orderId: string;
  orderSum: number = 0;
  orderDiscount: number = 0;
  orderDiscountSum: number = 0;
  orderIsDone: boolean;
  orderSumToPay: number = 0;
  orderSumService: number = 0;
  newData: any;
  testData: any

  constructor(private dataService: DataService, private route: ActivatedRoute,
    private firestore: AngularFirestore, public dialog: MatDialog, private toastr: ToastrService) {

  }
  
  ngOnInit() {
    this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as menuItem;
      })
    });
    // Capture the order ID if available
    this.route.queryParams.subscribe(params => {
      this.orderId = params["orderid"];
    });

  }

  onSave() {
    //update existing document
    if (this.orderId) {
      if (this.selectedMenu) this.caclSumOrder();
      this.firestore.collection('orders').doc(this.orderId).update({
        //id: this.orderId,
        OrderDate: this.orderDate, 
        TableNo: this.orderNo,
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        sumDiscount: this.orderDiscountSum,
        sumService: this.orderSumService,
        sumToPay: this.orderSumToPay
        //isDone: true, this.orderSumToPay = this.orderSumService;
      });
      this.storeOrderItems(this.orderId);
      this.toastr.success('Заказ обновлен', 'EMP. Register');
    //this.firestore.collection('orders').doc(this.orderId).collection('lines')
    } else {
      //add new document
      let res = this.firestore.collection('orders').add({
        OrderDate: this.orderDate, 
        TableNo: this.orderNo,
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        sumDiscount: this.orderDiscountSum,
        sumService: this.orderSumService,
        sumToPay: this.orderSumToPay        
        //isDone: true,
      }).then(
        (w) => {
          this.orderId = w.id;
          this.storeOrderItems(w.id);
          //console.log(w.id)
          }
      )
      //this.storeOrderItems(this.orderId);
    }
  }

  caclSumOrder() {
    this.selectedMenu.forEach(
      item => {
        this.orderSum += (item.price * item.qty) * 1
      }
    )
    this.orderDiscountSum = this.orderSum * (this.orderDiscount /100.);
    this.orderSumToPay = this.orderSum - this.orderDiscountSum + this.orderSumService;
  }

  ngAfterContentInit() {
    if (this.orderId) {
      this.getOrderItems2();
      this.fillOrderData();
    } 
  }

  storeOrderItems(id: string) {
    //clear data in subcollection
    //console.log(this.selectedMenu)
    //this.firestore.collection('orders').doc(id).collection('lines').get().toPromise().then(
    //  query => { console.log(query.size);
    //    if (query.size > 0) {
          this.firestore.collection('orders').doc(id).collection('lines').get().toPromise().then(
          snapshot => {snapshot.forEach( d => {
           //.docs.forEach( d => {
              d.ref.delete()
            }
          )}
        )
     // }
    //})
    //console.log(this.selectedMenu)
    //add item to subcollection
    let i=1;
    this.selectedMenu.forEach(
      item => {
        //console.log(item);
        this.firestore.collection('orders').doc(id).collection('lines').add({
          line_no: i,
          name: item.name,
          price: item.price,
          qty: item.qty,
          discount: item.discount
        })
        i++;
      }
    )

  }

  getOrderItems2() {
      if (this.orderId) {
      this.dataService.getSubCollection(this.orderId).subscribe(actionArray => {
        this.selectedMenu = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as menuItem;
        });
      });
    }
  }

  fillOrderData() {
    if (this.orderId) {
        //let docRef = this.firestore.collection('orders').doc(this.orderId);
        this.dataService.getOrder(this.orderId).get().toPromise().then(
          doc => {//console.log("Document data:", doc.data())
            //this.orderId = this.orderId;
            this.orderNo = doc.data().TableNo;
            this.orderDate = doc.data().OrderDate;
            this.orderIsDone = doc.data().isDone;
            this.orderSum = doc.data().sumOrder;
            this.orderDiscount = doc.data().discountOrder;
            this.orderDiscountSum = doc.data().sumDiscount;
            this.orderSumService = doc.data().sumService;
            this.orderSumToPay = doc.data().sumToPay;
          }
        )
      }
  }

  onAdd(item: menuItem) {
    this.selectedMenu.push(item);
    //console.log(this.selectedMenu)
  }

  onDelete(id: string) {
    //console.log(id, this.selectedMenu)
    for(let i = 0; i < this.selectedMenu.length; i++) {
      if(this.selectedMenu[i].id == id) {
        this.selectedMenu.splice(i, 1);
      }
    }
  }

  applyFilter(filterValue: string) {
    //this.orderId.pipe(map(m => console.log(m)))
    this.filteredMenulist = this.menulist.filter(v => v.name.toLowerCase().startsWith(filterValue.trim().toLowerCase()));
  }

  openDialog(item: menuItem): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {id: item.id, name: item.name, price: item.price, qty: item.qty, discount: item.discount}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result) {
        this.newData = result;
        //console.log(this.newData);
        for(let i = 0; i < this.selectedMenu.length; i++) {
          if(this.selectedMenu[i].id == this.newData.id) {
            this.selectedMenu[i].price = this.newData.price;
            this.selectedMenu[i].qty = this.newData.qty;
            this.selectedMenu[i].discount = this.newData.discount;
          }
        }
      }
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './edit-dialog.html',
  styleUrls: ['./edit-dialog.css']
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}